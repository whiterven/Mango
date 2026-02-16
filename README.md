
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
- **Website Scraper**: Auto-fill campaign briefs by analyzing any product URL.
- **Creative Studio**: Built-in editor to add text overlays and hooks to generated images.
- **Batch Generator**: Agency-mode tool to generate concepts for multiple products simultaneously.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Dark mode optimized)
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Visual Effects**: Three.js (Landing page light pillars)
- **State Management**: React Context + LocalStorage persistence
- **Icons**: Heroicons (via SVG)

---

## 🤖 AI Models Used

Mango leverages specific Gemini models for specialized tasks:

| Feature | Model | Purpose |
| :--- | :--- | :--- |
| **Strategy & Logic** | `gemini-3-pro-preview` | Complex reasoning, brief generation, competitor analysis. |
| **Image Generation** | `gemini-3-pro-image-preview` | High-fidelity ad creatives (1K resolution). |
| **Copywriting** | `gemini-3-flash-preview` | Fast, punchy text generation for headlines and captions. |

---

## ⚡ Supabase Database Setup

To make this app production-ready with a real backend, execute the following SQL in your Supabase SQL Editor.

### 1. Enable Extensions
```sql
-- Enable UUID extension for unique identifiers
create extension if not exists "uuid-ossp";
```

### 2. Create Tables

#### User Profiles
```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  company_name text,
  role text default 'owner',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure the table
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
```

#### Brand Kits
```sql
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  primary_color text,
  secondary_color text,
  font text,
  tone text,
  logo_url text,
  guidelines text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.brands enable row level security;

create policy "Users can CRUD own brands" on public.brands
  for all using (auth.uid() = user_id);
```

#### Campaigns
```sql
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  brand_id uuid references public.brands(id),
  name text not null,
  product_name text,
  description text,
  target_audience text,
  goal text,
  platform text,
  status text default 'draft',
  
  -- JSONB columns for complex agent outputs
  creative_controls jsonb,
  scene_configuration jsonb,
  competitor_analysis jsonb,
  planner_output jsonb,
  director_output jsonb,
  ad_copy jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.campaigns enable row level security;

create policy "Users can CRUD own campaigns" on public.campaigns
  for all using (auth.uid() = user_id);
```

#### Generated Images
```sql
create table public.generated_images (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  storage_path text not null, -- Path in Supabase Storage
  prompt text,
  aspect_ratio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.generated_images enable row level security;

create policy "Users can view own images" on public.generated_images
  for select using (auth.uid() = user_id);
```

#### Competitor Library
```sql
create table public.competitors (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  analysis_json jsonb not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.competitors enable row level security;

create policy "Users can CRUD own competitors" on public.competitors
  for all using (auth.uid() = user_id);
```

#### Credits & Billing
```sql
create table public.user_credits (
  user_id uuid references public.profiles(id) primary key,
  total_credits int default 50,
  used_credits int default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.user_credits enable row level security;

create policy "Users can view own credits" on public.user_credits
  for select using (auth.uid() = user_id);
```

### 3. Setup Triggers (Auto-create Profile)
```sql
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  insert into public.user_credits (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4. Storage Buckets configuration
You need to create these buckets in the Storage section of Supabase dashboard:
1. `campaign-assets` (Public: false)
2. `brand-assets` (Public: true)

**Storage Policies (SQL):**
```sql
-- Campaign Assets Policy
create policy "Give users access to own folder 1xyz"
on storage.objects for all
using ( bucket_id = 'campaign-assets' and auth.uid()::text = (storage.foldername(name))[1] );

-- Brand Assets Policy
create policy "Give users access to own folder 2xyz"
on storage.objects for all
using ( bucket_id = 'brand-assets' and auth.uid()::text = (storage.foldername(name))[1] );
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Gemini API access enabled.
- An API Key with access to the `gemini-3-pro` series models.

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

3.  **Run Development Server**
    ```bash
    npm start
    ```

### API Key Configuration
The app requires a valid Google GenAI API key.
- On first load, if running in a supported environment (like AI Studio), it may request the key automatically.
- Otherwise, ensure your environment provides `process.env.API_KEY` or follow the in-app prompts if configured for client-side entry.

---

## 🛡️ Privacy & Data

Mango processes data using Google's Gemini API.
- Generated images and campaign data are stored locally in the browser (`localStorage`) for persistence.
- No personal data is sent to third-party servers other than the necessary API calls to Google for generation.

---

## 📄 License

This project is licensed under the MIT License.
