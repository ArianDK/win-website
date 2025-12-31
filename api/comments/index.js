// API Route: GET /api/comments and POST /api/comments
// Returns paginated comments for a specific page

import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
  // Create client with pooled connection (uses POSTGRES_URL automatically)
  const client = createClient();
  
  try {
    await client.connect();
    
    // Set CORS headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      await client.end();
      return res.status(200).end();
    }

    // Only allow GET and POST methods
    if (req.method !== 'GET' && req.method !== 'POST') {
      await client.end();
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Handle GET request
    if (req.method === 'GET') {
      try {
        const { page: pagePath = '/', pageNumber = '1' } = req.query;
        const pageNum = parseInt(pageNumber, 10) || 1;
        const limit = 30;
        const offset = (pageNum - 1) * limit;

        // Get total count for pagination
        const countResult = await client.query(
          'SELECT COUNT(*)::int as total FROM comments WHERE page = $1',
          [pagePath]
        );
        const total = parseInt(countResult.rows[0]?.total || '0', 10);
        const totalPages = Math.ceil(total / limit);

        // Get comments for current page (newest first)
        const commentsResult = await client.query(
          'SELECT id, page, name, comment, created_at FROM comments WHERE page = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
          [pagePath, limit, offset]
        );

        await client.end();
        
        return res.status(200).json({
          comments: commentsResult.rows,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalComments: total,
            hasNext: pageNum < totalPages,
            hasPrevious: pageNum > 1
          }
        });
      } catch (error) {
        await client.end();
        console.error('Error fetching comments:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch comments',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }

    // Handle POST request
    if (req.method === 'POST') {
      try {
        const { page, name, comment, turnstileToken } = req.body;

        // Validate required fields
        if (!comment || !comment.trim()) {
          await client.end();
          return res.status(400).json({ error: 'Comment is required' });
        }

        if (!page) {
          await client.end();
          return res.status(400).json({ error: 'Page identifier is required' });
        }

        // Validate lengths
        const trimmedComment = comment.trim();
        if (trimmedComment.length > 1000) {
          await client.end();
          return res.status(400).json({ error: 'Comment exceeds maximum length of 1000 characters' });
        }

        const trimmedName = name ? name.trim() : '';
        if (trimmedName.length > 50) {
          await client.end();
          return res.status(400).json({ error: 'Name exceeds maximum length of 50 characters' });
        }

        // Verify Turnstile token
        if (!turnstileToken) {
          await client.end();
          return res.status(400).json({ error: 'Human verification required' });
        }

        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
        if (!turnstileSecret) {
          await client.end();
          console.error('TURNSTILE_SECRET_KEY not configured');
          return res.status(500).json({ error: 'Server configuration error' });
        }

        // Verify with Cloudflare Turnstile
        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        });

        const turnstileData = await turnstileResponse.json();
        if (!turnstileData.success) {
          await client.end();
          return res.status(400).json({ error: 'Human verification failed. Please try again.' });
        }

        // Insert comment into database
        const result = await client.query(
          'INSERT INTO comments (page, name, comment, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, page, name, comment, created_at',
          [page, trimmedName || null, trimmedComment]
        );

        await client.end();
        
        return res.status(201).json({
          success: true,
          comment: result.rows[0]
        });
      } catch (error) {
        await client.end();
        console.error('Error posting comment:', error);
        return res.status(500).json({ 
          error: 'Failed to post comment',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  } catch (error) {
    // Catch any unhandled errors
    try {
      await client.end();
    } catch (e) {
      // Ignore errors when closing
    }
    console.error('Unhandled API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
}
