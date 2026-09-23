# Planwise — Project Management App

A small MERN app with user accounts, project and task management, a team directory, task assignment, and a status board.

## Stack
React + Vite, Express + Node.js, MongoDB + Mongoose, JWT, bcrypt.

## Local setup
1. Install dependencies with `npm install`.
2. Start MongoDB locally or create an Atlas database.
3. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a private `JWT_SECRET`.
4. The frontend uses root `.env` setting `VITE_API_URL=/api`. Vite proxies this to Express on port 5000.
5. Start the API with `npm run server`.
6. In a second terminal run `npm run dev` and open the URL Vite prints.

## Structure
- `src/components`: shared UI and form components
- `src/pages`: overview, projects, task board, and team screens
- `src/services`: frontend API and workspace operations
- `server/routes`: API route definitions
- `server/controllers`: HTTP request and response handling
- `server/services`: authentication, dashboard, and data operations
- `server/models`: Mongoose schemas
- `server/middleware`: authentication middleware
- `server/config`: database connection

Each account only accesses its own records. Passwords are hashed before they are stored. Deleting a project also deletes its tasks; deleting a team member unassigns their tasks.
