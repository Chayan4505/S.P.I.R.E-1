![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

![WebSocket](https://img.shields.io/badge/WebSocket-RealTime-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

# Backend for Design and Development of an ESP32 based Autonomous Mobile Irrigation Robot using Real time Soil Monitoring

> **A scalable real-time backend powering an ESP32-based Smart Irrigation Robot capable of autonomous navigation, soil analysis, live telemetry, GPS tracking, WebSocket communication, notifications, alerts, and data export.**

#### Built with **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **WebSockets**.

---

# ✨ Features

## 🤖 Robot Management

- Robot pairing with secure Pair Code
- Pending Robot discovery
- Ownership validation
- Robot online/offline monitoring
- Session-based robot path tracking
- Automatic heartbeat detection
- Firmware version management

---

## 📡 Real-Time Communication

- Native WebSocket communication
- Dashboard authentication over WebSocket
- Live telemetry streaming
- Robot status updates
- Robot command forwarding
- Live alerts
- Live notifications
- Instant robot online/offline events

---

## 🌱 Telemetry

- Live soil monitoring
- GPS tracking
- Water level monitoring
- Pump status monitoring
- Robot mode monitoring
- Latest telemetry API
- Telemetry history
- Graph aggregation
- CSV Export

Supported soil parameters:

- Moisture
- Temperature
- Electrical Conductivity (EC)
- pH
- Nitrogen
- Phosphorus
- Potassium
- Salinity
- Total Dissolved Solids (TDS)

---

## 📈 Analytics

Supports graph aggregation for

- Last 24 Hours
- Last 7 Days
- Last Month
- Last Year

Aggregation is performed using MongoDB Aggregation Pipelines to efficiently reduce millions of telemetry records into graph-ready datasets.

---

## 🔔 Alerts & Notifications

### Alerts

- Low Water
- GPS Lost
- Custom Alerts

### Notifications

- Robot Connected
- Robot Disconnected
- Auto Mode
- Manual Mode
- Pump Started
- Pump Stopped
- Pair Successful
- Custom Notifications

---

## 🔐 Security

- JWT Authentication
- Protected REST APIs
- Protected WebSocket Dashboard Connection
- Owner Validation
- Robot Ownership Verification
- Hashed Passwords
- Hashed Robot Pair Code
- Rate Limiting
- Secure Robot Pairing

---

## ⚡ Performance Optimizations

- MongoDB Aggregation Pipelines
- Compound Indexes
- TTL Indexes
- Lean Queries
- Latest 100 Records History
- Session-based GPS Path
- WebSocket Broadcasting
- Automatic Pending Robot Cleanup

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| Email | Nodemailer |
| CSV Export | json2csv |
| Real-Time Communication | ws (WebSocket) |
| Environment Variables | dotenv |

---

## 🏗️ Folder Structure

```text
Backend/
│
├── node_modules/
│
├── src/
│ │
│ ├── Config/
│ │ └── db.js
│ │
│ ├── Controller/
│ │ ├── alertController.js
│ │ ├── authController.js
│ │ ├── exportController.js
│ │ ├── graphController.js
│ │ ├── notificationController.js
│ │ ├── robotController.js
│ │ └── telemetryController.js
│ │
│ ├── Middleware/
│ │ ├── authMiddleware.js
│ │ ├── errorMiddleware.js
│ │ ├── rateLimitMiddleware.js
│ │
│ ├── Models/
│ │ ├── Alert.js
│ │ ├── Notification.js
│ │ ├── OTP.js
│ │ ├── PendingRobot.js
│ │ ├── Robot.js
│ │ ├── Telemetry.js
│ │ └── User.js
│ │
│ ├── Routes/
│ │ ├── alertRoute.js
│ │ ├── authRoute.js
│ │ ├── exportRoute.js
│ │ ├── graphRoute.js
│ │ ├── notificationRoute.js
│ │ ├── robotRoute.js
│ │ └── telemetryRoute.js
│ │
│ ├── Services/
│ │ ├── alertService.js
│ │ ├── emailService.js
│ │ ├── emailTemplates.js
│ │ ├── notificationService.js
│ │ └── telemetryService.js
│ │
│ └── Websocket/
│   ├── alertHandler.js
│   ├── clients.js
│   ├── commandHandler.js
│   ├── dashboardHandler.js
│   ├── heartbeat.js
│   ├── notificationHandler.js
│   ├── statusHandler.js
│   ├── telemetryHandler.js
│   └── webSocket.js
│
├── .env
├── app.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

---

# 📁 Folder Description

| Folder | Purpose |
|---------|----------|
| Config | Database configuration and application setup |
| Controller | Handles incoming REST API requests and business logic |
| Middleware | Authentication, rate limiting, and error handling |
| Models | MongoDB schemas and collections |
| Routes | REST API endpoint definitions |
| Services | Reusable business logic shared across controllers and WebSocket handlers |
| Websocket | Complete real-time communication layer between Dashboard and ESP32 microcontroller |
| app.js | Express application configuration |
| server.js | Application entry point |

---


# 🏗 Backend Architecture

```text
                    React Dashboard
                           │
                 REST API / WebSocket
                           │
                 ┌─────────▼─────────┐
                 │     Express.js    │
                 └─────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     Controllers      WebSocket       Middleware
          │             Handlers           │
          │                │               │
          └──────────┬─────┴───────────────┘
                     │
                 Services
                     │
              MongoDB (Atlas)
                     │
      User | Robot | Telemetry | Alerts
```

---

# 🔄 System Workflow

```text
                 ESP32 Robot
                      │
                WiFi Connection
                      │
               WebSocket Connect
                      │
              Robot Authentication
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   Telemetry                 Robot Status
        │                           │
        └──────────────┬────────────┘
                       ▼
                    Backend
                       │
                    MongoDB
                       │
              WebSocket Broadcast
                       │
                       ▼
                React Dashboard
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Sreejib-Nandy/Development-of-an-ESP32-based-Autonomous-Mobile-Irrigation-Robot-using-Real-time-Soil-Monitoring.git
```

```bash
cd Backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# ⚙ Environment Variables

Create a **.env** file inside the project root.

```env
PORT = 

NODE_ENV =

MONGO_URI_ATLAS = 

JWT_SECRET = 

JWT_EXPIRES =

SENDER_EMAIL =

SMTP_USER =

SMTP_PASS =
```

> **Note:** Never commit your `.env` file to GitHub. Add it to `.gitignore`.

---

# ▶ Running the Project

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

---

# 📦 Available Scripts

| Script | Description |
|---------|-------------|
| npm install | Install all dependencies |
| npm run dev | Start development server |
| npm start | Start production server |

---

# 🤝 Contributing

Contributions are welcome!

1. Fork this repository

2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add my feature"
```

4. Push to your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📡 REST API 

All API responses follow a standard JSON response format.

## 🔐 Authentication APIs

Base URL

```
/api/auth
```

| Method  | Endpoint           | Authentication  | Description          |
|---------|--------------------|-----------------|----------------------|
| POST    | `/register`        | ❌             | Register a new user   |
| POST    | `/verify-email`    | ❌             | Verify email OTP      |
| POST    | `/resend-otp`      | ❌             | Resend OTP            |
| POST    | `/login`           | ❌             | Login user            |
| GET     | `/me`              | ✅             | Fetch user profile    |
| PATCH   | `/change-password` | ✅             | Change password       |
| DELETE  | `/delete-profile`  | ✅             | Delete user profile   |
| POST    | `/logout`          | ✅             | Logout user           |

---

## 🤖 Robot APIs

Base URL

```
/api/robot
```

| Method | Endpoint   | Authentication | Description              |
|--------|------------|----------------|--------------------------|
| GET    | `/pending` | ✅            | Show all pending robots   |
| POST   | `/pair`    | ✅            | Pair a new robot          |
| GET    | `/`        | ✅            | Get all paired robots     |
| DELETE | `/:robotId`| ✅            | Delete robot              |

---

## 🌱 Telemetry APIs

Base URL

```
/api/telemetry
```

| Method | Endpoint           | Authentication | Description                        |
|--------|--------------------|----------------|------------------------------------|
| GET    | `/latest/:robotId` | ✅             | Get latest telemetry               |
| GET    | `/history/:robotId`| ✅             | Get latest 100 telemetry records   |
| GET    | `/path/:robotId`   | ✅             | Get current robot session GPS path |

---

## 📈 Alert APIs

Base URL

```
/api/alerts
```

| Method | Endpoint    | Authentication | Description   |
|--------|-------------|----------------|---------------|
| GET    | `/`         | ✅             | Get alerts    |
| PATCH  | `/read-all` | ✅             | Mark as read  |
| DELETE | `/`         | ✅             | Delete alerts |

---

## 📈 Notification APIs

Base URL

```
/api/notifications
```

| Method | Endpoint    | Authentication | Description          |
|--------|-------------|----------------|----------------------|
| GET    | `/`         | ✅             | Get notifications    |
| PATCH  | `/read-all` | ✅             | Mark as read         |
| DELETE | `/`         | ✅             | Delete notifications |

---

## 📈 Export API

Base URL

```
/api/export
```

| Method | Endpoint        | Authentication | Description                 |
|--------|-----------------|----------------|-----------------------------|
| GET    | `/csv/:robotId` | ✅             | Export datas in CSV format  |

---

## 📈 Graph API

Base URL

```
/api/graphs
```

| Method | Endpoint    | Authentication | Description |
|--------|-------------|----------------|-------------|
| GET    | `/:robotId` | ✅             | Plot graphs |

---

# 🌐 WebSocket Protocol

The backend uses WebSockets for real-time communication between the ESP32 Robot and the React Dashboard.

---

## Dashboard → Backend

| Packet            | Purpose                |
|-------------------|------------------------|
| dashboard-connect | Authenticate Dashboard |
| robot-command     | Send Robot Command     |

---

## ESP32 → Backend

| Packet        | Purpose             |
|---------------|---------------------|
| robot-connect | Connect Robot       |
| telemetry     | Send Telemetry      |
| robot-status  | Status Updates      |
| alert         | Hardware Alerts     |
| notification  | Robot Notifications |

---

# 🖥 Backend → Dashboard

| Packet                 | Description                |
|------------------------|----------------------------|
| dashboard-connected    | Dashboard Authenticated    |
| robot-online           | Robot Connected            |
| robot-offline          | Robot Disconnected         |
| robot-paired           | Pair Successful            |
| robot-not-paired       | Awaiting Pairing           |
| telemetry              | Live Telemetry             |
| robot-status           | Robot Status               |
| alert                  | Live Alert                 |
| notification           | Live Notification          |
| command-sent           | Robot Command Forwarded    |
| alerts-cleared         | Alerts Deleted             |
| notifications-cleared  | Notifications Deleted      |
| telemetry-error        | Telemetry Processing Error |
| command-error          | Robot Command Error        |

---

# 🔄 Robot Pairing Workflow

```text
Power On Robot
        │
        ▼
ESP32 AP Mode
        │
        ▼
User Enters Home WiFi
        │
        ▼
ESP32 STA Mode
        │
        ▼
robot-connect
        │
        ▼
PendingRobot Collection
        │
        ▼
User Login
        │
        ▼
Pair Robot
        │
        ▼
Enter:
 • Robot Name
 • Robot ID (MAC Address)
 • Pair Code
        │
        ▼
Robot Collection
        │
        ▼
PendingRobot Deleted
        │
        ▼
robot-paired Packet
```

---

# 🔄 Live Telemetry Workflow

```text
ESP32 Sensors
        │
        ▼
Telemetry Packet
        │
        ▼
WebSocket
        │
        ▼
Telemetry Handler
        │
        ▼
MongoDB
        │
        ▼
Broadcast
        │
        ▼
React Dashboard
```

# 🗄 Database Collections

The backend is powered by **MongoDB Atlas** using **Mongoose ODM**.

The project uses the following collections:

| Collection   | Purpose                                                         |
|--------------|-----------------------------------------------------------------|
| User         | Stores registered users                                         |
| OTP          | Stores temporary OTPs for email verification and password reset |
| Robot        | Stores paired robots                                            |
| PendingRobot | Stores robots waiting for pairing                               |
| Telemetry    | Stores real-time robot telemetry                                |
| Notification | Stores robot notifications                                      |
| Alert        | Stores warning and critical alerts                              |

---

# 📊 Telemetry Schema

Each telemetry document contains

```text
Robot Information
│
├── Robot
├── Robot ID
├── Mode
├── Pump Status
├── Water Level
│
├── GPS
│   ├── Latitude
│   ├── Longitude
│   ├── Satellites
│   └── Altitude
│
└── Soil
    ├── Moisture
    ├── Temperature
    ├── EC
    ├── pH
    ├── Nitrogen
    ├── Phosphorus
    ├── Potassium
    ├── Salinity
    └── TDS
```

---

# ❤️ Heartbeat Monitoring

The backend continuously monitors robot connectivity.

```text
Robot

↓

Heartbeat Ping

↓

Pong Received

↓

Alive

---------------------

No Pong

↓

Robot Offline

↓

Dashboard Updated

↓

Robot Status Saved
```

Heartbeat interval

```text
30 Seconds
```

---

# 🛰 Session Management

GPS paths are session-based.

Instead of returning every GPS point stored in MongoDB,

the backend only returns

```
Current Robot Session
```

This prevents old field paths from being mixed with the current robot run.

---

# 📤 CSV Export

Telemetry can be exported as CSV.

Export includes

- Timestamp
- Robot ID
- Mode
- Pump Status
- Water Level
- Latitude
- Longitude
- Satellites
- Altitude
- Moisture
- Temperature
- EC
- pH
- Nitrogen
- Phosphorus
- Potassium
- Salinity
- TDS

---

# 📊 Graph Analytics

Graph data is generated using MongoDB Aggregation Pipelines.

Supported periods

```text
Day

Week

Month

Year
```

Data is automatically averaged to reduce millions of telemetry records into graph-friendly datasets.

---

# 🌐 WebSocket Architecture

```text
                Dashboard
                     ▲
                     │
             WebSocket Broadcast
                     │
        ┌────────────┴────────────┐
        │                         │
 Notification              Telemetry
        │                         │
        └────────────┬────────────┘
                     │
             WebSocket Server
                     │
     ┌───────────────┼───────────────┐
     │               │               │
 Dashboard     Robot Status     Robot Command
     │               │               │
     └───────────────┼───────────────┘
                     │
                   ESP32
```

---

# 🚀 Deployment

The backend can be deployed on

- Render
- Railway
- VPS
- DigitalOcean
- AWS EC2
- Azure
- Google Cloud

MongoDB Atlas is recommended as the database.

---

# 🌍 Environment

Minimum requirements

- Node.js 20+
- MongoDB Atlas
- npm
- Internet Connection
- Gmail SMTP (for OTP emails)

---

# 📌 Future Improvements

The project roadmap includes

- OTA Firmware Updates
- Cloud Image Storage
- AI-powered Crop Analytics
- ML Model Integration
- Historical Heatmaps

---

# 📜 License

This project is licensed under the **MIT License**.

Feel free to use, modify and distribute this project in accordance with the license terms.

---

# 👨‍💻 Author

**Sreejib Nandy**

B.Tech CSE

Netaji Subhash Engineering College

---

# ⭐ Support

If you found this project useful,

please consider giving this repository a ⭐ on GitHub.

It helps others discover the project and motivates future development.

---

# 📬 Contact

If you have any questions, suggestions, or would like to collaborate on this project, feel free to reach out.

📧 Email: sreejibnandy2518@gmail.com

---

⭐ **If you like this project, don't forget to star the repository!**