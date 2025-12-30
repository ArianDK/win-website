# W.I.N - Wealth Insured Navigation

A static website providing financial literacy resources and student support materials.

## Features

- **Free Resources**: Downloadable PDFs for financial literacy and student resources
- **Custom Comment System**: First-party commenting system with pagination and moderation
- **Modern UI**: Clean, responsive design with smooth animations

## Comment System

This website uses a custom-built commenting system that replaces the previous Giscus integration. The system includes:

- ✅ No account required to comment
- ✅ Immediate comment display (no moderation queue)
- ✅ Pagination (30 comments per page)
- ✅ Cloudflare Turnstile human verification
- ✅ Modern, theme-matched UI
- ✅ Easy database management for moderation

## Setup

For detailed setup instructions, see [SETUP.md](./SETUP.md).

### Quick Start

1. **Get Cloudflare Turnstile Keys**
   - Visit [Cloudflare Dashboard](https://dash.cloudflare.com/) → Turnstile
   - Create a site and copy your Site Key and Secret Key

2. **Update Configuration**
   - Edit `config.js` and add your Turnstile Site Key
   - Set environment variables in Vercel (see SETUP.md)

3. **Setup Database**
   - Create Vercel Postgres database in Vercel Dashboard
   - Run the SQL schema from `database/schema.sql`

4. **Deploy**
   - Push to GitHub and import to Vercel, or use `vercel` CLI

## Project Structure

```
win-website/
├── api/
│   └── comments/
│       └── index.js          # API endpoints
├── database/
│   └── schema.sql            # Database schema
├── images/                    # Site images
├── index.html                # Homepage
├── about.html                # About page
├── comments.js                # Comment system frontend
├── script.js                  # Site scripts
├── styles.css                 # Styles
├── config.js                  # Turnstile configuration
├── package.json               # Dependencies
└── SETUP.md                   # Detailed setup guide
```

## Technology Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres (PostgreSQL)
- **Security**: Cloudflare Turnstile
- **Hosting**: Vercel

## License

© 2025 W.I.N. All rights reserved.
