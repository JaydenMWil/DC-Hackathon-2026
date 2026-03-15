from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.database import get_db
import os

router = APIRouter()

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'AccessRide.db')

class IssueCreate(BaseModel):
    issue_type: str = Field(..., min_length=3)
    details: str | None = Field(None, max_length=500)
    bus_name: str | None = None
    route_name: str | None = None
    stop_name: str | None = None

@router.get("/")
def get_reports(db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM issues ORDER BY timestamp DESC LIMIT 50")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@router.post("/")
def create_report(issue: IssueCreate, db=Depends(get_db)):
    if not any([issue.bus_name, issue.route_name, issue.stop_name]):
        raise HTTPException(status_code=400, detail="Missing context: bus, route, or stop name must be provided.")
        
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO issues (issue_type, details, bus_name, route_name, stop_name)
        VALUES (?, ?, ?, ?, ?)
    ''', (issue.issue_type, issue.details, issue.bus_name, issue.route_name, issue.stop_name))
    db.commit()
    issue_id = cursor.lastrowid
    return {"status": "success", "issue_id": issue_id}
