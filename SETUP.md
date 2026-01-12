# Setup Guide

> **Note:** This guide is for anyone who wants to set up their own instance of this project locally. Replace placeholder values (like `YOUR-PROJECT`, `YOUR_GITHUB_URL`) with your own values.

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon key** from Settings → API

### Create Database Table
Go to **SQL Editor** and run:

```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);
```

### Configure Email Auth
1. Go to **Authentication → Providers → Email**
2. Ensure "Enable Email provider" is ON
3. Turn OFF "Confirm email" for easier testing

### Configure Google OAuth
1. Go to **Authentication → Providers → Google**
2. Enable Google
3. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase

---

## 2. Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=your-key

# Run dev server
npm run dev
```

---

## 3. Netlify Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Private Notes Vault"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) → Log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Add environment variables"**:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **"Deploy"**

### Step 3: Configure Supabase Redirect
1. Copy your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Go to Supabase → **Authentication → URL Configuration**
3. Add your Netlify URL to:
   - **Site URL**
   - **Redirect URLs**

Done! Your app is live 🎉
