from fastapi import APIRouter
from app.services.bus_tracking import get_nearby_buses_service, fetch_all_bus_positions





router = APIRouter()


@router.get("/nearby")
def get_nearby_buses(lat: float, lon: float, radius: int = 200):
    return get_nearby_buses_service(lat,lon,radius)

@router.get("/positions")
def get_all_positions():
    return {"buses": fetch_all_bus_positions()}