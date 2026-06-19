# PortfolioForge

🚀 **Live Demo**: [portfolio-forgee.vercel.app](https://portfolio-forgee.vercel.app)

PortfolioForge is a web application that enables users to generate beautiful, production-ready portfolio websites from their resumes (PDF/DOCX) or manual details. Built using the React, Express, and Node stack, it incorporates AI-powered enhancements and provides 15 highly-polished templates across several categories.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js with TypeScript & Vite
- **Styling**: TailwindCSS & Framer Motion (for sleek transitions)
- **State Management**: Zustand
- **Drag & Drop**: Dnd Kit (for section reordering)
- **ZIP Generation**: JSZip (frontend client packaging)
- **Charts**: Recharts (for health completeness metrics & admin panels)

### Backend
- **Framework**: Node.js & Express.js with TypeScript
- **ORM**: Prisma ORM
- **Database**: PostgreSQL (Development: Local, Production: Neon PostgreSQL)
- **Resume Processing**: `pdf-parse` (PDF parsing) & `mammoth` (DOCX extraction)
- **AI Integrations**: Google Gemini Free API (for resume structuring, bio improving, and project enhancement)

---

## 🚀 Setup & Launch Instructions

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** instance running locally or hosted on Neon.

### 2. Environment Configurations
Rename `backend/.env.example` to `backend/.env` and configure:
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
JWT_SECRET="your-jwt-secret-string"
GEMINI_API_KEY="your-free-gemini-api-key"
```

### 3. Installation
Install root, frontend, and backend packages:
```bash
npm run setup
```

### 4. Database Schema Setup
Run migrations to initialize tables and seed default templates:
```bash
# Generate Prisma client and migrate local database
npm run db:generate
npm run db:migrate
```

### 5. Running Development Servers
Start both the React development server (Vite port 3000) and Express API server (port 5000) concurrently:
```bash
npm run dev
```

---

## 📁 Project Structure

```
├── backend/                  # Node + Express API + Prisma database
│   ├── prisma/               # Schema models & seeding scripts
│   ├── src/
│   │   ├── controllers/      # Parsing, Auth, Portfolio CRUD operations
│   │   ├── middleware/       # Multer uploads, JWT authentication
│   │   ├── routes/           # Endpoint index handlers
│   │   └── services/         # Gemini AI and parser utilities
├── frontend/                 # React UI + Zustand state + visual builder
│   ├── src/
│   │   ├── components/       # Layouts, Emulated views, Completeness score charts
│   │   ├── pages/            # Home, Gallery, Workspace, Dashboard panels
│   │   ├── templates/        # 15 HTML/React portfolio styles
│   │   └── utils/            # JSZip packager & configurations exporter
```
