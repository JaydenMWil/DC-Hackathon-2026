from fastapi import APIRouter, HTTPException, Depends
import os
from typing import List

from app.schemas.schedules import ScheduleCreate, ScheduleUpdate, ScheduleResponse
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[ScheduleResponse])
def get_schedules(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM schedules")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.post("/", response_model=ScheduleResponse)
def create_schedule(schedule: ScheduleCreate, db=Depends(get_db)):
    cursor = db.cursor()
    
    cursor.execute('''
        INSERT INTO schedules (
            schedule_label, origin_lat, origin_lon, origin_stop_id,
            dest_lat, dest_lon, dest_stop_id,
            scheduled_days, scheduled_time, repeating,
            recommended_route_id, recommended_bus_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        schedule.schedule_label, schedule.origin_lat, schedule.origin_lon, schedule.origin_stop_id,
        schedule.dest_lat, schedule.dest_lon, schedule.dest_stop_id,
        schedule.scheduled_days, schedule.scheduled_time, schedule.repeating,
        schedule.recommended_route_id, schedule.recommended_bus_id
    ))
    db.commit()
    new_id = cursor.lastrowid
    
    response_data = schedule.dict()
    response_data["id"] = new_id
    return response_data

@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(schedule_id: int, schedule: ScheduleUpdate, db=Depends(get_db)):
    cursor = db.cursor()
    
    cursor.execute("SELECT id FROM schedules WHERE id = ?", (schedule_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Schedule not found")
        
    cursor.execute('''
        UPDATE schedules
        SET schedule_label = ?, origin_lat = ?, origin_lon = ?, origin_stop_id = ?,
            dest_lat = ?, dest_lon = ?, dest_stop_id = ?,
            scheduled_days = ?, scheduled_time = ?, repeating = ?,
            recommended_route_id = ?, recommended_bus_id = ?
        WHERE id = ?
    ''', (
        schedule.schedule_label, schedule.origin_lat, schedule.origin_lon, schedule.origin_stop_id,
        schedule.dest_lat, schedule.dest_lon, schedule.dest_stop_id,
        schedule.scheduled_days, schedule.scheduled_time, schedule.repeating,
        schedule.recommended_route_id, schedule.recommended_bus_id,
        schedule_id
    ))
    db.commit()
    
    response_data = schedule.dict()
    response_data["id"] = schedule_id
    return response_data

@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, db=Depends(get_db)):
    cursor = db.cursor()
    
    cursor.execute("SELECT id FROM schedules WHERE id = ?", (schedule_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Schedule not found")
        
    cursor.execute("DELETE FROM schedules WHERE id = ?", (schedule_id,))
    db.commit()
    
    return {"status": "success", "message": "Schedule deleted successfully"}
