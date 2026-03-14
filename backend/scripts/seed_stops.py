import sqlite3
import csv
import os

DB_PATH = 'app/AccessRide.db'
STOPS_FILE = 'docs/stops.txt'

def create_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stops (
            stop_id TEXT PRIMARY KEY,
            stop_name TEXT NOT NULL,
            stop_lat REAL NOT NULL,
            stop_lon REAL NOT NULL,
            wheelchair_boarding INTEGER DEFAULT 0
        )
    ''')

def seed_stops():
    # Ensure stops.txt exists
    if not os.path.exists(STOPS_FILE):
        print(f"Error: {STOPS_FILE} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    create_table(cursor)
    
    # Clear existing to prevent duplicates during testing
    cursor.execute('DELETE FROM stops')

    count = 0
    with open(STOPS_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        stops_data = []
        for row in reader:
            try:
                stop_id = row['stop_id']
                stop_name = row['stop_name']
                stop_lat = float(row['stop_lat'])
                stop_lon = float(row['stop_lon'])
                wheelchair = int(row.get('wheelchair_boarding', 0) or 0)
                
                stops_data.append((stop_id, stop_name, stop_lat, stop_lon, wheelchair))
                count += 1
            except (KeyError, ValueError) as e:
                print(f"Skipping row due to error: {e}. Row: {row}")

        # Bulk insert
        cursor.executemany('''
            INSERT INTO stops (stop_id, stop_name, stop_lat, stop_lon, wheelchair_boarding)
            VALUES (?, ?, ?, ?, ?)
        ''', stops_data)

    conn.commit()
    conn.close()
    print(f"Successfully seeded {count} stops into the database.")

if __name__ == "__main__":
    seed_stops()
