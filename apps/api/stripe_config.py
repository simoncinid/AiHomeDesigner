"""
Stripe product and pricing configuration.

Update price IDs with actual Stripe price IDs from your Stripe Dashboard.
"""

STRIPE_PACKS = {
    'photo_50': {
        'credits': 50,
        'price_id': 'price_photo_50',  # Update with actual Stripe price ID
        'amount': 950,  # $9.50 in cents
    },
    'photo_120': {
        'credits': 120,
        'price_id': 'price_photo_120',  # Update with actual Stripe price ID
        'amount': 2280,  # $22.80 in cents
    },
    'photo_300': {
        'credits': 300,
        'price_id': 'price_photo_300',  # Update with actual Stripe price ID
        'amount': 5700,  # $57.00 in cents
    },
    'video_5': {
        'credits': 5,
        'price_id': 'price_video_5',  # Update with actual Stripe price ID
        'amount': 1495,  # $14.95 in cents
    },
    'video_12': {
        'credits': 12,
        'price_id': 'price_video_12',  # Update with actual Stripe price ID
        'amount': 3588,  # $35.88 in cents
    },
    'video_30': {
        'credits': 30,
        'price_id': 'price_video_30',  # Update with actual Stripe price ID
        'amount': 8970,  # $89.70 in cents
    },
}

def get_pack(pack_id: str):
    """Get pack configuration by ID."""
    return STRIPE_PACKS.get(pack_id)
