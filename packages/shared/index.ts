// Room types
export const ROOM_TYPES = [
  'living room',
  'bedroom',
  'kitchen',
  'bathroom',
  'home office',
  'dining room',
  'kids room',
  'studio',
  'patio',
] as const;

export type RoomType = typeof ROOM_TYPES[number];

// Style presets
export const STYLE_PRESETS = [
  'Modern',
  'Scandinavian',
  'Japandi',
  'Minimal',
  'Industrial',
  'Mid-century',
  'Boho',
  'Coastal',
  'Farmhouse',
  'Luxury',
  'Rustic',
] as const;

export type StylePreset = typeof STYLE_PRESETS[number];

// Image sizes
export const IMAGE_SIZES = [
  { value: '2048*2048', label: 'Square (2048x2048)' },
  { value: '1344*768', label: 'Landscape (1344x768)' },
  { value: '1920*1088', label: 'Wide (1920x1088)' },
] as const;

export type ImageSize = typeof IMAGE_SIZES[number]['value'];

// Video motion presets
export const MOTION_PRESETS = [
  { value: 'dolly-in', label: 'Slow Dolly-In', prompt: 'slow cinematic dolly-in, subtle parallax, stable camera' },
  { value: 'parallax', label: 'Subtle Parallax', prompt: 'subtle parallax movement, stable camera' },
  { value: 'orbit', label: 'Orbit', prompt: 'slow orbit around the scene, gentle parallax' },
  { value: 'pan', label: 'Gentle Pan', prompt: 'slow horizontal pan, cinematic reveal' },
  { value: 'reveal', label: 'Cinematic Reveal', prompt: 'cinematic reveal, slow motion, stable' },
] as const;

export type MotionPreset = typeof MOTION_PRESETS[number]['value'];

// Video resolutions
export const VIDEO_RESOLUTIONS = ['720p', '1080p'] as const;
export type VideoResolution = typeof VIDEO_RESOLUTIONS[number];

// Quick edit intents
export const QUICK_EDITS = [
  'Change wall color',
  'Change floor material',
  'Swap sofa style',
  'Add plants',
  'Brighter lighting',
  'Remove clutter',
  'Add rug',
] as const;

export type QuickEdit = typeof QUICK_EDITS[number];

// Job kinds
export const JOB_KINDS = ['t2i', 'edit', 'i2v'] as const;
export type JobKind = typeof JOB_KINDS[number];

// Job statuses
export const JOB_STATUSES = ['created', 'processing', 'completed', 'failed'] as const;
export type JobStatus = typeof JOB_STATUSES[number];

// Credit transaction kinds
export const CREDIT_TRANSACTION_KINDS = ['grant', 'spend', 'refund'] as const;
export type CreditTransactionKind = typeof CREDIT_TRANSACTION_KINDS[number];

// Stripe pack IDs (map to price IDs in Stripe Dashboard)
export const STRIPE_PACKS = {
  photo: {
    '50': { credits: 50, priceId: 'price_photo_50' }, // Update with actual Stripe price IDs
    '120': { credits: 120, priceId: 'price_photo_120' },
    '300': { credits: 300, priceId: 'price_photo_300' },
  },
  video: {
    '5': { credits: 5, priceId: 'price_video_5' },
    '12': { credits: 12, priceId: 'price_video_12' },
    '30': { credits: 30, priceId: 'price_video_30' },
  },
} as const;

export type StripePackId = 
  | 'photo_50' | 'photo_120' | 'photo_300'
  | 'video_5' | 'video_12' | 'video_30';

// Prompt templates
export function buildT2IPrompt(
  roomType: RoomType,
  style: StylePreset,
  userPrompt?: string,
  lighting?: string,
): string {
  const base = `Photorealistic interior, ${roomType}, ${style} style. Balanced natural daylight + warm ambient lights, realistic shadows, clean materials, high detail. Wide-angle 24mm, eye-level, natural perspective. Minimal clutter. No text, no watermark.`;
  
  if (userPrompt) {
    return `${base} ${userPrompt}`;
  }
  
  if (lighting) {
    return `${base} Lighting: ${lighting}.`;
  }
  
  return base;
}

export function buildEditPrompt(
  style: StylePreset,
  wallColor?: string,
  floorMaterial?: string,
  editIntent?: QuickEdit,
): string {
  let prompt = `Interior redesign of the same room. Keep room layout, architecture, camera angle, and perspective unchanged. Replace finishes and furniture to match ${style} style.`;
  
  if (wallColor) {
    prompt += ` Update wall paint to ${wallColor}.`;
  }
  
  if (floorMaterial) {
    prompt += ` Floor to ${floorMaterial}.`;
  }
  
  if (editIntent) {
    prompt += ` ${editIntent}.`;
  }
  
  prompt += ` Keep lighting direction consistent, realistic PBR textures, photorealistic. No text, no watermark.`;
  
  return prompt;
}

export function buildQuickEditPrompt(editIntent: QuickEdit): string {
  return `Keep everything identical. Only change ${editIntent}. Preserve composition, camera, and lighting.`;
}

export function buildVideoPrompt(motionPreset: MotionPreset): string {
  const preset = MOTION_PRESETS.find(p => p.value === motionPreset);
  const motionText = preset?.prompt || 'slow cinematic movement';
  return `${motionText}. Photorealistic, stable, no flicker, subtle motion, smooth.`;
}

// SEO keyword map for programmatic pages
export const SEO_KEYWORDS = {
  rooms: ROOM_TYPES,
  styles: STYLE_PRESETS,
  intents: [
    'design ideas',
    'AI makeover',
    'redesign ideas',
    'interior design prompts',
    'before after makeover',
  ] as const,
} as const;
