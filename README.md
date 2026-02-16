
# 🥭 Mango - AI Ad Creative Platform

Mango is a professional-grade AI application designed to generate high-converting Facebook, Instagram, and TikTok ad creatives. Unlike generic image generators, Mango uses a sophisticated **Multi-Agent System** that mimics a real-world creative agency workflow: Strategy → Art Direction → Production → Copywriting.

Built with **React 19**, **Tailwind CSS**, and powered by **Google's Gemini 3 Pro** models.

---

## 🚀 Key Features

### 🧠 Intelligent Agent Pipeline
- **Planner Agent**: Analyzes product info and audience psychographics to generate a strategic brief, hooks, and emotional angles.
- **Director Agent**: Translates the brief into technical photography directives (lighting, camera lenses, composition) and enforces brand guidelines.
- **Production Agent**: Generates high-fidelity assets using `gemini-3-pro-image-preview`.
- **Copywriter Agent**: Writes platform-specific primary text, headlines, and CTAs using direct-response frameworks.

### 🔥 Advanced Tools
- **Competitor Spy**: Upload a competitor's ad to deconstruct their strategy, find weaknesses, and generate a counter-creative.
- **Brand DNA System**: Define and store brand identities (Hex codes, fonts, tone of voice) to ensure consistent output.
- **Performance Prediction**: An AI scoring system that predicts Attention, Clarity, and Conversion potential before you spend ad budget.
- **Creative Studio**: Built-in editor to add text overlays and hooks to generated images.
- **Batch Generator**: Agency-mode tool to generate concepts for multiple products simultaneously.

### 💳 Billing & Credits System
- **Stripe Integration**: Secure subscription management and one-time credit purchases.
- **Credit Logic**: Usage-based metering for AI generations (Pro/Agency tiers).
- **Invoices**: Self-serve customer portal for billing history.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (Dark mode optimized)
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Backend & Auth**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Stripe API + Stripe Elements
- **Visual Effects**: Three.js (Landing page light pillars)

---

## 📂 Project Structure

```
/src
  /agents       # AI Logic (Planner, Director, Copy, etc.)
  /components   # UI Components (Cards, Buttons, Layouts)
  /pages        # Application Routes
  /services     # Data Layer (DB, Storage, Billing, AI)
  /store        # State Management (Context API)
  /lib          # External Clients (Supabase, Stripe)
/supabase
  /functions    # Serverless Edge Functions (Deno)
    /create-checkout  # Stripe Session Creation
    /create-portal    # Customer Portal
    /stripe-webhook   # Event Listener
```

---

## ⚡ Supabase & Backend Setup

To make this app production-ready, you must configure Supabase and Stripe.

### 1. Database Schema
Refer to **[SUPABASE.md](./SUPABASE.md)** for the complete SQL schema. Run the provided SQL in your Supabase Dashboard to create tables for Users, Campaigns, Credits, and RLS policies.

### 2. Edge Functions Deployment
The app uses Supabase Edge Functions to handle secure Stripe transactions.

**Prerequisites:**
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed.
- [Docker](https://docs.docker.com/get-docker/) running.

**Steps:**

1.  **Login to Supabase CLI:**
    ```bash
    npx supabase login
    ```

2.  **Link your project:**
    ```bash
    npx supabase link --project-ref your-project-id
    ```

3.  **Set Environment Secrets:**
    You need to set your Stripe keys in the remote Supabase environment.
    ```bash
    npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
    npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
    npx supabase secrets set SUPABASE_URL=https://your-project.supabase.co
    npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```

4.  **Deploy Functions:**
    ```bash
    npx supabase functions deploy
    ```

### 3. Stripe Configuration
1.  Create a product in Stripe Dashboard for "Pro Plan" and "Agency Plan".
2.  Copy the `price_ID`s.
3.  Update `src/services/db/billingService.ts` with your actual Stripe Price IDs.
4.  Add your webhook endpoint (`https://<project-ref>.supabase.co/functions/v1/stripe-webhook`) to Stripe Developers Dashboard.

---

## ⚡ Getting Started (Frontend)

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Gemini API access enabled.
- A Supabase Project.
- A Stripe Account.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/mango.git
    cd mango
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Rename `.env.example` to `.env` and fill in your keys:
    ```bash
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
    API_KEY=... (Google Gemini)
    ```

4.  **Run Development Server**
    ```bash
    npm start
    ```

---

## 🛡️ Privacy & Data

- **AI Logic**: Processed via Google's Gemini API.
- **User Data**: Stored in your private Supabase instance (PostgreSQL).
- **Payment Info**: Processed exclusively by Stripe; no credit card data touches your servers.
- **Offline Mode**: If Supabase keys are missing, the app gracefully falls back to `localStorage` for demo purposes.

---

## 📄 License

This project is licensed under the MIT License.
