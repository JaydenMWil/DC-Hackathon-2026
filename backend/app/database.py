import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'AccessRide.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Enable foreign keys
    cursor.execute('PRAGMA foreign_keys = ON;')

    # Create the stops table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stops (
        stop_id INTEGER PRIMARY KEY,
        stop_name TEXT,
        wheelchair_boarding INTEGER,
        stop_lat REAL,
        stop_lon REAL
    )
    ''')
    
    # Create the schedules table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schedule_label TEXT NOT NULL,
        
        origin_lat REAL NOT NULL,
        origin_lon REAL NOT NULL,
        origin_stop_id INTEGER,
        
        dest_lat REAL NOT NULL,
        dest_lon REAL NOT NULL,
        dest_stop_id INTEGER,
        
        scheduled_days TEXT NOT NULL,
        scheduled_time INTEGER NOT NULL,
        repeating BOOLEAN NOT NULL,
        
        recommended_route_id TEXT,
        recommended_bus_id INTEGER,
        
        FOREIGN KEY (origin_stop_id) REFERENCES stops (stop_id),
        FOREIGN KEY (dest_stop_id) REFERENCES stops (stop_id)
    )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Successfully initialized the database tables in {DB_PATH}")

if __name__ == "__main__":
    init_db()
