# Glimmora Vlogging App

A full-stack vlogging platform built for Glimmora International trainees. Users can register, upload videos with thumbnails to Cloudinary, browse a paginated feed, watch vlogs (with automatic view counts), and like or manage their own content.

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 18, Vite, React Router v6, Tailwind CSS, Axios |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt |
| Media    | Cloudinary |
| DevOps   | GitHub Actions, Render (API), Vercel (UI) |

## Project Structure

```
vlogging-app/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express API
├── .github/         # CI workflows
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- Cloudinary account

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo-url>
cd vlogging-app

cd server && npm install
cd ../client && npm install
```

### 2. Backend environment

Copy the example env file and fill in your values:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_strong_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend environment

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run locally

**Terminal 1 – API:**

```bash
cd server
npm run dev
```

**Terminal 2 – UI:**

```bash
cd client
npm run dev
```

- API: http://localhost:5000  
- App: http://localhost:5173  

## API Documentation

Base URL: `/api/v1`

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register (name, email, password) | No |
| POST | `/auth/login` | Login, returns JWT | No |

**Register / Login body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Success response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "eyJhbG..."
  }
}
```

Protected routes require header: `Authorization: Bearer <token>`

### Vlogs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/vlogs?page=1` | List vlogs (10 per page) | No |
| GET | `/vlogs/:id` | Single vlog (+1 viewCount) | No |
| POST | `/vlogs` | Create vlog (multipart) | Yes |
| PUT | `/vlogs/:id` | Update vlog (owner) | Yes |
| DELETE | `/vlogs/:id` | Delete vlog (owner) | Yes |
| POST | `/vlogs/:id/like` | Toggle like | Yes |

**Create vlog (multipart/form-data):**

- `title` (string)
- `description` (string)
- `video` (file)
- `thumbnail` (file)

**Vlog object:**

```json
{
  "_id": "...",
  "title": "My Trip",
  "description": "...",
  "videoUrl": "https://res.cloudinary.com/...",
  "thumbnailUrl": "https://res.cloudinary.com/...",
  "author": { "_id": "...", "name": "...", "email": "..." },
  "viewCount": 42,
  "likes": ["userId1", "userId2"],
  "createdAt": "2026-06-04T..."
}
```

## Frontend Routes

| Route | Page | Protected |
|-------|------|-----------|
| `/` | Home feed | No |
| `/vlogs/:id` | Vlog detail + player | No |
| `/create` | Create vlog | Yes |
| `/edit/:id` | Edit vlog (owner) | Yes |
| `/login` | Login | No |
| `/register` | Register | No |

## Scripts

### Server (`/server`)

- `npm start` – production server
- `npm run dev` – development with watch
- `npm run lint` – ESLint
- `npm test` – Jest unit tests

### Client (`/client`)

- `npm run dev` – Vite dev server
- `npm run build` – production build
- `npm run lint` – ESLint

## Deployment

### Backend → Render.com

1. Create a new **Web Service** and connect your GitHub repo.
2. Set **Root Directory** to `server` (or deploy from repo root with adjusted paths).
3. **Build command:** `npm install`
4. **Start command:** `node server.js`
5. Add environment variables in the Render dashboard (same keys as `.env.example`).
6. Use the Render URL as your production API base.

### Frontend → Vercel

1. Import the GitHub repo on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework preset: **Vite**.
4. Add environment variable: `VITE_API_URL=https://your-app.onrender.com`
5. Deploy. Vercel will run `npm run build` automatically.

After deployment, ensure CORS on the API allows your Vercel domain (the default `cors()` middleware allows all origins in development; tighten for production if needed).

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main` and `develop`:

- Install dependencies for client and server
- `npm run lint` on both
- `npm test` on server
- `npm run build` on client

## Architecture

Backend follows **routes → controllers → services → models**:

- **Models:** `User`, `Vlog` (Mongoose schemas)
- **Services:** business logic, Cloudinary uploads, auth
- **Controllers:** HTTP request/response handling
- **Middleware:** morgan → cors → json → auth (protected) → error handler

## License

MIT — built for educational use at Glimmora International.
