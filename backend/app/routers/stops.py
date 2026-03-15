from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from ..services.bus_tracking import calculate_distance
from ..database import get_db
from pydantic import BaseModel

router = APIRouter()

class StopResponse(BaseModel):
    stop_id: str
    stop_name: str
    stop_lat: float
    stop_lon: float
    wheelchair_boarding: int
    distance_meters: float

@router.get("/", response_model=List[StopResponse])
def get_closest_stops(
    lat: float = Query(..., description="Latitude of the center point"),
    lon: float = Query(..., description="Longitude of the center point"),
    limit: int = Query(5, description="Number of closest stops to return"),
    radius_km: float = Query(2.0, description="Search radius in kilometers"),
    db=Depends(get_db)
):
    try:
        cursor = db.cursor()

        # Simple bounding box for SQLite optimization (approximate: 1 degree latitude ~ 111km)
        # 1 degree longitude varies, but 1 degree ~ 111km * cos(latitude)
        lat_delta = radius_km / 111.0
        # To be safe and avoid math errors, we'll use a slightly larger rough delta for lon
        lon_delta = radius_km / 70.0 

        min_lat, max_lat = lat - lat_delta, lat + lat_delta
        min_lon, max_lon = lon - lon_delta, lon + lon_delta

        cursor.execute('''
            SELECT stop_id, stop_name, stop_lat, stop_lon, wheelchair_boarding 
            FROM stops
            WHERE stop_lat BETWEEN ? AND ? 
              AND stop_lon BETWEEN ? AND ?
        ''', (min_lat, max_lat, min_lon, max_lon))
        
        rows = cursor.fetchall()

        stops_with_distance = []
        for row in rows:
            dist = calculate_distance(lat, lon, row['stop_lat'], row['stop_lon'])
            
            # Since Haversine is accurate, double check it's within our intended radius
            if dist <= (radius_km * 1000):
                stops_with_distance.append({
                    "stop_id": row["stop_id"],
                    "stop_name": row["stop_name"],
                    "stop_lat": row["stop_lat"],
                    "stop_lon": row["stop_lon"],
                    "wheelchair_boarding": row["wheelchair_boarding"],
                    "distance_meters": round(dist, 1)
                })

        # Sort by closest first
        stops_with_distance.sort(key=lambda x: x["distance_meters"])

        return stops_with_distance[:limit]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
