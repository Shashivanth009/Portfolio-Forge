# 💻 PortfolioForge:~$ cat info.txt

```
  ____            _    __Alias_Forge
 |  _ \ ___  _ __| |_ / _| ___  _ __ __ _  ___
 | |_) / _ \| '__| __| |_ / _ \| '__/ _` |/ _ \
 |  __/ (_) | |  | |_|  _| (_) | | | (_| |  __/
 |_|   \___/|_|   \__|_|  \___/|_|  \__, |\___|
                                    |___/
```

🚀 **Live Demo**: [portfolio-forgee.vercel.app](https://portfolio-forgee.vercel.app)  
🚀 **Backend API**: [portfolio-forge-backend.onrender.com](https://portfolio-forge-backend.onrender.com)

PortfolioForge is a web application that enables users to generate beautiful, production-ready portfolio websites from their resumes (PDF/DOCX) or manual details. Built using the React, Express, and Node stack, it incorporates AI-powered enhancements and provides 15 highly-polished templates across several categories.

---

```bash
$ neofetch --project portfolioforge
```
```
                .------.             OS: React, Node, Express, Prisma ORM
              /  ~ ~   \             Database: Neon PostgreSQL & Prisma
             |  (o) (o) |            AI Engine: Google Gemini Free API
             |    __    |            Templates: 15+ Custom Themes
              \  \__/  /             Build Tool: Vite + TypeScript
               \______/              Styling: TailwindCSS & Framer Motion
```

---

```bash
$ ls -la core-features/
```
* 📄 **Resume-Parsing/** — Instantly structures PDF/DOCX resumes using Gemini.
* 🎨 **15-Templates/** — Sleek styles (Developer, Cybersecurity, Student, Corporate, Freelancer).
* 🔧 **Live-Visual-Builder/** — Split-pane workspace with live layout adjustments and color palettes.
* 📦 **Standalone-ZIP-Export/** — Codebase bundles with all selected template components for local execution.
* 🧭 **SEO-Engine/** — Custom page title, description, and keywords metadata.

---

```bash
$ ./setup.sh --install-dependencies
```

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
# Generate Prisma client and migrate database
npm run db:generate
npm run db:migrate
```

### 5. Running Development Servers
Start both the React development server (Vite port 3000) and Express API server (port 5000) concurrently:
```bash
npm run dev
```

---

```bash
$ tree -L 2 --dirsfirst
```
```
.
├── backend/                  # Node + Express API + Prisma database
│   ├── prisma/               # Schema models & seeding scripts
│   ├── src/                  # Controllers, middleware, routes, services
├── frontend/                 # React UI + Zustand state + visual builder
│   ├── src/                  # Components, pages, templates, utils
```
