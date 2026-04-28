# Digital Executor 🛡️

**The Zero-Knowledge Life-Logic Vault**

Digital Executor is a highly secure, non-custodial failsafe platform designed to securely store and automatically release vital instructions, passwords, and documents to your trusted beneficiaries in the event that you are incapacitated.

## What is a DMS (Dead Man's Switch)?
At the core of the Digital Executor is the **Dead Man's Switch (DMS)** engine. 
A DMS is an automated security mechanism designed to trigger an action only if the human operator fails to interact with it. In the context of this app:
1. You regularly log in and click "I'm well - Extend timer" (a heartbeat check-in).
2. If you fail to check in before the timer expires, the backend Escalation Engine assumes you are incapacitated.
3. The system automatically begins pinging your emergency contacts and progressively unlocking your encrypted instructions (Phase 1 through 4) to ensure a smooth, stress-free handover of your life's logistics.

## Core Features ✨

### 1. Zero-Knowledge Encryption
Your privacy is mathematically guaranteed. When you write your failsafe instructions, they are encrypted locally inside your browser using **AES-256-GCM**. The master passphrase never leaves your device. The backend only ever receives opaque ciphertext. If the database is compromised, the data remains unreadable.

### 2. Phased Beneficiary Unsealing
To prevent your loved ones from being overwhelmed during a crisis, instructions are unlocked in deliberate phases:
- **Phase 1 (Immediate):** Urgent Care Actions (canceling subscriptions, pausing rent, feeding pets).
- **Phase 2 (Immediate):** Trusted Contacts (estate lawyers, accountants, close friends).
- **Phase 3 (Immediate):** Physical World (safe combinations, hidden keys).
- **Phase 4 (Time-Locked 90 Days):** Official Documents (deeds, legal bindings, sensitive asset transfers).

### 3. Dynamic Escalation Engine
A visual dashboard that allows you to monitor your Family Security Streak. If a heartbeat is missed, an Escalation Timeline engages, executing SMS/Email alerts to emergency contacts to request a manual check-in before fully executing the vault distribution.

### 4. 100% Local Development Environment
The application has been pivoted from a heavy cloud-native architecture (AWS S3, Redis, PostgreSQL) to a lightweight, fully self-contained local environment using **SQLite**, an **In-Memory Redis Mock**, and the **Local File System**. 

---

## Tech Stack
- **Frontend:** Next.js (React), TailwindCSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express, Prisma ORM, SQLite.
- **Security:** Web Crypto API (AES-GCM).

## Setup & Running Locally 🚀

### 1. Install Dependencies
Navigate into both the frontend and backend directories and install the packages:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Database Initialization
The application uses SQLite for local development. The database is auto-seeded on startup, but you must push the schema:
```bash
cd backend
npx prisma db push
```

### 3. Start the Application
Run the development servers. We recommend running them in two separate terminal windows:
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`.
