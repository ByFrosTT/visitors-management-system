# Visitors and Hostel Management System

A college MERN project for managing hostel rooms, student registrations, room allocations and fee records, with a visitor desk, movement log and leave application interface.

## Stack

React and Vite frontend, Express and Node.js backend, and MongoDB with Mongoose.

## Run locally

Install Node.js compatible with the versions specified in client/package-lock.json and a local MongoDB server, or use MongoDB Atlas.

In a terminal:

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

Edit server/.env with your own MongoDB connection string before starting the backend. The default backend address is http://localhost:5000.

In a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open the address printed by Vite. Keep both terminals running.

## Notes

Rooms, students and fees use the backend database. Visitor, movement and leave records are held in frontend state and reset on reload. The login interface is a demo; production use requires backend authentication and authorization.

Never commit .env files or database credentials. Dependencies are installed using npm and are excluded from version control.
