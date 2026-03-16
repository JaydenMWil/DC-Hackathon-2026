# AccessRide 🚌

**Inclusive Transit Companion for the Durham Region**

AccessRide is a premium, cross-platform accessibility-first mobile application designed to make public transit more inclusive and rewarding. It integrates real-time transit data from Durham Region Transit (DRT) with community-driven reporting, a gamified rewards system, and smart routine reminders.

---

## 🏗️ Project Architecture

AccessRide follows a modern, decoupled architecture:

- **Frontend**: React Native with Expo & Expo Router.
- **Backend**: Python with FastAPI, leveraging asynchronous operations for real-time tracking.
- **Database**: SQLite3 for lightweight, efficient data persistence.

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
   pip install -r requirements.txt
   ```

4. **Run the Server**:
   ```powershell
   cd backend
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   _The server will start at `http://localhost:8000`._

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
   The app uses `process.env.EXPO_PUBLIC_API_URL`. Ensure your local machine's IP address is configured if testing on a physical device.

4. **Start the App**:

   ```bash
   cd frontend
   npx expo start -c
   ```

5. **Open on Device**:
   - **iOS/Android**: Scan the QR code with your camera or the Expo Go app.
   - **Web**: Press `w` in the terminal to open in your browser.

---

## 🛠️ Key Features

- **♿ Accessibility-First Design**: Built with the **Lexend (The Inclusive)** font pairing for maximum legibility and universal design.
- **🌈 Unified Theme System**: Dynamic support for **Dark Mode**, **High Contrast Mode**, and multiple **Font Size** scales, all WCAG 2.1 AA compliant.
- **🧠 Smart Routine Reminders**: Habit-based transit notifications that automatically suggest accessible reroutes if barriers are detected.
- **📍 Real-Time Proximity Alerts**: Radius-based GPS notifications (150m, 100m, 50m) with vibration and audio cues.
- **🚨 Community Reporting**: Live updates on bus missed, wheelchair ramp outages, and crowding, with real-time polling (30s) and pull-to-refresh.
- **🎁 Gamified Rewards**: Earn points and badges for inclusive transit habits, redeemable at local business partners.

---

## 📁 Repository Structure

```text
├── backend/
│   ├── app/                # FastAPI Application Core
│   │   ├── routers/        # API Route Handlers (Alerts, Schedules, etc.)
│   │   ├── models/         # Database Models
│   │   ├── services/       # Business Logic & GTFS Integration
│   │   └── main.py         # App Entry Point
│   └── scripts/            # Database Migrations & Seeders
├── frontend/
│   ├── app/                # Expo Router Navigation & Tab Views
│   ├── components/         # Reusable UI & Modular Modals
│   ├── core/               # Foundational Logic (API, Themes, Data, Styles)
│   └── assets/             # Branding & Font Assets
```
