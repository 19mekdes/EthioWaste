# EcoBin – Smart Waste Management and Recycling Platform

EcoBin is a smart waste management and recycling platform designed to improve waste collection, recycling coordination, citizen participation, and municipal waste management in Ethiopian cities.

The platform connects **citizens, waste collectors, recycling organizations, and municipal administrators** through a centralized system for reporting waste, requesting collection, managing collection tasks, processing recyclable materials, handling complaints, and monitoring waste management activities.

> **GitHub Repository:** EthioWaste
> **Application Name:** EcoBin

---

## Project Overview

Waste management is an important challenge in many Ethiopian cities. Traditional waste reporting and collection processes can be difficult to coordinate because citizens, collectors, recycling organizations, and municipal authorities may not have a centralized platform for communication and management.

EcoBin provides a digital platform where:

* Citizens can report waste and request collection services.
* Collectors can manage and complete assigned collection tasks.
* Recycling organizations can receive and process recyclable materials.
* Municipal administrators can monitor operations and manage the entire system.
* Citizens can receive notifications and earn Eco-Points.
* Municipal administrators can analyze waste collection and recycling activities.

The goal is to support cleaner cities, better waste collection, increased recycling, and improved community participation.

---

## 🎯 Objectives

The main objectives of EcoBin are to:

* Improve waste reporting and collection management.
* Connect citizens with waste collection services.
* Help municipal administrators monitor waste management activities.
* Improve coordination between collectors and recycling organizations.
* Support recycling and proper waste categorization.
* Provide centralized complaint and feedback management.
* Encourage citizen participation through Eco-Points and rewards.
* Provide analytics for municipal waste management decisions.
* Support better waste management practices in Ethiopian cities.

---

## 🏗️ Architecture

The project is organized into two independent applications:

### Frontend

Built with:

* React.js
* TypeScript
* Tailwind CSS
* Vite

### Backend

Built with:

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* SQLite

### Project Structure

```text
Smart Waste Management and Recycling Platform/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── db.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── package.json
```

---

# 🚀 Main Features

## 🧑 Citizen

Citizens can:

* Create an account and log in securely.
* Report waste in their area.
* Select waste categories.
* Submit waste collection requests.
* Track submitted reports and requests.
* View request and collection status.
* View recycling centers.
* Receive notifications.
* Submit complaints.
* Provide feedback.
* View and earn Eco-Points.
* Manage their profile.

---

## 🚛 Waste Collector

Collectors can:

* Log in to the platform.
* View assigned collection tasks.
* View task details and locations.
* Start assigned collection tasks.
* Update collection progress.
* Mark waste as collected.
* Provide collection proof.
* Complete collection tasks.
* View collection history.
* Manage their profile.

---

## ♻️ Recycling Organization

Recycling organizations can:

* Log in to the platform.
* Manage their organization profile.
* View recyclable materials assigned to them.
* Receive recyclable materials.
* Accept recyclable materials.
* Process received recyclable materials.
* Record recycled quantities.
* Track recycling activities.
* View recycling history.

---

## 🏛️ Municipal Administrator

Municipal administrators can:

* Log in securely.
* Manage system users.
* Manage citizens and collectors.
* Manage recycling organizations.
* Review waste reports.
* Verify waste reports.
* Approve or reject collection requests.
* Assign collectors to collection tasks.
* Reassign collection tasks when necessary.
* Manage recycling centers.
* Monitor collection activities.
* Manage complaints.
* Review citizen feedback.
* Monitor recycling activities.
* View system analytics and reports.

---

# 👥 User Roles

EcoBin supports four main user roles:

| Role                        | Responsibilities                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Citizen**                 | Report waste, request collection, track requests, submit complaints and feedback, and manage Eco-Points.            |
| **Waste Collector**         | View assigned tasks, collect waste, update task status, provide collection proof, and complete tasks.               |
| **Recycling Organization**  | Receive recyclable materials, accept materials, process waste, and record recycled quantities.                      |
| **Municipal Administrator** | Manage users, reports, requests, collectors, recycling organizations, complaints, feedback, centers, and analytics. |

---

# 🗑️ Waste Categories

EcoBin supports different waste categories:

* Organic
* Plastic
* Paper
* Cardboard
* Glass
* Metal
* Electronic
* Hazardous
* Mixed
* Other

---

# 🔄 Waste Collection Workflow

Waste collection follows a controlled workflow:

```text
PENDING
   ↓
VERIFIED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
COLLECTED
   ↓
COMPLETED
```

This workflow helps administrators and collectors track the complete lifecycle of a waste collection request.

---

# 📍 Map and Eco-Points

### Map

The platform uses a map centered on:

```text
Addis Ababa, Ethiopia
Coordinates: 8.9806, 38.7578
```

The map can be used to display recycling centers and waste-related locations.

### Eco-Points

Citizens can earn Eco-Points through activities such as verified waste reports and completed collection activities.

Eco-Points are stored as part of the user's account information.

---

# 🗄️ Database

EcoBin currently uses:

**SQLite**

with the Prisma ORM.

The database is located at:

```text
backend/prisma/dev.db
```

> **Important:** Do not reset or change the database engine without updating the project architecture and migration strategy.

---

# ⚡ Getting Started

## 1. Prerequisites

Install:

* Node.js v18 or higher
* npm

---

## 2. Clone the Repository

```bash
git clone https://github.com/19mekdes/EthioWaste.git
cd EthioWaste
```

---

## 3. Install Backend Dependencies

```bash
cd backend
npm install
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 5. Root Commands

From the root directory, the project can also provide scripts for running and building the applications:

```bash
npm run dev:backend
npm run dev:frontend
npm run build:backend
npm run build:frontend
```

---

# 🔐 Role-Based Access

EcoBin implements role-based access control so that each user can access only the functionality appropriate to their role.

```text
User Login
     ↓
Authentication
     ↓
Identify User Role
     ↓
┌──────────┬───────────┬──────────────┬───────────────┐
│ Citizen  │ Collector │ Recycling Org│ Municipal Admin│
└──────────┴───────────┴──────────────┴───────────────┘
     ↓          ↓             ↓                ↓
  Citizen    Collection    Recycling        Management
  Dashboard    Tasks        Dashboard        Dashboard
```

---

# 👨‍💻 Team Members

| No. | Name                 | CTC     | Role               |
| --: | -------------------- | ------- | ------------------ |
|   1 | **Mekdes Wale**      | 566-26  | Backend Developer  |
|   2 | **Kanariya Habtamu** | 1783-26 | Frontend Developer |

---

# 📌 Project Information

**Project Name:** EcoBin
**Repository:** EthioWaste
**Domain:** Smart Waste Management and Recycling
**Target:** Ethiopian Cities
**Primary Location:** Addis Ababa, Ethiopia
