# FitPlanHub

A MERN stack fitness marketplace platform connecting trainers and trainees. Users can discover workout plans, follow their favorite trainers, and subscribe to premium content.

## Features implemented
* **Authentication:** Secure Login and Registration.
* **Role-Based Access:** Distinction between Trainers (Creators) and Users (Consumers).
* **Database Relationships:**  
    * **One-to-Many:** Trainers to Plans.
    * **Many-to-Many:** Users following Trainers.
* **Smart Feed:** "Discover" vs "My Trainers" toggle for filtered content.
* **Responsive UI:** Mobile-friendly design using React and CSS Grid.
* **RESTful API:** Structured endpoints for Users, Plans, and Auth.

## Tech Stack
* **Frontend:** React (Vite), Axios, React Router.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).

---
## 📂 Project Structure

```text
FitPlanHub/
├── client/                 # React Frontend Application
│   ├── src/
│   └── vite.config.js
│
├── server/                 # Node.js Backend API
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   └── index.js            # Server Entry Point
│
└── README.md
---

## Setup & Installation

### Prerequisites
* Node.js (v14 or higher)
* MongoDB

### 1. Setup Backend (Server)
```bash
cd server
npm install
npm start
Server runs on: http://localhost:5000 (Note: Database connection is configured internally in server.js)
---

2. Setup Frontend (Client)
Open a new terminal:

Bash

cd client
npm install
npm run dev
Client runs on: http://localhost:5173

API Design & Endpoints
Authentication
POST /auth/register - Create a new user/trainer.

POST /auth/login - Authenticate and receive Token.

Plans
GET /plans - Fetch all available workout plans.

GET /plans/:id - Get details of a specific plan.

POST /plans - (Trainers only) Create a new workout plan.

Users / Social
GET /users/:id - Get user profile and following list.

PUT /users/:id/follow - Follow or Unfollow a trainer.

🗄️ Database Design (Schema)
User Schema:

_id: ObjectId

name, email, password: String

following: Array of ObjectIds (Ref: User)

Plan Schema:

_id: ObjectId

title, description, price: String

trainer: ObjectId (Ref: User)

dietPlan, workoutPlan: Array of Objects
