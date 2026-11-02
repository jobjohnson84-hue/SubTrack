# SubTrack – Your subscriptions, simplified.

A modern, responsive, and functional personal subscription management web application built with React, Vite, and Tailwind CSS.

## Deployment readiness

SubTrack is a static client-side application: it has no environment variables, secrets, backend services, or authentication configuration. Subscription data stays in the visitor's browser under the `subtrack_subscriptions` localStorage key.

- Run `npm run build` to create the production-ready `dist/` folder.
- Vercel is ready to deploy using the included `vercel.json` SPA rewrite.
- Netlify is ready to deploy using `public/_redirects`; use `npm run build` and publish `dist`.
- Both configurations allow direct navigation and refresh on `/`, `/subscriptions`, and `/insights`.

---

## 🚀 Overview

**SubTrack** is designed to give you clarity and control over your recurring subscriptions, monitor monthly and annual spending, and keep track of upcoming renewal dates before they surprise you.

### Key Highlights
- **Tagline:** *"Your subscriptions, simplified."*
- **No Backend / 100% Client-Side:** Persists data reliably in browser `localStorage`.
- **Accurate Financial Calculations:** Excludes paused subscriptions, normalizes monthly equivalents, and computes annual totals with precision.
- **Smart Renewal Forecasting:** Automatically detects past renewal dates and advances them by the billing interval (respecting month-end dates such as Jan 31 ➔ Feb 28) without modifying stored data.
- **SaaS-Grade UI/UX:** Built with a clean aesthetic, indigo accents, rounded cards, subtle shadows, and responsive layouts for desktop and mobile.

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** JavaScript (ES Modules)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Storage:** Browser `localStorage` (Key: `subtrack_subscriptions`)

---

## 📱 Application Pages

### 1. Dashboard (`/`)
- Header with SubTrack logo and navigation.
- Welcome banner featuring the tagline *"Your subscriptions, simplified."*
- **4 Dynamic Summary Cards:**
  1. **Total Active Subscriptions** (with paused count indicator)
  2. **Estimated Monthly Spending** (in ₹ INR)
  3. **Estimated Yearly Spending** (in ₹ INR)
  4. **Upcoming Renewals (Next 30 Days)**
- **Upcoming Renewals List:** Shows service names, categories, renewal dates, amounts, and urgency badges.
- **Quick Actions:** "Add Subscription" modal launcher.
- **Empty States:** Friendly placeholders when no subscriptions exist.

### 2. My Subscriptions (`/subscriptions`)
- Responsive grid of subscription cards displaying:
  - Service Name & Category badge
  - Price formatted in INR & Billing cycle (Monthly / Yearly)
  - Next Renewal Date & relative countdown timing
  - Status indicator (Active or Paused)
- **Interactive Controls:**
  - Search by subscription name
  - Filter by Category (Entertainment, Productivity, Education, Cloud Storage, Utilities, Other)
  - Filter by Status (Active / Paused)
  - Sort by Renewal Date, Name, or Price
- **Actions:**
  - **Add Subscription Modal** with full validation (Service Name, Category, Price ≥ 0, Billing Cycle, Renewal Date, Status)
  - **Edit Subscription Modal** prefilled with existing data
  - **Delete Subscription** with custom confirmation dialog
  - Non-blocking toast notifications for user actions

### 3. Spending Insights (`/insights`)
- **Key Metrics:** Monthly Equivalent Total and Annual Projected Spending.
- **Spending by Category Chart:** Interactive Donut/Pie chart powered by Recharts with custom tooltips.
- **Subscription Category Breakdown Table:** Itemized category count, monthly spend, annual spend, and percentage share.
- **Most Expensive Subscriptions List:** Top 5 services ranked by monthly equivalent expense.
- Active-only calculation enforcement (paused plans do not distort active financial summaries).

---

## 📦 Demo Data

When launched for the first time, SubTrack initializes four realistic sample subscriptions:
1. **Netflix** – Entertainment – ₹649/month
2. **Spotify** – Entertainment – ₹119/month
3. **Google One** – Cloud Storage – ₹130/month
4. **Adobe Creative Cloud** – Productivity – ₹1,999/month

> **Note on Persistence:** Demo data is initialized **only** when the `subtrack_subscriptions` key has never been set. If you delete all subscriptions, the list remains empty even after browser refresh. You can easily reload sample data anytime using the **"Reset Demo Data"** button in the footer.

---

## 🏃 Running the Application Locally

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
This generates the optimized static build files in the `dist/` directory.

### 4. Preview the Production Build Locally
```bash
npm run preview
```

### 5. Run Verification Tests
```bash
node test_calculations.mjs
```

---

## ☁️ Deployment

### Deploying to Netlify
The project includes a `public/_redirects` file (`/* /index.html 200`) to support single-page application (SPA) client-side routing on Netlify.
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Deploying to Vercel
The project includes a `vercel.json` rewrite configuration.
- Connect your Git repository to Vercel.
- Framework preset: **Vite**
- **Build command:** `npm run build`
- **Output directory:** `dist`

---

## 📐 Calculation & Date Forecasting Rules

1. **Monthly Equivalent:**
   - Monthly plan: `Price`
   - Yearly plan: `Price ÷ 12`
2. **Estimated Annual Spending:**
   - `Sum of Monthly Equivalents × 12`
3. **Paused Subscriptions:**
   - Paused items are excluded from active monthly and annual spending totals.
4. **Smart Date Advancement:**
   - If a subscription's renewal date is in the past, SubTrack calculates the next effective date by advancing it by month or year increments until `>= today`, safely clamping to month-end limits (e.g. Jan 31 -> Feb 28/29). Stored records in `localStorage` are preserved unmodified.

---

## 📄 License
MIT License. Built for demonstration and personal subscription tracking.

