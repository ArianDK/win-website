# Troubleshooting: "A server e..." JSON Error

## The Problem

You're getting: `Unexpected token 'A', "A server e"... is not valid JSON`

This means the API is returning an HTML error page instead of JSON. This usually happens when:
1. The database table doesn't exist
2. The API route isn't accessible
3. There's a server configuration error

## Step-by-Step Fix

### Step 1: Verify Database Table Exists

**In Vercel Dashboard:**
1. Go to **Storage** → Your Database
2. Click **Query** tab (or **SQL Editor**)
3. Run this query:
   ```sql
   SELECT * FROM comments LIMIT 1;
   ```

**If you get an error "relation 'comments' does not exist":**
- The table hasn't been created yet
- Run the schema SQL (see Step 2)

**If the query works:**
- Table exists, move to Step 2

### Step 2: Create the Database Table

If the table doesn't exist, create it:

1. **Vercel Dashboard** → **Storage** → Your Database → **Query** tab
2. Copy and paste this SQL:

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

3. Click **Run** or **Execute**
4. You should see a success message

### Step 3: Check API Route

Test if the API endpoint is accessible:

1. Open your browser
2. Go to: `https://your-domain.vercel.app/api/comments?page=/`
3. You should see JSON like:
   ```json
   {
     "comments": [],
     "pagination": {
       "currentPage": 1,
       "totalPages": 0,
       ...
     }
   }
   ```

**If you see HTML or an error page:**
- The API route isn't working
- Check Vercel Function Logs (see Step 4)

### Step 4: Check Vercel Function Logs

1. **Vercel Dashboard** → Your Project
2. Go to **Functions** tab
3. Click on `/api/comments`
4. Check the **Logs** tab
5. Look for error messages

**Common errors:**
- `relation "comments" does not exist` → Table not created (run Step 2)
- `TURNSTILE_SECRET_KEY not configured` → Add env var (see Step 5)
- Database connection errors → Check Postgres connection strings

### Step 5: Verify Environment Variables

**In Vercel Dashboard:**
1. **Settings** → **Environment Variables**
2. Verify these exist:
   - `POSTGRES_URL` (auto-added by Vercel)
   - `POSTGRES_PRISMA_URL` (auto-added)
   - `POSTGRES_URL_NON_POOLING` (auto-added)
   - `TURNSTILE_SECRET_KEY` (you need to add this)

**If `TURNSTILE_SECRET_KEY` is missing:**
1. Get it from Cloudflare Dashboard → Turnstile → Your Site
2. Add it to Vercel environment variables
3. Redeploy

### Step 6: Test the API Directly

Open browser console (F12) and run:

```javascript
fetch('/api/comments?page=/')
  .then(r => r.text())
  .then(text => console.log(text))
```

This will show you the raw response. If it's HTML, there's a server error.

### Step 7: Redeploy

After making changes:
1. **Vercel Dashboard** → **Deployments**
2. Click **⋯** on latest deployment
3. Click **Redeploy**

Or push a new commit to trigger auto-deploy.

## Quick Checklist

- [ ] Database table `comments` exists (run schema SQL)
- [ ] `TURNSTILE_SECRET_KEY` is set in Vercel env vars
- [ ] Postgres connection strings are present
- [ ] API endpoint returns JSON (test `/api/comments?page=/`)
- [ ] No errors in Vercel Function Logs
- [ ] Site has been redeployed after changes

## Still Not Working?

1. **Check browser console** (F12) for frontend errors
2. **Check Vercel Function Logs** for backend errors
3. **Test API directly** in browser: `https://your-domain.vercel.app/api/comments?page=/`
4. **Verify database connection** - check if you can query the table
5. **Check environment variables** are set correctly

The most common issue is the database table not existing. Make sure you've run the schema SQL!

