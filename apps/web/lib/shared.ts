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
