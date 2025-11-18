🚗⚡ MECHFUEL – Emergency Fuel & Mechanical Service App

A full-stack MERN application offering on-road fuel delivery and instant mechanical services with live location picking.

🌟 Project Overview

MECHFUEL is a complete full-stack application built with:

React.js (Frontend)

Node.js + Express (Backend)

MongoDB Atlas (Database)

It allows users to:

✔ Request fuel delivery
✔ Book mechanical repair services
✔ Use interactive map to pick exact location
✔ Authenticate via JWT (Login / Register)
✔ View order/service summary
✔ Submit service requests

🛠️ Tech Stack
Frontend – /client

React.js

React Router

Material-UI

Leaflet Maps + GeoSearch

Context API for Auth

Backend – /server

Node.js

Express

MongoDB + Mongoose

JWT Authentication

Multer (uploads)

Helmet, CORS, Rate Limiter

📁 Project Structure
MECHFUEL/
│── client/          # React Frontend
│── server/          # Node/Express Backend
│── package.json     # root-level metadata
│── README.md

⚙️ Setup Instructions
🖥 1. Clone the project
git clone https://github.com/<your-username>/mechfuel.git
cd mechfuel

🚀 2. Setup Frontend (client)
cd client
npm install
npm start


Frontend runs at 👉 http://localhost:3000

🛠 3. Setup Backend (server)
cd server
npm install
npm run dev


Backend runs at 👉 http://localhost:5000

🔐 4. Environment Variables

Inside /server create a .env file:

NODE_ENV=development
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your-secret-key>
CORS_ORIGIN=http://localhost:3000

🔥 Main Features
🔑 Authentication

Register

Login

JWT protected routes

⛽ Fuel Delivery Flow

Select fuel type

Choose quantity

Pick location on map

🔧 Mechanical Service Flow

Select multiple services

Enter vehicle details

Add problem description

Location picker

Checkout page

🛡 Backend Security

Helmet

CORS

Rate limiting

Validation middleware

📡 API Endpoints (Summary)
Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile

Fuel Orders
POST   /api/fuel/orders
GET    /api/fuel/orders

Mechanical Services
POST   /api/mech/requests
GET    /api/mech/requests

🧱 Build Frontend for Production
cd client
npm run build


Output goes to /client/build.

🧑‍💻 Author

Varun Anumari (Nani)
🚀 Full-stack developer in progress
🔥 Passionate about MERN stack + real-world projects