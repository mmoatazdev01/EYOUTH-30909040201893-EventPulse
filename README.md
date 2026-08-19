# EventPulse API

EventPulse is a Node.js and Express API for discovering events, registering attendees, and broadcasting live announcements for event communities across Egypt. The project follows a clean MVC pattern and is designed to deploy on Vercel with MongoDB Atlas.

## Project Identity
- Project Name: EventPulse API
- Student ID: EYOUTH-30909040201893
- Repository Name: EYOUTH-30909040201893-EventPulse
- Stack: Node.js, Express, MongoDB Atlas, Socket.io, Vercel

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Socket.IO
- Swagger UI
- Jest + Supertest

## Directory Structure
- `app.js` – entry point and Socket.IO setup
- `config/` – database configuration
- `models/` – MongoDB schemas
- `controllers/` – request logic
- `routes/` – API route definitions
- `middleware/` – auth, validation, error handling
- `utils/` – helpers and custom error classes
- `tests/` – unit and integration tests
- `postman/` – Postman collection and environment

## Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and add your values.
4. Start MongoDB Atlas and configure the connection string.
5. Seed the database:
   ```bash
   npm run seed
   ```
6. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventpulse
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
```

## Core API Routes
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Service health and DB state |
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/events` | Public | List, filter, search, paginate, and sort events |
| GET | `/api/events/:id` | Public | Get one event |
| POST | `/api/events` | Admin | Create event |
| PATCH | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| POST | `/api/registrations` | Authenticated | Register for an event |
| GET | `/api/registrations/my` | Authenticated | Current user registrations |
| DELETE | `/api/registrations/:id` | Authenticated | Remove own registration |
| POST | `/api/announcements` | Admin | Create live announcement |
| GET | `/api/announcements/:eventId` | Public | View announcement history |
| GET | `/api-docs` | Public | Swagger UI |

## Database Seed
The seed script drops the existing collections and repopulates the database with:
- admin account: `Admin321@gmail.com` / `@dmin231@decieyouth`
- standard event categories
- sample events in Cairo, Alexandria, Mansoura, and Hurghada

## Deployment
### Vercel
1. Install the Vercel CLI.
2. Run:
   ```bash
   vercel
   ```
3. Add environment variables in the project dashboard, including `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV=production`.
4. Use the included `vercel.json` configuration.

## Testing
```bash
npm test
```

## Notes
This application uses centralized error handling, express-validator validation, JWT-based role protection, and Socket.IO event-room announcements for real-time updates.
