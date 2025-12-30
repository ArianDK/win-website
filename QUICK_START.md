# Quick Start Guide

## Before You Start

1. **Get Cloudflare Turnstile Keys**
   - Go to https://dash.cloudflare.com/ → Turnstile
   - Create a new site
   - Copy **Site Key** (public) and **Secret Key** (private)

## Step 1: Configure Frontend

Edit `config.js`:
```javascript
window.TURNSTILE_SITE_KEY = 'your_site_key_here';
```

## Step 2: Setup Vercel Postgres

1. In Vercel Dashboard → Your Project → **Storage** → **Create Database** → **Postgres**
2. Name it (e.g., `win-comments-db`)
3. Copy the connection string (auto-added to env vars)

## Step 3: Create Database Table

Run the SQL from `database/schema.sql` in your Vercel Postgres database:

```sql
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
```

## Step 4: Set Environment Variables in Vercel

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

- `TURNSTILE_SITE_KEY` = your site key
- `TURNSTILE_SECRET_KEY` = your secret key

(Postgres connection strings are auto-added)

## Step 5: Deploy

```bash
vercel
```

Or push to GitHub and import in Vercel Dashboard.

## Step 6: Test

1. Visit your deployed site
2. Scroll to comments section
3. Post a test comment
4. Verify it appears immediately

## Managing Comments

**View comments:**
```sql
SELECT * FROM comments ORDER BY created_at DESC;
```

**Delete a comment:**
```sql
DELETE FROM comments WHERE id = 123;
```

Access via:
- Vercel Dashboard → Storage → Your Database → Query tab
- Any PostgreSQL client (pgAdmin, DBeaver, etc.)

## Troubleshooting

**Comments not loading?**
- Check browser console
- Verify API: `https://your-domain.vercel.app/api/comments`
- Check Vercel function logs

**Turnstile failing?**
- Verify keys are set correctly
- Ensure site key matches domain in Cloudflare

**Database errors?**
- Verify schema was run
- Check environment variables

For detailed instructions, see [SETUP.md](./SETUP.md).

