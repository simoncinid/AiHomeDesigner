# Configurazione Produzione

## URL di Produzione

- **Backend API**: https://ai-homedesigner-api.onrender.com
- **Frontend**: https://ai-home-designer-api.vercel.app

## Variabili d'Ambiente Frontend (Vercel)

Configurare in Vercel Dashboard -> Settings -> Environment Variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://ai-homedesigner-api.onrender.com
NEXT_PUBLIC_SITE_URL=https://ai-home-designer-api.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Variabili d'Ambiente Backend (Render)

Configurare in Render Dashboard -> Environment:

```env
DATABASE_URL=postgresql://...
WAVESPEED_API_KEY=your_wavespeed_api_key
IP_SALT=your_random_salt_string_here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=https://ai-home-designer-api.vercel.app
RESEND_API_KEY=re_...
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=https://ai-home-designer-api.vercel.app,https://*.vercel.app
```

## Webhook Stripe

Configurare il webhook in Stripe Dashboard:
- URL: `https://ai-homedesigner-api.onrender.com/v1/stripe/webhook`
- Eventi: `checkout.session.completed`

## Verifica Deployment

1. Testare health endpoint: https://ai-homedesigner-api.onrender.com/v1/health
2. Testare frontend: https://ai-home-designer-api.vercel.app
3. Verificare che le chiamate API funzionino dal frontend
4. Testare checkout Stripe
