# Next Steps to Get Comment System Working

You've successfully linked your project to Vercel and pulled environment variables. Here's what to do next:

## Step 1: Verify Environment Variables

Check your `.env.local` file. You should see Postgres connection strings (automatically added when you linked the database). 

**Required variables:**
- `POSTGRES_URL` (should be there from database link)
- `POSTGRES_PRISMA_URL` (should be there)
- `POSTGRES_URL_NON_POOLING` (should be there)
- `TURNSTILE_SECRET_KEY` (you need to add this)

## Step 2: Add Turnstile Secret Key to Vercel

1. **Get your Turnstile Secret Key:**
   - Go to https://dash.cloudflare.com/
   - Navigate to **Turnstile** → Your Site
   - Copy the **Secret Key** (not the Site Key - that's already in `config.js`)

2. **Add to Vercel Dashboard:**
   - Go to Vercel Dashboard → Your Project
   - **Settings** → **Environment Variables**
   - Click **Add New**
   - Key: `TURNSTILE_SECRET_KEY`
   - Value: Your secret key from Cloudflare
   - Select **All Environments** (Production, Preview, Development)
   - Click **Save**

3. **Pull the updated env vars locally (optional for testing):**
   ```bash
   vercel env pull .env.local
   ```

## Step 3: Create Database Schema

You need to create the `comments` table in your database.

### Option A: Via Vercel Dashboard (Easiest)

1. Go to **Vercel Dashboard** → Your Project → **Storage**
2. Click on your database (Neon/Postgres)
3. Click on the **Query** tab (or **SQL Editor**)
4. Copy and paste this SQL:

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

5. Click **Run** or **Execute**
6. You should see a success message

### Option B: Via Command Line (if you have psql)

```bash
# Get connection string from .env.local
# Look for POSTGRES_URL_NON_POOLING

psql "your_connection_string_here" -f database/schema.sql
```

## Step 4: Test Locally (Optional)

You can test the API locally using Vercel CLI:

```bash
vercel dev
```

This will:
- Start a local server (usually at http://localhost:3000)
- Use your `.env.local` environment variables
- Allow you to test the comment system locally

**Note:** The Turnstile widget might not work perfectly locally if your domain isn't registered in Cloudflare Turnstile settings.

## Step 5: Deploy to Vercel

If you made changes (like adding environment variables), redeploy:

### Option A: Via Git (Recommended)
```bash
git add .
git commit -m "Add comment system configuration"
git push
```
Vercel will automatically deploy.

### Option B: Via Vercel CLI
```bash
vercel --prod
```

## Step 6: Test on Production

1. Visit your deployed site: `https://your-domain.vercel.app`
2. Scroll to the **Comments & Feedback** section
3. Try posting a comment:
   - Enter a name (optional)
   - Write a comment
   - Complete the Turnstile verification
   - Click **Post Comment**
4. Verify:
   - Comment appears immediately
   - No errors in browser console (F12)
   - Comment is saved in database

## Step 7: Verify Database

To confirm comments are being saved:

1. **Vercel Dashboard** → **Storage** → Your Database
2. Click **Data** tab (or **Query** tab)
3. Run this query:
   ```sql
   SELECT * FROM comments ORDER BY created_at DESC;
   ```
4. You should see your test comment

## Troubleshooting

### Comments not loading?
- Open browser console (F12) and check for errors
- Verify API endpoint: `https://your-domain.vercel.app/api/comments?page=/`
- Check Vercel Function Logs: Dashboard → Your Project → **Functions** → `/api/comments`

### Turnstile not working?
- Verify `TURNSTILE_SECRET_KEY` is set in Vercel environment variables
- Check that your domain is added in Cloudflare Turnstile settings
- Site key in `config.js` should match your Cloudflare Turnstile site

### Database errors?
- Verify schema was created (check if `comments` table exists)
- Check Postgres connection strings in environment variables
- Look at Vercel Function Logs for database connection errors

### API returns 500 error?
- Check Vercel Function Logs for detailed error messages
- Verify `TURNSTILE_SECRET_KEY` is set correctly
- Ensure database schema is created

## Quick Checklist

- [ ] Database linked to Vercel project
- [ ] `TURNSTILE_SECRET_KEY` added to Vercel environment variables
- [ ] Database schema created (comments table exists)
- [ ] Site deployed to Vercel
- [ ] Can post a comment successfully
- [ ] Comment appears immediately after posting
- [ ] Comment visible in database

## Need Help?

If something isn't working:
1. Check browser console for frontend errors
2. Check Vercel Function Logs for backend errors
3. Verify all environment variables are set
4. Ensure database schema is created
5. Test the API endpoint directly: `https://your-domain.vercel.app/api/comments?page=/`

