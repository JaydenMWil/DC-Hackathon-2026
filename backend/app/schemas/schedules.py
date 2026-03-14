from pydantic import BaseModel
from typing import Optional

class ScheduleBase(BaseModel):
    schedule_label: str
    origin_lat: float
    origin_lon: float
    origin_stop_id: Optional[int] = None
    dest_lat: float
    dest_lon: float
    dest_stop_id: Optional[int] = None
    scheduled_days: str
    scheduled_time: int
    repeating: bool
    recommended_route_id: Optional[str] = None
    recommended_bus_id: Optional[int] = None

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(ScheduleBase):
    pass

class ScheduleResponse(ScheduleBase):
    id: int

    class Config:
        from_attributes = True
