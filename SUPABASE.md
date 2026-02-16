
# Supabase Database Setup

This document contains the complete SQL schema and configuration required to deploy the backend for Mango.

## 1. Initial Setup

Run this in the **SQL Editor** of your Supabase project.

```sql
-- Enable UUID extension for unique identifiers
create extension if not exists "uuid-ossp";
```

## 2. Table Definitions

### 2.1 User Profiles
Stores user identity and links to Supabase Auth.

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  company_name text,
  role text default 'owner', -- 'owner', 'editor', 'viewer'
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
```

### 2.2 Brand Kits
Stores brand identity data (colors, fonts, etc.).

```sql
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  primary_color text,
  secondary_color text,
  font text,
  tone text,
  logo_url text,
  guidelines text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone
);

alter table public.brands enable row level security;

create policy "Users can crud own brands" on public.brands
  for all using (auth.uid() = user_id);
```

### 2.3 Competitor Library
Stores analyzed competitor ads and insights.

```sql
create table public.competitors (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  analysis jsonb not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.competitors enable row level security;

create policy "Users can crud own competitors" on public.competitors
  for all using (auth.uid() = user_id);
```

### 2.4 Campaigns
The core entity storing briefs, strategy, and results.

```sql
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  brand_id uuid references public.brands(id),
  name text not null,
  product_name text,
  description text,
  target_audience text,
  goal text,
  platform text,
  status text default 'draft',
  
  -- JSONB columns for complex AI Agent outputs
  creative_controls jsonb,
  scene_configuration jsonb,
  competitor_analysis jsonb,
  planner_output jsonb,
  director_output jsonb,
  ad_copy jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone
);

alter table public.campaigns enable row level security;

create policy "Users can crud own campaigns" on public.campaigns
  for all using (auth.uid() = user_id);
```

### 2.5 Generated Images
Stores the actual creative assets produced by the AI.

```sql
create table public.generated_images (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  storage_path text,
  prompt text,
  aspect_ratio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.generated_images enable row level security;

create policy "Users can view own images" on public.generated_images
  for select using (auth.uid() = user_id);

create policy "Users can insert own images" on public.generated_images
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own images" on public.generated_images
  for delete using (auth.uid() = user_id);
```

### 2.6 Scheduler
Stores scheduled ad events.

```sql
create table public.scheduled_ads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  platform text,
  scheduled_for timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.scheduled_ads enable row level security;

create policy "Users can crud own schedules" on public.scheduled_ads
  for all using (auth.uid() = user_id);
```

### 2.7 Credits & Billing
Manages user quota and Stripe link.

```sql
create table public.user_credits (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  stripe_customer_id text,
  total_credits int default 50,
  used_credits int default 0,
  plan_tier text default 'starter',
  history jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_credits enable row level security;

create policy "Users can view own credits" on public.user_credits
  for select using (auth.uid() = user_id);

create policy "Users can update own credits" on public.user_credits
  for update using (auth.uid() = user_id);

create policy "Users can insert own credits" on public.user_credits
  for insert with check (auth.uid() = user_id);
```

### 2.8 Activity Logs
Tracks user actions for the dashboard.

```sql
create table public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.activity_logs enable row level security;

create policy "Users can insert own activity" on public.activity_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can view own activity" on public.activity_logs
  for select using (auth.uid() = user_id);
```

### 2.9 Tasks
User task management.

```sql
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text,
  priority text default 'medium',
  due_date bigint, 
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Users can crud own tasks" on public.tasks
  for all using (auth.uid() = user_id);
```

### 2.10 Automation Configs
Batch generation settings.

```sql
create table public.automation_configs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  brand_id uuid references public.brands(id) on delete cascade,
  product_name text not null,
  frequency text not null,
  active boolean default true,
  last_run bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.automation_configs enable row level security;

create policy "Users can crud own automations" on public.automation_configs
  for all using (auth.uid() = user_id);
```

### 2.11 Team Members
Simple team invite/management list.

```sql
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  email text not null,
  name text,
  role text default 'viewer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.team_members enable row level security;

create policy "Users can crud own team" on public.team_members
  for all using (auth.uid() = owner_id);
```

## 3. Automation Triggers

Automatically creates a `profile` and `user_credits` entry when a user signs up.

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create Profile
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Initialize Credits
  insert into public.user_credits (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Attach Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. Storage Configuration

Run this SQL to configure the permissions automatically.

```sql
-- Insert buckets (Idempotent)
insert into storage.buckets (id, name, public) values ('campaign-assets', 'campaign-assets', true) ON CONFLICT DO NOTHING;
insert into storage.buckets (id, name, public) values ('brand-assets', 'brand-assets', true) ON CONFLICT DO NOTHING;
insert into storage.buckets (id, name, public) values ('competitor-assets', 'competitor-assets', true) ON CONFLICT DO NOTHING;

-- Policy: Allow Uploads (Authenticated Users)
create policy "Authenticated users can upload campaign assets"
on storage.objects for insert to authenticated 
with check (bucket_id = 'campaign-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Authenticated users can upload brand assets"
on storage.objects for insert to authenticated 
with check (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Authenticated users can upload competitor assets"
on storage.objects for insert to authenticated 
with check (bucket_id = 'competitor-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Allow Deletes (Authenticated Users)
create policy "Users can delete own campaign assets"
on storage.objects for delete to authenticated
using (bucket_id = 'campaign-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own brand assets"
on storage.objects for delete to authenticated
using (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own competitor assets"
on storage.objects for delete to authenticated
using (bucket_id = 'competitor-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Allow Public Read Access
create policy "Public access to assets"
on storage.objects for select to public 
using (bucket_id in ('campaign-assets', 'brand-assets', 'competitor-assets'));
```
