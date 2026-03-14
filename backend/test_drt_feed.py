import requests
from google.transit import gtfs_realtime_pb2

feed = gtfs_realtime_pb2.FeedMessage()
response = requests.get('https://drtonline.durhamregiontransit.com/gtfsrealtime/VehiclePositions')
feed.ParseFromString(response.content)

print(f"Total vehicles: len(feed.entity)")
count = 0
for entity in feed.entity:
    if entity.HasField('vehicle'):
        v = entity.vehicle
        print(f"id: {v.vehicle.id}, route_id: {v.trip.route_id}, occupancy: {v.occupancy_status}")
        count += 1
        if count > 5:
            break
