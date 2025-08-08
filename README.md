# ♻️ FoodShare

![Project Banner](https://i.ibb.co.com/ZznTPyQQ/foodshare.png)

A full-stack web application that connects individuals, restaurants, and NGOs to reduce food waste through donations. Users can post available surplus food, while others can browse, request, and manage pickup of shared food items.

---

## 🌐 Live URLs

- **Client Site:** [https://foodshare-client.example.com](https://foodshare-client.example.com)
- **Server/API:** [https://foodshare-server.example.com](https://foodshare-server.example.com)

---

## 🧠 Description

FoodShare is a socially impactful platform that helps reduce food waste by facilitating easy food donations. Designed with accessibility and efficiency in mind, it supports real-time listings, secure user authentication, and seamless coordination between food donors and recipients.

---

## 🔍 Key Features

- ✅ **User Authentication**  
  Register and login using email/password or Google. Firebase authentication with protected routes.

- 🍱 **Post & Manage Food Items**  
  Add, edit, and delete food listings. See expiration time and location.

- 📍 **Browse Available Donations**  
  Easily view all available food, filtered by category, expiry, or distance.

- 📦 **Request and Track Pickups**  
  Users can request available food and view pickup statuses in real-time.

- 🌐 **Responsive & Accessible UI**  
  Mobile-first responsive design with intuitive navigation.

---

## 🧪 Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router DOM  
- **Authentication:** Firebase  
- **Backend:** Node.js, Express.js, MongoDB  
- **Hosting:** Netlify (Client), Vercel (Server)  
- **Others:** SweetAlert2, JWT, CORS, dotenv

---

## 📦 Dependencies

- `firebase`  
- `axios`  
- `react-router-dom`  
- `sweetalert2`  
- `jsonwebtoken`  
- `dotenv`  
- `express`  
- `mongoose`

---

## 🛠️ Local Setup Guide

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/foodshare.git
cd foodshare

## 2. Setup Client

cd client
npm install
npm run dev

This will start the React frontend on http://localhost:5173 (or similar depending on your config).

3. Setup Server
Open a new terminal and run:
cd server
npm install
npm run start

This will start the Express backend on http://localhost:5000 by default.

4. Environment Variables
Create .env files in both client/ and server/ folders with the following values:

Server .env

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Client .env

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_API_URL=http://localhost:5000
📁 Project Structure

├── client/         # React Frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── hooks/
├── server/         # Express Backend
│   ├── routes/
│   ├── controllers/
│   └── models/
└── README.md


