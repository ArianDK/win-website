# Setup Instructions for Custom Comment System

This document provides step-by-step instructions for setting up the custom comment system locally (XAMPP) and deploying to Vercel.

## Database Choice: Vercel Postgres

**Why Vercel Postgres?**
- Native integration with Vercel hosting
- Easy to inspect and manage via Vercel dashboard or any PostgreSQL client
- Reliable, managed PostgreSQL database
- Simple connection via environment variables
- No complex setup or external services required
- Perfect for structured data like comments

---

## Part 1: Local Development Setup (XAMPP)

### Prerequisites
- XAMPP installed and running
- Node.js 18+ installed (for testing API locally)
- A Cloudflare account (for Turnstile keys)

### Step 1: Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** section
3. Create a new site
4. Copy your **Site Key** and **Secret Key**
5. Save these for later use

### Step 2: Setup Local Database (Optional - for full testing)

For local development, you have two options:

#### Option A: Use a Local PostgreSQL Database
1. Install PostgreSQL locally or use XAMPP's PostgreSQL (if available)
2. Create a database named `win_comments`
3. Run the SQL schema from `database/schema.sql`:
   ```sql
   -- Copy and paste the contents of database/schema.sql into your PostgreSQL client
   ```

#### Option B: Use Vercel Postgres (Recommended for testing)
- Use the same Vercel Postgres database you'll use in production
- This ensures consistency between local and production

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Cloudflare Turnstile
TURNSTILE_SITE_KEY=your_site_key_here
TURNSTILE_SECRET_KEY=your_secret_key_here

# Vercel Postgres (if using Vercel Postgres locally)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_connection_string
POSTGRES_URL_NON_POOLING=your_postgres_connection_string
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Test Locally with Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Run the development server:
   ```bash
   vercel dev
   ```

3. Open your browser to `http://localhost:3000`

**Note:** For pure static file testing with XAMPP, you can serve the HTML files directly, but the API endpoints will only work when deployed to Vercel or when using `vercel dev`.

---

## Part 2: Vercel Deployment

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (or create a new one)
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose a name (e.g., `win-comments-db`)
6. Select a region closest to your users
7. Click **Create**

### Step 2: Run Database Schema

1. In Vercel Dashboard, go to your Postgres database
2. Click on **.env.local** tab or use the **Query** tab
3. Copy the contents of `database/schema.sql`
4. Run the SQL in the database query interface
   - Or use a PostgreSQL client (like pgAdmin, DBeaver, or `psql`) with the connection string

**Alternative: Using psql command line:**
```bash
# Get connection string from Vercel Dashboard → Storage → Your Database → .env.local
psql "your_connection_string_here" -f database/schema.sql
```

### Step 3: Set Environment Variables in Vercel

1. In Vercel Dashboard, go to your project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   TURNSTILE_SITE_KEY = your_site_key_here
   TURNSTILE_SECRET_KEY = your_secret_key_here
   ```

4. Vercel Postgres connection strings are automatically added by Vercel when you create the database
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

### Step 4: Update Frontend with Turnstile Site Key

You need to make the Turnstile site key available to the frontend. Update `comments.js`:

**Option A: Hardcode for production (not recommended for public repos)**
```javascript
function getTurnstileSiteKey() {
    // Replace with your actual site key
    return 'your_site_key_here';
}
```

**Option B: Use a config file (recommended)**
Create `config.js`:
```javascript
window.TURNSTILE_SITE_KEY = 'your_site_key_here';
```

Then add to `index.html` before `comments.js`:
```html
<script src="config.js"></script>
<script src="comments.js"></script>
```

**Option C: Use Vercel Environment Variables (best for production)**
Create an API endpoint to serve the public key, or use Vercel's environment variable injection (requires build step).

For simplicity, we'll use Option B. Create `config.js`:

```javascript
// config.js - Add your Turnstile Site Key here
// This file should be added to .gitignore if it contains sensitive data
// For production, consider using environment variables
window.TURNSTILE_SITE_KEY = 'YOUR_TURNSTILE_SITE_KEY_HERE';
```

### Step 5: Deploy to Vercel

1. **Via Vercel CLI:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

2. **Via GitHub (Recommended):**
   - Push your code to GitHub
   - Import the repository in Vercel Dashboard
   - Vercel will automatically detect the project and deploy

3. **Via Vercel Dashboard:**
   - Click **Add New Project**
   - Import your Git repository
   - Configure build settings (none needed for static site)
   - Deploy

### Step 6: Verify Deployment

1. Visit your deployed site
2. Navigate to the comments section
3. Try posting a comment
4. Verify it appears immediately
5. Test pagination by posting more than 30 comments

---

## Part 3: Managing Comments (Deleting Unwanted Comments)

### Method 1: Via Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → Storage → Your Postgres Database
2. Click on **Data** or **Query** tab
3. Run SQL to view comments:
   ```sql
   SELECT * FROM comments ORDER BY created_at DESC;
   ```
4. Delete a comment:
   ```sql
   DELETE FROM comments WHERE id = <comment_id>;
   ```

### Method 2: Via PostgreSQL Client

1. Get connection string from Vercel Dashboard → Storage → Your Database → `.env.local`
2. Connect using any PostgreSQL client (pgAdmin, DBeaver, TablePlus, etc.)
3. Navigate to the `comments` table
4. View and delete rows as needed

### Method 3: Via Command Line (psql)

```bash
# Connect to database
psql "your_connection_string_here"

