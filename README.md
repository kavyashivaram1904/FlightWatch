# ✈️ FlightWatch — Flight Management System

FlightWatch is a web-based flight management and status tracking application that allows users to search for flights and view their details. Administrators can add new flights and update flight statuses.

## Features

- 🔍 Search flights by flight number
- 📋 View all recorded flights
- ➕ Add new flight details
- 🔄 Update flight statuses
- 🎨 Color-coded status indicators
- 🗄️ Store flight information in a MySQL database

## Tech Stack

**Frontend:** React, Vite, CSS  
**Backend:** Node.js, Express.js  
**Database:** MySQL  
**API Communication:** REST API

## Project Structure

```text
FlightWatch/
├── frontend/
│   └── React application
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd FlightWatch
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flightwatch
```

Create the `flightwatch` database and the `flights` table in MySQL using the schema required by the application.

Start the backend:

```bash
node server.js
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Flight Statuses

- On Time
- Delayed
- Cancelled
- Boarding

## Note

FlightWatch currently displays flight details stored in its own MySQL database. It does not provide live airline or real-time flight tracking data.

## Future Improvements

- User authentication and administrator access control
- Integration with a live flight data API
- Flight filtering and sorting
- Improved responsive design

## Author

Kavya Shivaram
