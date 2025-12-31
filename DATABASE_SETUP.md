# Database Setup Commands

## The Problem Fixed

I've updated the API to use `createClient()` which automatically uses the **pooled connection string** (`POSTGRES_URL`). This fixes the `invalid_connection_string` error.

## Step 1: Create the Comments Table

Run this command in your terminal (from your project directory):

```bash
printf "CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);\n" | npx prisma db execute --stdin
```

## Step 2: Verify Table Exists

Check if the table was created:

```bash
printf "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename='comments';\n" | npx prisma db execute --stdin
```

You should see `comments` in the results.

## Step 3: Test the Table

Try inserting a test comment:

```bash
printf "INSERT INTO comments (page, name, comment) VALUES ('/', 'Test User', 'This is a test comment') RETURNING id, page, name, comment, created_at;\n" | npx prisma db execute --stdin
```

## Step 4: Verify Vercel Environment Variables

Make sure these are set in **Vercel Dashboard** → **Settings** → **Environment Variables**:

- ✅ `POSTGRES_URL` (pooled connection - should be auto-added)
- ✅ `POSTGRES_PRISMA_URL` (should be auto-added)
- ✅ `POSTGRES_URL_NON_POOLING` (should be auto-added)
- ✅ `TURNSTILE_SECRET_KEY` (you need to add this)

**Important:** The API now uses `POSTGRES_URL` (pooled connection) automatically via `createClient()`.

## Step 5: Redeploy

After creating the table:

1. Commit and push the API changes:
   ```bash
   git add api/comments/index.js
   git commit -m "Fix: Use createClient() for pooled connection"
   git push
   ```

2. Or manually redeploy in Vercel Dashboard

## Step 6: Test

1. Visit: `https://project-win-ar.vercel.app/api/comments?page=/`
2. Should return JSON (even if empty comments array)
3. Try posting a comment on your site

## Troubleshooting

### If table creation fails:
- Make sure you're in the project directory
- Make sure Prisma is configured correctly
- Check that database connection is working

### If API still fails:
- Check Vercel Function Logs for new errors
- Verify `POSTGRES_URL` is set in Vercel environment variables
- Make sure the table exists (run verification query)

