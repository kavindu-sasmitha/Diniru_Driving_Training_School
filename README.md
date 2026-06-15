# 🚗 Diniru Driving Training School Management System

A comprehensive, enterprise-grade Full-Stack Web Application designed to streamline the operations of a modern driving training school. This system features a robust layered architecture, fully managed user roles, dynamic examination handling, integrated billing management, and AI-assisted modules.

---

## 🛠️ Tech Stack & Architecture

The project is built using a modern **Decoupled Monolith (MERN variant)** setup, cleanly separated into Backend (BE) and Frontend (FE) directory scopes.

### Backend (`/BE`)
* **Runtime Environment:** Node.js
* **Framework:** Express.js with TypeScript
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
* **Architecture Style:** Layered Architecture (Routers ➡️ Controllers ➡️ Services ➡️ Models)

### Frontend (`/FE`)
* **Framework:** React.js (TypeScript)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (Utility-first framework)
* **State Management & Routing:** React Context API & React Router DOM
* **HTTP Client:** Axios (With custom interceptors for dynamic bearer token attachments)

---

## 🌟 Key Features

* **Advanced Authentication & Authorization:** Multi-tenant login system separating Administrative privileges from standard Student accounts using explicit route guards (`protect`, `restrictToAdmin`).
* **Student Account Workflow:** Automated student registration and an admin approval dashboard that securely toggles user access based on verified status.
* **Dynamic Exam Module:** Real-time MCQ examination mechanism with auto-evaluation engines, automatic percentage computation, and persistence of historical scorecard documents.
* **Financial Ledger Management:** Comprehensive payment module supporting multiple structured installment tracking (`collect-payment`) per student profile.
* **AI Integration & Learning Modules:** Dedicated AI-assisted route components and video learning material streaming for modern interactive training workflows.

---

## 📂 Project Directory Structure

```text
RADProject/
├── BE/                         # Backend Express Engine
│   ├── src/
│   │   ├── config/             # Database connectivity config
│   │   ├── controllers/        # Request handling & HTTP response wrappers
│   │   ├── middleware/         # Auth, RBAC, and Exception validation gates
│   │   ├── models/             # Mongoose schemas (User, Student, Exam, Result)
│   │   ├── routers/            # Express route endpoint definitions
│   │   └── services/           # Business logic layer and DB operations
│   ├── package.json
│   └── server.ts
│
├── FE/                         # Frontend React Interface
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Global state wrappers
│   │   ├── views/pages/        # Dashboard configurations (Admin & Student)
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md                   # System documentation
