# Herbal Backend - Gemini Context

This document provides essential context and instructions for AI agents working on the Herbal Backend project.

## Project Overview
The Herbal Backend is a Node.js and Express-based REST API designed to manage an e-commerce platform for herbal products. It utilizes MongoDB for data storage and provides a structured MVC (Models, Controllers, Routes) architecture.

### Key Technologies
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) with `bcrypt` for password hashing
- **Environment Management:** `dotenv`
- **Development:** `nodemon` for automatic server restarts

## Project Structure
- `index.js`: Application entry point, middleware configuration, and database connection.
- `controllers/`: Contains business logic and request handling for each entity.
- `models/`: Mongoose schemas and model definitions.
- `routes/`: Express router definitions mapping endpoints to controllers.

### Core Entities
- **User:** Manages authentication, roles (Admin/Customer), and profiles.
- **Product:** Handles herbal product catalog. Includes search functionality by name and description via `/api/products/search/:query`.
- **Order:** Manages customer orders and statuses.
- **Inquiry:** Handles customer queries.
- **Review:** Manages product reviews.
- **Payment:** (Inferred) Logic related to transactions.

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB instance (local or Atlas).
- A `.env` file in the root directory.

### Environment Variables
Ensure the following variables are defined in your `.env` file:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Key Commands
- **Start Development Server:** `npm start` (runs `nodemon index.js`)
- **Test:** `npm test` (placeholder available)

## Development Conventions

### Architecture
- **Routes:** Define endpoints in `routes/` and delegate logic to `controllers/`.
- **Controllers:** Handle request validation, call models, and return JSON responses.
- **Models:** Use Mongoose for schema definition and data validation.

### Authentication & Authorization
- **Middleware:** A global middleware in `index.js` decodes JWTs from the `Authorization: Bearer <token>` header and attaches the user object to `req.user`.
- **Role Checks:** Use helper functions like `isItAdmin(req)` or `isItCustomer(req)` within controllers to enforce authorization.

### Response Format
- Success: `res.status(200/201).json({ message: "...", data: ... })`
- Error: `res.status(4xx/5xx).json({ message: "...", error: "..." })`

## Known Implementation Details
- The server runs on port `5000` by default.
- Password hashing is performed using `bcrypt.hashSync` with 10 salt rounds.
- Admin dashboard stats are aggregated from multiple models in `userController.js`.
