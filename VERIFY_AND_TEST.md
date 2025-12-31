# Verify Table and Test API

## Step 1: Verify Table Was Created

Run this to see if the table exists and check its structure:

```bash
printf "SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'comments' ORDER BY ordinal_position;\n" | npx prisma db execute --stdin
```

This will show you all columns in the comments table if it exists.

## Step 2: Test Inserting a Comment

Try inserting a test comment to verify everything works:

```bash
printf "INSERT INTO comments (page, name, comment) VALUES ('/', 'Test User', 'This is a test comment') RETURNING id, page, name, comment, created_at;\n" | npx prisma db execute --stdin
```

If this works, you should see the inserted comment data.

## Step 3: Check Existing Comments

See if there are any comments in the table:

```bash
printf "SELECT id, page, name, comment, created_at FROM comments ORDER BY created_at DESC LIMIT 5;\n" | npx prisma db execute --stdin
```

## Step 4: Commit and Push API Changes

The API code has been fixed to use `createClient()`. You need to commit and push:

```bash
git add api/comments/index.js
git commit -m "Fix: Use createClient() for pooled Postgres connection"
git push
```

## Step 5: Test the API

After Vercel redeploys (automatic after push):

1. Visit: `https://project-win-ar.vercel.app/api/comments?page=/`
2. You should see JSON like:
   ```json
   {
     "comments": [...],
     "pagination": {
       "currentPage": 1,
       "totalPages": 1,
       "totalComments": 1,
       ...
     }
   }
   ```

3. Try posting a comment on your website
4. It should work now!

## If Table Doesn't Exist

If the verification shows the table doesn't exist, try creating it again with explicit schema:

```bash
printf "CREATE TABLE public.comments (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);\n" | npx prisma db execute --stdin
```

Then create indexes:

```bash
printf "CREATE INDEX idx_comments_page ON public.comments(page);\n" | npx prisma db execute --stdin
```

```bash
printf "CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);\n" | npx prisma db execute --stdin
```

