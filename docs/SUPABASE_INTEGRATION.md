
# Supabase Integration Guide

Mango supports a hybrid data architecture:
1. **Cloud Mode**: Connects to Supabase for persistence, auth, and storage.
2. **Offline Mode**: Uses `localStorage` and `IndexedDB` when credentials are missing.

## 🚀 Setup Instructions

### 1. Create a Supabase Project
Go to [database.new](https://database.new) and create a project.

### 2. Run Database Migrations
Execute the SQL found in the root `SUPABASE.md` file in your Supabase SQL Editor.
This creates tables for:
- `profiles`
- `campaigns`
- `generated_images`
- `brands`
- `competitors`
- `user_credits`

### 3. Configure Storage
Create 3 public buckets in Supabase Storage:
- `campaign-assets`
- `brand-assets`
- `competitor-assets`

### 4. Connect Environment
Rename `.env.example` to `.env` and add your keys:

```bash
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
```

## 🛠 Architecture

### Lazy Initialization
The client is initialized in `src/lib/supabase.ts` only if keys exist.
If keys are missing, `getSupabaseClient()` returns `null`.

### Service Layer Pattern
All data access goes through `src/services/db/`.
Each service follows this pattern:

```typescript
async getData(id) {
  const client = getSupabaseClient();
  if (client) {
    // ... fetch from Supabase
  } else {
    // ... fetch from LocalStorage (Fallback)
  }
}
```

This ensures the app **never crashes** if the backend is disconnected.

### Authentication
`useAuth` hook abstracts the provider.
- **Online**: Uses Supabase Auth (Magic Link / Email).
- **Offline**: Mocks a user session (`offline-user-123`).

## ⚠️ Important Notes
- **RLS Policies**: The SQL schema includes Row Level Security. Users can only access their own data.
- **Service Role**: Never use the `SERVICE_ROLE_KEY` in the frontend app.
