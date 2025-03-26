# Movie Watchlist App

## Description
The Movie Watchlist App is a full-stack web application that allows users to search for movies, add them to their personal watchlist, and manage their saved movies. It integrates with **The Movie Database (TMDB) API** to fetch movie details and provides user authentication for secure access.

## **Live Demo**
Movie Watchlist App:  https://movie-watchlist-app-frontend.onrender.com

---

## Features

✅ **User Authentication**
- Sign up and log in securely.
- JWT-based authentication for protected routes.

✅ **Movie Search**
- Search for movies using the TMDB API.
- View details of selected movies.

✅ **Watchlist Management**
- Add movies to a personal watchlist.
- View and manage the watchlist.
- Remove movies from the list.

✅ **Responsive UI**
- Built using **React.js** and **React-Bootstrap** for a clean user interface.
- Navigation via **React Router** for a seamless experience.

✅ **Backend API**
- RESTful API built with **Node.js, Express, and PostgreSQL**.
- Persistent user data using **PostgreSQL and Sequelize**.

---

### Tech Stack

## Frontend
- React.js
- React Router
- React Bootstrap
- Fetch API for backend communication
- Vitest (for testing
)
## Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JSON Web Tokens (JWT) for authentication
-Jest & Supertest (for testing)

## External APIs
- The Movie Database (TMDB) API

---

### Setup Instructions

##  Prerequisites

Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

---

##  Clone the Repository

```bash
git clone https://github.com/your-username/movie-watchlist-app.git
cd movie-watchlist-app.
```
---

##  Backend Setup

## 1. Environment Variables

## Create a .env file in the backend directory with the following content:
- DATABASE_URL=postgresql://username:password@localhost:5432/movie_watchlist
- JWT_SECRET=your_jwt_secret_key
- TMDB_API_KEY=your_tmdb_api_key

Replace username, password, your_jwt_secret_key, and your_tmdb_api_key with your actual credentials.

## You can also create a .env.test file for test configuration:
- DATABASE_URL=postgresql://username:password@localhost:5432/test_db
- JWT_SECRET=test_jwt_secret
- TMDB_API_KEY=your_tmdb_api_key

## 2. Install Dependencies
- cd backend
- npm install

## 3. Start the Server
- npm run dev
The backend will run on http://localhost:5000.

## 4. Run Backend Tests
- npx jest

---

## Frontend Setup

## 1. Environment Variables

##  Create a .env file in the frontend/ directory:
- VITE_BACKEND_URL=http://localhost:5000

## 2. Install Dependencies
- cd frontend
- npm install

## 3. Start the Frontend
- npm run dev
The frontend will run on http://localhost:5173.

## 4. Run Frontend Tests
- npx vitest

---

### Troubleshooting

## Backend
- ❌ Database connection error:
Ensure PostgreSQL is running and your .env file has the correct credentials.
- ❌ JWT error:
Make sure JWT_SECRET is set in your .env file.

## Frontend
- ❌ CORS issues:
Ensure the frontend VITE_BACKEND_URL is correctly pointed to your backend server.
- ❌ TMDB fetch issues:
Ensure your TMDB API key is valid and not rate-limited.

---

### Contact

For questions, issues, or suggestions, feel free to contact me via GitHub.