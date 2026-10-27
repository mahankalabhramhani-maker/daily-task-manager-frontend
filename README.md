# Daily Task Manager - Frontend Client

Modern, responsive React.js single-page application built for high performance, intuitive UX, and seamless deployment on **Vercel**.

---

## 🛠️ Technology Stack

- **UI Framework:** React 18
- **Build Tool:** Vite 5
- **HTTP Client:** Axios 1.7
- **Iconography:** Lucide React
- **Styling:** Custom Vanilla CSS with CSS Custom Properties, Glassmorphism & Micro-animations
- **Hosting Platform:** Vercel

---

## 📁 Repository Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── taskService.js          # Axios API communication with Render backend
│   ├── components/
│   │   ├── ConfirmModal.jsx        # Safe deletion confirmation dialog
│   │   ├── Navbar.jsx              # Brand header, live date, theme switcher, new task action
│   │   ├── NotificationToast.jsx   # Animated toast alerts (success, error, info)
│   │   ├── TaskFilter.jsx          # All / Pending / Completed tabs, search & sort
│   │   ├── TaskItem.jsx            # Individual task card with animated status toggle
│   │   ├── TaskList.jsx            # Task grid, skeleton loaders & empty state
│   │   ├── TaskModal.jsx           # Task creation and prefilled editing modal
│   │   └── TaskStats.jsx           # Metrics cards and dynamic completion progress bar
│   ├── App.css                     # Component layouts, glassmorphism, responsive styles
│   ├── App.jsx                     # State management, data fetching, optimistic UI
│   ├── index.css                   # Global design tokens, light/dark themes
│   └── main.jsx                    # React DOM entry point
├── .env.example                    # Template for Vite environment variables
├── .gitignore                      # Git ignore rules (node_modules, dist, .env)
├── index.html                      # HTML5 template with SEO & Google Fonts
├── package.json                    # Project dependencies & scripts
├── vercel.json                     # Vercel SPA rewrite configuration
├── vite.config.js                  # Vite configuration & dev proxy
└── README.md
```

---

## ⚙️ Environment Variables (Vercel)

The frontend communicates with the Spring Boot backend using a single environment variable:

| Variable Name | Required in Production | Example Value | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | **Yes (on Vercel)** | `https://daily-task-manager-backend.onrender.com` | Base URL of your deployed Spring Boot backend on Render. |

> **Note on Local Development:**
> If `VITE_API_BASE_URL` is omitted locally, Vite's dev server automatically proxies API requests (`/api/*`) to `http://localhost:8080`.

---

## 🚀 Local Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Access the application at: **`http://localhost:5173`**

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🚢 Deploying to Vercel

1. **Push frontend to a GitHub repository** named `daily-task-manager-frontend`.
2. **Log into Vercel** ([vercel.com](https://vercel.com/)).
3. Click **Add New...** -> **Project**.
4. Import your `daily-task-manager-frontend` repository.
5. In project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (if repository contains frontend directly) or `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. In **Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: Your Render backend URL (e.g. `https://daily-task-manager-backend.onrender.com`)
7. Click **Deploy**.
Vercel will build the frontend and provide your live URL (e.g., `https://daily-task-manager-frontend.vercel.app`).
8. Copy your Vercel URL and set it as `FRONTEND_URL` in your Render backend settings so CORS permits cross-origin API calls.
