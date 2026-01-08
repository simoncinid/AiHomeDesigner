# AI Home Designer

Production-ready freemium SaaS for AI-powered interior design transformations.

## Architecture

- **Frontend**: Next.js (React) on Vercel
- **Backend**: Python FastAPI on Render
- **Database**: DigitalOcean Managed Postgres
- **Payments**: Stripe
- **AI Provider**: WaveSpeedAI

## Monorepo Structure

```
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # FastAPI backend
└── packages/
    └── shared/       # Shared types and constants
```

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or use DigitalOcean managed)
- Stripe account
- WaveSpeedAI API key

### Setup

1. **Install dependencies**:
```bash
npm install
cd apps/web && npm install
cd ../api && pip install -r requirements.txt
```

2. **Environment variables**:

**Backend** (`apps/api/.env`):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/aihomedesigner
WAVESPEED_API_KEY=your_key
IP_SALT=your_random_salt
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...
JWT_SECRET=your_jwt_secret
```

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. **Database setup**:
```bash
cd apps/api
alembic upgrade head
```

4. **Run services**:
```bash
# Terminal 1: Backend
npm run dev:api

# Terminal 2: Frontend
npm run dev:web
```

### Stripe Webhook Testing

Use Stripe CLI to forward webhooks locally:
```bash
stripe listen --forward-to localhost:8000/v1/stripe/webhook
```

## Deployment

### Frontend (Vercel)

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Backend (Render)

1. Create new Web Service
2. Connect repository
3. Set build command: `cd apps/api && pip install -r requirements.txt`
4. Set start command: `cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables
6. Deploy

### Database (DigitalOcean)

1. Create managed PostgreSQL database
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npm run db:migrate`

## Stripe Products

The app uses credit packs. Configure these in Stripe Dashboard:

**Photo Packs**:
- 50 credits = $9.50
- 120 credits = $22.80
- 300 credits = $57.00

**Video Packs**:
- 5 credits = $14.95
- 12 credits = $35.88
- 30 credits = $89.70

Map `packId` to Stripe `priceId` in `apps/api/stripe_config.py`.

## Features

- **Photo to Room Design**: Upload room photo, get 4 design variations
- **Room Generator**: Text-to-image room design
- **Photo to Video**: Transform images into short videos
- **Freemium**: 1 free image per day per IP
- **Credit System**: Purchase credits via Stripe
- **SEO Optimized**: Programmatic pages for rooms, styles, and design ideas

## License

Proprietary
