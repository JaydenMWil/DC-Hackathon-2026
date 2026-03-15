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

    # Create the issues table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS issues (
        issue_id INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_type TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        bus_name TEXT,
        route_name TEXT,
        stop_name TEXT,
        CHECK ((bus_name IS NOT NULL AND trim(bus_name) != '') OR 
               (route_name IS NOT NULL AND trim(route_name) != '') OR 
               (stop_name IS NOT NULL AND trim(stop_name) != ''))
    )
    ''')
    
    conn.commit()
    
    # Migration helper: Add route_name if it was missing from older schema
    try:
        cursor.execute("ALTER TABLE issues ADD COLUMN route_name TEXT")
        conn.commit()
        print("Migrated: Added route_name column to issues table")
    except sqlite3.OperationalError:
        # Already exists or table missing
        pass

    conn.close()
    print(f"Successfully initialized the database tables in {DB_PATH}")

if __name__ == "__main__":
    init_db()
