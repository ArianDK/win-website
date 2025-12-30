# Diagnose Database Error

## The Problem

You're getting:
- `{"error":"Failed to fetch comments"}` when visiting `/api/comments?page=/`
- `"Failed to post comment"` when trying to post

This means the API is running, but there's a database error. **Most likely: the `comments` table doesn't exist.**

## Step 1: Check Vercel Function Logs

This will show you the exact error:

1. **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Click on `/api/comments`
4. Check the **Logs** tab
5. Look for the most recent error

**What you're probably seeing:**
- `relation "comments" does not exist` ← This means the table is missing
- Or a database connection error

## Step 2: Verify Database Table Exists

1. **Vercel Dashboard** → **Storage** → Your Database
2. Click **Query** tab (or **SQL Editor**)
3. Run this query:
   ```sql
   SELECT * FROM comments LIMIT 1;
   ```

**If you get an error "relation 'comments' does not exist":**
- The table hasn't been created yet
- Go to Step 3

**If the query works (returns empty or shows data):**
- Table exists, check connection strings (Step 4)

## Step 3: Create the Database Table

**This is most likely what you need to do:**

1. **Vercel Dashboard** → **Storage** → Your Database
2. Click **Query** tab
3. Copy and paste this SQL:

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

4. Click **Run** or **Execute**
5. You should see "Success" or "Table created"

## Step 4: Verify Environment Variables

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Check these exist:
   - ✅ `POSTGRES_URL`
   - ✅ `POSTGRES_PRISMA_URL`
   - ✅ `POSTGRES_URL_NON_POOLING`
   - ✅ `TURNSTILE_SECRET_KEY`

If any are missing, add them.

## Step 5: Test Again

After creating the table:

1. Visit: `https://project-win-ar.vercel.app/api/comments?page=/`
2. You should see:
   ```json
   {
     "comments": [],
     "pagination": {
       "currentPage": 1,
       "totalPages": 0,
       "totalComments": 0,
       "hasNext": false,
       "hasPrevious": false
     }
   }
   ```

3. Try posting a comment on your site
4. It should work now!

## Quick Checklist

- [ ] Checked Vercel Function Logs for exact error
- [ ] Verified `comments` table exists (run `SELECT * FROM comments LIMIT 1;`)
- [ ] Created table if it doesn't exist (run CREATE TABLE SQL)
- [ ] Verified environment variables are set
- [ ] Tested API endpoint again
- [ ] Tried posting a comment

## Still Not Working?

Share:
1. The exact error from Vercel Function Logs
2. What happens when you run `SELECT * FROM comments LIMIT 1;` in the database query tab

