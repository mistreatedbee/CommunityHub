# Vercel deployment checklist

## 1. Environment variables (required)

In **Vercel → Your project → Settings → Environment Variables**, add:

| Name | Value | Notes |
|------|--------|------|
| `VITE_SUPABASE_URL` | `https://radiorvcndflygzicbte.supabase.co` | No quotes, no trailing slash |
| `VITE_SUPABASE_ANON_KEY` | *(your anon key from Supabase)* | Project Settings → API → anon public |

- Use the **same** values as in your local `.env`.
- **Redeploy** after adding/changing these (Vite bakes them in at build time).

## 2. Supabase Auth → Redirect URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL:** your Vercel URL, e.g. `https://your-app.vercel.app`
- **Redirect URLs:** add:
  - `https://your-app.vercel.app/**`
  - `https://your-app.vercel.app`
  - (and any custom domains you use)

## 3. Why “Supabase shows logged in” but the app doesn’t

- Session is stored **per origin** (e.g. localhost vs Vercel).
- If you logged in on **localhost**, the Vercel site has **no** session until you log in again **on the Vercel URL**.
- Open your **live Vercel URL**, go to **Login**, and sign in there once. After that, the app will show you as logged in on that domain.

## 4. Super admin / “can’t create accounts”

- Ensure your user has a **profile** and **super_admin** in the DB. In **Supabase → SQL Editor**, run the contents of **`supabase/fix-super-admin.sql`** (once per project).
- Create new users in **Supabase → Authentication → Users → Add user** (with **Auto Confirm User** if you want them to log in without email confirmation).

## 5. Quick check

- Vercel env: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set → **Redeploy**.
- Supabase: Redirect URLs include your Vercel URL.
- Supabase: Profile exists for your email and `platform_role = 'super_admin'` (run `fix-super-admin.sql`).
- Then open the **Vercel** site (not localhost) and log in with email + password.
