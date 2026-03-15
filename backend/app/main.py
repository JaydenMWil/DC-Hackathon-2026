from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import buses, alerts, rewards, reports, schedules, stops

app = FastAPI(title="BusAccess DC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(buses.router, prefix="/buses", tags=["buses"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
app.include_router(rewards.router, prefix="/rewards", tags=["rewards"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(schedules.router, prefix="/schedules", tags=["schedules"])
app.include_router(stops.router, prefix="/stops", tags=["stops"])