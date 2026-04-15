# FixFlow

Machine maintenance ticket management system.

**Stack:** Laravel 13 + React 19 (Vite) — single project, one server.

---

## Setup

```bash
cd fixflow-backend

# 1. Install PHP dependencies
composer install

# 2. Install JS dependencies
npm install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Create SQLite database and run migrations + seed
touch database/database.sqlite
php artisan migrate --seed
```

---

## Running

```bash
cd fixflow-backend

# Dev mode — runs Laravel + Vite HMR together
composer run dev
```

Then open http://localhost:8000

---

## Seed accounts

| Role        | Email                  | Password      |
|-------------|------------------------|---------------|
| Admin       | admin@fixflow.com      | password123   |
| Technician  | tech@fixflow.com       | password123   |
| Worker      | worker@fixflow.com     | password123   |

---

## Project Structure

```
fixflow-backend/
├── app/Http/Controllers/   # AuthController, MachineController, TiketController
├── client/src/             # React frontend source
│   ├── pages/              # worker/, technician/, admin/
│   ├── components/         # UI components
│   ├── context/            # Auth, Ticket, Machine, Language, Notification
│   └── lib/api.js          # Fetch wrapper → /api
├── routes/
│   ├── api.php             # REST API (Sanctum protected)
│   └── web.php             # Catch-all → serves React SPA
├── resources/views/
│   └── app.blade.php       # SPA shell with @vite
└── vite.config.js          # Builds client/src/main.jsx
```
