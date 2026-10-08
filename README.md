# Smart Waste Management and Recycling Platform (Addis Ababa)

An architectural separation of the **Smart Waste Management and Recycling Platform** into two independent applications:

1. **`frontend/`** — Single Page Application built with **React.js**, **TypeScript**, **Tailwind CSS**, and **Vite**.
2. **`backend/`** — REST API server built with **Node.js**, **Express.js**, **TypeScript**, and **Prisma ORM** connected to the existing **SQLite** database (`dev.db`).

---

## 🏗️ Architecture Overview

```
Smart West Management and Recycling Platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Preserved SQLite database schema
│   │   └── dev.db              # Intact SQLite database with real data
│   ├── src/
│   │   ├── controllers/        # Express request controllers
│   │   ├── middleware/         # JWT authentication & role-based RBAC middleware
│   │   ├── routes/             # RESTful API route definitions (/api/v1)
│   │   ├── services/           # Business logic & database operations
│   │   ├── utils/              # Status state transitions & helper functions
│   │   ├── db.ts               # Prisma Client singleton
│   │   └── server.ts           # Express App Entry Point (Port 5000)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI & role sidebars
│   │   ├── contexts/           # AuthContext & Session Provider
│   │   ├── layouts/            # Citizen, Collector, Recycling & Admin Layouts
│   │   ├── pages/              # Role-based workflow pages & Public Landing
│   │   ├── services/           # Frontend API client modules
│   │   ├── types/              # Shared TypeScript definitions
│   │   ├── App.tsx             # React Router routing & Protected Routes
│   │   ├── main.tsx            # Vite entry point
│   │   └── index.css           # Tailwind CSS directives
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── package.json                # Root orchestration scripts
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 2. Backend Setup (`http://localhost:5000`)
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 3. Frontend Setup (`http://localhost:5173`)
```bash
cd frontend
npm install
npm run dev
```

### 4. Concurrent Orchestration (from Root Directory)
```bash
# Start backend server
npm run dev:backend

# Start frontend application
npm run dev:frontend

# Build both applications for production
npm run build:backend
npm run build:frontend
```

---

## 🔐 Seed Accounts & Role Workflows

The platform contains 4 role-based user workflows initialized in `backend/prisma/dev.db`:

| Role | Email | Password | Access / Core Features |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@ecobin.org` | `password123` | Waste report creation (GPS + photos), collection booking, Eco-Points balance, complaints, ratings, recycling centers map |
| **Collector** | `collector@ecobin.org` | `password123` | Task dispatches, pickup route map, en-route status updates, proof photo uploads, completion records |
| **Recycling Org** | `recycling@ecobin.org` | `password123` | Shipment intake logs, material tonnage tracking (Plastic, Glass, Metal, Organic), digital audit certificates |
| **Municipal Admin** | `admin@ecobin.org` | `password123` | Waste report verification, collector fleet assignment, user role management, city drop-off hubs, complaints resolution, analytics |

---

## 🌍 Map & Eco-Points Specifications
- **Map Center**: Defaulted to Addis Ababa, Ethiopia (`[8.9806, 38.7578]`).
- **Eco-Points**: Calculated directly from database records (`ecoPoints` field on User model), awarded upon report verification and collection completions.
- **Database Engine**: **SQLite** (DO NOT reset or change database engine).
