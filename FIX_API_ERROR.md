# Fix: "Server returned an invalid response" Error

## The Problem

You're getting: `Server returned an invalid response. Please check the API endpoint.`

This means the API is returning HTML (an error page) instead of JSON. Let's diagnose and fix it step by step.

## Step 1: Test the API Directly

Open your browser and go to:
```
https://your-domain.vercel.app/api/comments?page=/
```

**What you should see:**
- JSON response like: `{"comments":[],"pagination":{...}}`

**What you're probably seeing:**
- HTML error page (404 or 500 error)
- Or a blank page

## Step 2: Check Vercel Function Logs

This is the most important step to see what's actually wrong:

1. **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Look for `/api/comments` in the list
4. Click on it
5. Check the **Logs** tab

**Common errors you might see:**

### Error 1: "relation 'comments' does not exist"
**Fix:** Create the database table (see Step 3)

### Error 2: "TURNSTILE_SECRET_KEY not configured"
**Fix:** Add the environment variable (see Step 4)

### Error 3: "Cannot find module '@vercel/postgres'"
**Fix:** The dependency isn't installed - check `package.json` has it

### Error 4: Function not found / 404
**Fix:** The API route isn't being detected (see Step 5)

## Step 3: Create Database Table (If Missing)

If you see "relation 'comments' does not exist":

1. **Vercel Dashboard** → **Storage** → Your Database
2. Click **Query** tab
3. Run this SQL:

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

4. Click **Run**
5. You should see "Success" or "Table created"

## Step 4: Verify Environment Variables

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Check these exist:
   - ✅ `POSTGRES_URL` (auto-added)
   - ✅ `POSTGRES_PRISMA_URL` (auto-added)
   - ✅ `POSTGRES_URL_NON_POOLING` (auto-added)
   - ✅ `TURNSTILE_SECRET_KEY` (you need to add this)

**If `TURNSTILE_SECRET_KEY` is missing:**
1. Get it from Cloudflare Dashboard → Turnstile → Your Site
2. Add it in Vercel
3. Redeploy

## Step 5: Verify API Directory Structure

The `api` directory must be in the **root** of your project, not in `public/`.

**Correct structure:**
```
win-website/
├── api/
│   └── comments/
│       └── index.js    ← Must be here
├── public/              ← Static files go here
└── package.json
```

**Incorrect structure:**
```
win-website/
├── public/
│   └── api/            ← WRONG! API can't be here
│       └── comments/
│           └── index.js
```

**To verify:**
1. Check your GitHub repository
2. The `api` folder should be at the root level
3. It should NOT be inside `public/`

## Step 6: Check Build Process

The build script should NOT copy the `api` directory to `public/`. Verify `build.js` doesn't include `api` in the copy list.

## Step 7: Redeploy

After fixing any issues:

1. **Vercel Dashboard** → **Deployments**
2. Click **⋯** on latest deployment
3. Click **Redeploy**

Or push a new commit:
```bash
git add .
git commit -m "Fix API route"
git push
```

## Step 8: Test Again

1. Test API directly: `https://your-domain.vercel.app/api/comments?page=/`
2. Should return JSON
3. Try posting a comment on your site
4. Check browser console (F12) for errors

## Quick Diagnostic Commands

**In browser console (F12), run:**
```javascript
// Test GET request
fetch('/api/comments?page=/')
  .then(r => r.text())
  .then(text => {
    console.log('Response:', text);
    try {
      const json = JSON.parse(text);
      console.log('✅ Valid JSON:', json);
    } catch(e) {
      console.error('❌ Not JSON:', e);
    }
  })
  .catch(err => console.error('Request failed:', err));
```

This will show you exactly what the API is returning.

## Most Common Issues

1. **Database table doesn't exist** → Run schema SQL (Step 3)
2. **API route not found** → Check directory structure (Step 5)
3. **Missing environment variable** → Add `TURNSTILE_SECRET_KEY` (Step 4)
4. **Function not deployed** → Redeploy (Step 7)

## Still Not Working?

Share:
1. What you see when visiting `/api/comments?page=/` directly
2. The error from Vercel Function Logs
3. Your project structure (is `api/` in root or `public/`?)

