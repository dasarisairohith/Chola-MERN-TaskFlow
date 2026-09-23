# TaskFlow – MERN Task Management Platform

A full-stack MERN application for managing teams, tasks, priorities, and progress.

## Stack
- MongoDB + Mongoose
- Express.js
- React.js + Vite
- Node.js
- JWT authentication

## Features
- User registration and login
- JWT-protected APIs
- Create, update, delete and filter tasks
- Task priorities and status tracking
- Dashboard with task statistics
- Responsive React UI

## Run locally

### 1. Server
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Client
```bash
cd client
npm install
npm run dev
```

Set `MONGO_URI` in `server/.env` to a local MongoDB instance or MongoDB Atlas connection string.
