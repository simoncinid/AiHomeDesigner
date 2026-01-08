# Setup Instructions

## Quick Start

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
pip install -r requirements.txt
```

### 2. Environment Variables

**Backend** (`apps/api/.env`):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/aihomedesigner
WAVESPEED_API_KEY=your_key
IP_SALT=random_string_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...
JWT_SECRET=random_jwt_secret
CORS_ORIGINS=http://localhost:3000
```

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Database Setup

```bash
cd apps/api
alembic upgrade head
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

### 5. Test

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Stripe Webhook Testing

```bash
stripe listen --forward-to localhost:8000/v1/stripe/webhook
```

## Next Steps

1. Create Stripe products and update `apps/api/stripe_config.py` with price IDs
2. Test free generation (1 per day per IP)
3. Test checkout flow
4. Deploy following `DEPLOYMENT.md`
