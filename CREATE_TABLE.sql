-- Run this SQL to create the comments table
-- Use this command in your terminal:

-- Option 1: Using Prisma (recommended since you're using Prisma)
printf "CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);\n" | npx prisma db execute --stdin

-- Option 2: If you have psql installed
-- psql "$POSTGRES_URL" -c "CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, page VARCHAR(255) NOT NULL, name VARCHAR(50), comment TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()); CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page); CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);"

