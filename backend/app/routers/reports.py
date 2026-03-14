from fastapi import APIRouter
from pydantic import BaseModel
import sqlite3
import os

router = APIRouter()

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'AccessRide.db')

class IssueCreate(BaseModel):
    issue_type: str
    details: str | None = None
    bus_name: str | None = None
    stop_name: str | None = None

@router.get("/")
def get_reports():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM issues ORDER BY timestamp DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@router.post("/")
def create_report(issue: IssueCreate):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO issues (issue_type, details, bus_name, stop_name)
        VALUES (?, ?, ?, ?)
    ''', (issue.issue_type, issue.details, issue.bus_name, issue.stop_name))
    conn.commit()
    issue_id = cursor.lastrowid
    conn.close()
    return {"status": "success", "issue_id": issue_id}
