from fastapi import FastAPI
from app.routers import buses, alerts, rewards, reports, schedules

app = FastAPI(title="BusAccess DC")

app.include_router(buses.router, prefix="/buses", tags=["buses"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(schedules.router, prefix="/schedules", tags=["schedules"])