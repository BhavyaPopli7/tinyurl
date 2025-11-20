📎 TinyUrls — Simple & Fast URL Shortener

TinyUrls is a lightweight full-stack URL shortener built with:

Next.js (App Router) — Frontend & Dashboard

Node.js + Express — Backend API

PostgreSQL (Neon DB) — Database

TailwindCSS — UI styling

It allows you to create short URLs, list all created links, view detailed analytics, and track click counts — all through a clean dashboard UI.

🚀 Features

🔗 Create short URLs (with optional custom code)

📋 Copy to clipboard

📄 Detail page for each link

📊 Track clicks, created time, and last click

❌ Delete links

⚙️ Health check endpoint + UI popup

🏷️ Neat, clean dashboard using Tailwind CSS

🌐 Neon PostgreSQL cloud storage

🔥 Server-side rendering with Next.js

🛠️ Tech Stack

Frontend

Next.js 16 (App Router)

React 19

TailwindCSS 4

TypeScript

Backend

Node.js 20

Express.js

PostgreSQL (Neon cloud)

SQL query layer using pg library

📦 Project Setup
1. Clone the Repo
git clone https://github.com/<your-username>/tinyurls.git
cd tinyurls
2. Backend Setup (Node + Express)
cd BE
npm install
Create an .env file
DATABASE_URL=your_neon_postgres_url_here
PORT=4000
npm run dev
http://localhost:4000
3. Frontend Setup (Next.js)
📁 Folder: /FE/tinyurls
cd FE/tinyurls
npm install
Add .env.local:
NEXT_PUBLIC_API_URL=http://localhost:4000
Start frontend:
npm run dev
http://localhost:3000

📁 Project Structure
tinyurls/
│
├── BE/               # Backend (Node + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── index.js
│   └── package.json
│
└── FE/tinyurls/      # Frontend (Next.js)
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── links/[code]/page.tsx
    ├── components/
    └── package.json
