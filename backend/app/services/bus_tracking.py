import os
import csv
from math import radians, sin, cos, sqrt, atan2
import requests
from google.transit import gtfs_realtime_pb2
from datetime import datetime

# Cache for routes
ROUTES_CACHE = {}
ROUTES_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs', 'routes.txt')

def load_routes():
    global ROUTES_CACHE
    if not os.path.exists(ROUTES_FILE):
        return
    try:
        with open(ROUTES_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                route_id = row['route_id'].strip()
                ROUTES_CACHE[route_id] = {
                    "short_name": row['route_short_name'],
                    "long_name": row['route_long_name']
                }
    except Exception as e:
        print(f"Error loading routes: {e}")

# Initial load
load_routes()

OCCUPANCY_MAP = {
    0: "low",     # EMPTY
    1: "low",     # MANY_SEATS_AVAILABLE
    2: "medium",  # FEW_SEATS_AVAILABLE
    3: "high",    # STANDING_ROOM_ONLY
    4: "high",    # CRUSH_CAPACITY
    5: "high",    # FULL
    6: "low"      # NOT_ACCEPTING_PASSENGERS (mapped to low for UI safety or could be hidden)
}

def fetch_all_bus_positions():
    # Vehicle Positions
    vp_feed = gtfs_realtime_pb2.FeedMessage()
    vp_response = requests.get('https://drtonline.durhamregiontransit.com/gtfsrealtime/VehiclePositions')
    
    # Trip Updates (for predictions/ETA)
    tu_feed = gtfs_realtime_pb2.FeedMessage()
    tu_response = requests.get('https://drtonline.durhamregiontransit.com/gtfsrealtime/TripUpdates')

    if not vp_response.ok:
        return []

    vp_feed.ParseFromString(vp_response.content)
    
    predictions = {}
    if tu_response.ok:
        tu_feed.ParseFromString(tu_response.content)
        for entity in tu_feed.entity:
            if entity.HasField('trip_update'):
                trip_id = entity.trip_update.trip.trip_id
                # Get the next arrival prediction
                for stop_time_update in entity.trip_update.stop_time_update:
                    if stop_time_update.HasField('arrival'):
                        predictions[trip_id] = stop_time_update.arrival.time
                        break

    buses = []
    for entity in vp_feed.entity:
        if entity.HasField('vehicle'):
            v = entity.vehicle
            route_id = v.trip.route_id.strip()
            trip_id = v.trip.trip_id.strip()
            
            route_info = ROUTES_CACHE.get(route_id, {"short_name": route_id, "long_name": "Unknown Route"})
            
            bus = {
                "id": v.vehicle.id,
                "lat": v.position.latitude,
                "lon": v.position.longitude,
                "route_id": route_id,
                "route_name": route_info["short_name"],
                "route_long_name": route_info["long_name"],
                "crowding": OCCUPANCY_MAP.get(v.occupancy_status, "low"),
                "accessible": True, # DRT buses are generally accessible
                "timestamp": v.timestamp
            }

            buses.append(bus)
            
    return buses


def calculate_distance(lat1, lon1, lat2, lon2):
    """Haversine formula — distance between two points in meters"""
    R = 6371000  # Earth's radius in meters
    
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c

def get_nearby_buses_service(lat: float, lon: float, radius: int):
    AVG_BUS_SPEED_KMH = 25  # Average urban transit speed
    buses = fetch_all_bus_positions()
    
    nearby = []
    for bus in buses:
        dist = calculate_distance(lat, lon, bus["lat"], bus["lon"])
        if dist <= radius:
            bus["distance_m"] = round(dist)
            
            # Distance-based ETA: distance / speed, converted to minutes
            dist_km = dist / 1000
            eta_min = round((dist_km / AVG_BUS_SPEED_KMH) * 60)
            
            if eta_min < 1:
                bus["eta"] = "Due"
            elif eta_min == 1:
                bus["eta"] = "1 min"
            else:
                bus["eta"] = f"{eta_min} min"
            
            nearby.append(bus)
    
    # Sort by distance
    nearby.sort(key=lambda x: x["distance_m"])
    
    return {"buses": nearby}