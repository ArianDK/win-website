// API Route: GET /api/comments and POST /api/comments
// Returns paginated comments for a specific page

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Only allow GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
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
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM comments
        WHERE page = ${pagePath}
      `;
      const total = parseInt(countResult.rows[0]?.total || '0', 10);
      const totalPages = Math.ceil(total / limit);

      // Get comments for current page (newest first)
      const commentsResult = await sql`
        SELECT id, page, name, comment, created_at
        FROM comments
        WHERE page = ${pagePath}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

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
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { page, name, comment, turnstileToken } = req.body;

      // Validate required fields
      if (!comment || !comment.trim()) {
        return res.status(400).json({ error: 'Comment is required' });
      }

      if (!page) {
        return res.status(400).json({ error: 'Page identifier is required' });
      }

      // Validate lengths
      const trimmedComment = comment.trim();
      if (trimmedComment.length > 1000) {
        return res.status(400).json({ error: 'Comment exceeds maximum length of 1000 characters' });
      }

      const trimmedName = name ? name.trim() : '';
      if (trimmedName.length > 50) {
        return res.status(400).json({ error: 'Name exceeds maximum length of 50 characters' });
      }

      // Verify Turnstile token
      if (!turnstileToken) {
        return res.status(400).json({ error: 'Human verification required' });
      }

      const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
      if (!turnstileSecret) {
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
        return res.status(400).json({ error: 'Human verification failed. Please try again.' });
      }

      // Insert comment into database
      const result = await sql`
        INSERT INTO comments (page, name, comment, created_at)
        VALUES (${page}, ${trimmedName || null}, ${trimmedComment}, NOW())
        RETURNING id, page, name, comment, created_at
      `;

      return res.status(201).json({
        success: true,
        comment: result.rows[0]
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      return res.status(500).json({ error: 'Failed to post comment' });
    }
  }
}