# View comments
SELECT id, page, name, comment, created_at FROM comments ORDER BY created_at DESC;

# Delete a specific comment
DELETE FROM comments WHERE id = 123;

# Delete all comments from a specific page
DELETE FROM comments WHERE page = '/about';

# Exit
\q
```

---

## Troubleshooting

### Comments not loading
- Check browser console for errors
- Verify API endpoint is accessible: `https://your-domain.vercel.app/api/comments`
- Check Vercel function logs in dashboard

### Turnstile verification failing
- Verify `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set correctly
- Ensure the site key matches the domain in Cloudflare Turnstile settings
- Check that Turnstile widget is loading (inspect browser console)

### Database connection errors
- Verify Postgres database is created in Vercel
- Check that environment variables are set correctly
- Ensure schema has been run (table exists)

### Comments not appearing after posting
- Check browser console for errors
- Verify API response in Network tab
- Check Vercel function logs for errors

---

## File Structure

```
win-website/
├── api/
│   └── comments/
│       └── index.js          # API endpoints (GET, POST)
├── database/
│   └── schema.sql            # Database schema
├── images/
├── index.html                # Homepage (with comments)
├── about.html                # About page
├── comments.js               # Frontend comment system
├── script.js                 # Existing site scripts
├── styles.css                # Styles (includes comment styles)
├── config.js                 # Turnstile site key (create this)
├── package.json              # Dependencies
├── vercel.json               # Vercel configuration
└── SETUP.md                  # This file
```

---

## Environment Variables Summary

### Required for Production (Vercel)
- `TURNSTILE_SITE_KEY` - Cloudflare Turnstile site key (public)
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key (private)
- `POSTGRES_URL` - Auto-added by Vercel when Postgres is created
- `POSTGRES_PRISMA_URL` - Auto-added by Vercel
- `POSTGRES_URL_NON_POOLING` - Auto-added by Vercel

### Required for Local Development
- Same as above, but stored in `.env.local`

---

## Security Notes

1. **Never commit `.env.local` or `config.js`** (if it contains keys) to version control
2. Add to `.gitignore`:
   ```
   .env.local
   config.js
   ```
3. The Turnstile site key is public and safe to expose in frontend code
4. The Turnstile secret key must remain server-side only
5. All user input is sanitized to prevent XSS attacks
6. Comments are limited to 1000 characters, names to 50 characters

---

## Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure database schema has been created
5. Verify Turnstile keys are correct and match your domain

---

## Definition of Done Checklist

- [ ] Database created in Vercel
- [ ] Schema run successfully
- [ ] Environment variables set
- [ ] Site deployed to Vercel
- [ ] Can post a comment and see it immediately
- [ ] Pagination works with 30+ comments
- [ ] Can delete comments from database
- [ ] Styling matches existing theme
- [ ] Turnstile verification working
- [ ] Works on both homepage and about page (if applicable)

