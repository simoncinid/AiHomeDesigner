# Deployment Guide

## Prerequisites

- DigitalOcean account (for managed PostgreSQL)
- Vercel account (for frontend)
- Render account (for backend)
- Stripe account
- WaveSpeedAI API key

## Step 1: Database Setup (DigitalOcean)

1. Create a new managed PostgreSQL database
2. Note the connection string
3. Run migrations:
   ```bash
   cd apps/api
   export DATABASE_URL="your_connection_string"
   alembic upgrade head
   ```

## Step 2: Stripe Setup

1. Create products and prices in Stripe Dashboard:
   - Photo packs: 50, 120, 300 credits
   - Video packs: 5, 12, 30 credits
2. Copy price IDs
3. Update `apps/api/stripe_config.py` with actual price IDs
4. Set up webhook endpoint:
   - URL: `https://your-api.render.com/v1/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copy webhook secret

## Step 3: Backend Deployment (Render)

1. Connect your GitHub repository
2. Create new Web Service
3. Settings:
   - Root Directory: `apps/api`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL`: Your DigitalOcean PostgreSQL connection string
   - `WAVESPEED_API_KEY`: Your WaveSpeedAI API key
   - `IP_SALT`: Random string for IP hashing
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `SITE_URL`: `https://ai-homedesigner.com`
   - `RESEND_API_KEY`: Your Resend API key (for magic links)
   - `JWT_SECRET`: Random string for JWT signing
   - `CORS_ORIGINS`: `https://ai-homedesigner.com,https://*.vercel.app`
5. Deploy

## Step 4: Frontend Deployment (Vercel)

1. Import your GitHub repository
2. Root Directory: `apps/web`
3. Framework Preset: Next.js
4. Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your Render API URL (e.g., `https://ai-homedesigner-api.onrender.com`)
   - `NEXT_PUBLIC_SITE_URL`: `https://ai-homedesigner.com`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
5. Deploy

## Step 5: Domain Configuration

1. In Vercel: Add custom domain `ai-homedesigner.com`
2. Update DNS records as instructed by Vercel
3. Update `SITE_URL` in backend to match

## Step 6: Post-Deployment

1. Verify database migrations ran successfully
2. Test API health endpoint
3. Test Stripe webhook (use Stripe CLI for local testing)
4. Verify CORS is working
5. Test a free generation
6. Test checkout flow

## Monitoring

- Render: Check logs in Render dashboard
- Vercel: Check logs in Vercel dashboard
- Database: Monitor in DigitalOcean dashboard
- Stripe: Monitor webhooks in Stripe dashboard
