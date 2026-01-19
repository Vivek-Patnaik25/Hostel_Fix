# HostelFix (HMRS Prototype)

Hostel Maintenance Request System prototype.

## Architecture
- **Web**: Next.js 14, Tailwind CSS, NextAuth.js (Deploy on Vercel)
- **Socket Server**: Express, Socket.io (Deploy on Render)
- **Database**: MongoDB Atlas

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    - Create `web/.env.local`
    - Create `socket-server/.env`

3.  **Run Locally**
    - Web: `cd web && npm run dev`
    - Socket Server: `cd socket-server && npm run dev`

## Features (Prototype)
- Student Complaint Submission
- Status Tracking (Real-time)
- Staff/Admin Dashboard
- Mock Authentication (ERP Simulation)
