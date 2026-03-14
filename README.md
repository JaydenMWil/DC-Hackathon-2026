# AccessRide 🚌

**Inclusive Transit Companion for the Durham Region**

AccessRide is a cross-platform mobile application designed to make public transit more accessible and rewarding. It integrates real-time transit data from Durham Region Transit (DRT) with community-driven reporting and a gamified rewards system.

---

## 🏗️ Project Architecture

- **Frontend**: React Native with Expo (located in `/frontend`)
- **Backend**: Python with FastAPI (located in `/backend`)
- **Database**: SQLite3 (located in `/backend/database`)

---

## 🚀 Getting Started

### 📡 Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Python 3.10+](https://www.python.org/downloads/)
- [Expo Go](https://expo.dev/go) app on your physical device (optional, for testing)

---

## 🐍 Backend Setup (FastAPI)

1. **Navigate to the backend directory**:

   ```powershell
   cd backend
   ```

2. **Create and Activate a Virtual Environment**:

   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Dependencies**:

   ```powershell
   pip install fastapi uvicorn requests gtfs-realtime-bindings protobuf
   ```

4. **Run the Server**:
   ```powershell
   cd backend
   python main.py
   ```
   _The server will start at `http://localhost:5000`._
   go here and add your device IP address if you want physical apps to work \_frontend\config.js
   <!-- -> API_URL = "http://[IP_ADDRESS]:5000" -->

---

## 📱 Frontend Setup (Expo)

1. **Navigate to the frontend directory**:

   ```powershell
   cd frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure API URL**:
   Open `frontend/config.js` and update the `API_URL` to match your computer's local IP address if testing on a physical device.

4. **Start the App**:

   ```bash
   cd frontend
   npx expo start
   ```

5. **Open on Device**:
   - **iOS/Android**: Scan the QR code with your camera or the Expo Go app.
   - **Web**: Press `w` in the terminal to open in your browser.

---

## 🛠️ Key Features

- **Real-Time GTFS Tracking**: Live bus positions and estimated arrival times.
- **Accessibility Indicators**: Visual tags for accessible routes and reported barriers.
- **Community Reports**: Log issues like crowding, missed buses, or broken elevators.
- **Gamification**: Earn points and badges for using accessible transit and helping the community.
- **Haptic Feedback**: Premium tactile feel during navigation (on physical devices).

---

## 📁 Repository Structure

````text
├── backend/
│   ├── api/v1/         # API Route Handlers
│   ├── database/       # SQLite DB and Setup Scripts
│   ├── src/            # Core Python Logic (User/Vehicle classes)
│   └── main.py         # Entry point (FastAPI Server)
├── frontend/
│   ├── app/            # Expo Router Pages & Tabs
│   ├── components/     # Reusable UI Components
│   └── config.js       # Global API Configuration
```<!--  -->
````
