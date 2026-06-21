# VeloWiKi — Club CRM for VeloCET

Welcome to **VeloWiKi**, a modern, lightweight Customer Relationship Management (CRM) and knowledge platform built custom for **VeloCET**. It provides a unified system to manage club members, external mentors, projects, and alumni, accessible via both a Next.js web dashboard and a Discord bot.

> ⚠️ **Note on Live URL**: A live deployment URL is not publicly available as this system connects to a sensitive club database containing private member directory details and project records.

---

## App Interfaces

Below are previews of the client dashboard and authorization flows:

| Login Screen | CRM Dashboard |
| :---: | :---: |
| ![Login Screen](login.jpeg) | ![CRM Dashboard](dashboard.jpeg) |

---

## Technical Deep-Dive

For a complete architectural breakdown, engineering decisions, and code walkthrough, check out the blog post:

> 📝 **[Read the VeloWiKi Technical Breakdown Blog Post](https://ianands.vercel.app/blogs)**

---

## Key Features

- **Member Management**: Track members through their lifecycle—from active club members (`MEMBER`) to graduated alumni (`ALUMNI`) and external industry experts (`MENTOR`).
- **Project Tracking & Assignments**: Manage club projects (status: `IN_PROGRESS`, `COMPLETED`, `ABORTED`) and easily assign members to teams.
- **Discord Bot Integration**: Allows coordinators to perform day-to-day operations like adding members, updating statuses, and checking project details using native Discord slash commands.
- **Responsive Web Portal**: A dashboard for viewing stats, listings, and full details, protected by Google email authentication.

---

## Project Structure

```text
crm_velo/
├── backend/          # FastAPI server containing API routers, schemas, and endpoints
├── bot/              # Discord.py bot client and command slash-cogs
├── database/         # SQLAlchemy models, base declaration, and engine connector
├── frontend/         # Next.js web dashboard & frontend application
├── requirements.txt  # Python package dependencies
└── schema.md         # Database schema relationship visualization
```

---

## Setup & Getting Started

### 1. Database & Environment Setup
Ensure you have a PostgreSQL database running (e.g., Supabase) and configure a `.env` file in the project root:
```env
DATABASE_URL=postgresql+psycopg://username:password@host:port/database
DISCORD_TOKEN=your_discord_bot_token
```

And a `.env.local` inside the `frontend/` directory with authentication configuration:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Run Backend API
Create a Python virtual environment, install dependencies, and run the FastAPI server:
```bash
# Set up virtual environment and install packages
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run the backend server
uvicorn backend.main:app --reload
```
The interactive API documentation will be available at `http://localhost:8000/docs`.

### 3. Run Frontend Web App
Navigate to the frontend folder, install Node dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Discord Bot
Install `discord.py` and run the bot client:
```bash
pip install discord.py
python -m bot.main
```
This registers slash commands (such as `/addperson`, `/assignproject`, and `/getproject`) directly in your configured Discord server.

---
