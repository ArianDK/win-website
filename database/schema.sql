-- Comments Table Schema for Vercel Postgres
-- Run this SQL in your Vercel Postgres database to create the comments table

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on page for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_page ON comments(page);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Optional: Add a comment for documentation
COMMENT ON TABLE comments IS 'Stores user comments for different pages of the website';
COMMENT ON COLUMN comments.page IS 'Page identifier (e.g., "/" for homepage, "/about" for about page)';
COMMENT ON COLUMN comments.name IS 'Optional display name (max 50 characters)';
COMMENT ON COLUMN comments.comment IS 'Comment text content (max 1000 characters)';
COMMENT ON COLUMN comments.created_at IS 'Timestamp when the comment was created';

