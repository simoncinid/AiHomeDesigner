// Room types
export const ROOM_TYPES = [
  { value: 'living_room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'dining_room', label: 'Dining Room' },
  { value: 'office', label: 'Home Office' },
  { value: 'kids_room', label: "Kid's Room" },
  { value: 'outdoor', label: 'Outdoor/Patio' },
] as const

// Style presets
export const STYLE_PRESETS = [
  { 
    value: 'modern', 
    label: 'Modern', 
    description: 'Clean lines and contemporary aesthetics',
    color: '#3b82f6',
  },
  { 
    value: 'scandinavian', 
    label: 'Scandinavian', 
    description: 'Minimalist Nordic design',
    color: '#f5f5f4',
  },
  { 
    value: 'minimalist', 
    label: 'Minimalist', 
    description: 'Less is more',
    color: '#fafafa',
  },
  { 
    value: 'industrial', 
    label: 'Industrial', 
    description: 'Raw materials and urban feel',
    color: '#6b7280',
  },
  { 
    value: 'bohemian', 
    label: 'Bohemian', 
    description: 'Eclectic and colorful',
    color: '#f59e0b',
  },
  { 
    value: 'luxury', 
    label: 'Luxury', 
    description: 'Opulent and sophisticated',
    color: '#a855f7',
  },
  { 
    value: 'coastal', 
    label: 'Coastal', 
    description: 'Beach-inspired relaxation',
    color: '#06b6d4',
  },
  { 
    value: 'traditional', 
    label: 'Traditional', 
    description: 'Classic and timeless',
    color: '#92400e',
  },
  { 
    value: 'mid_century', 
    label: 'Mid-Century', 
    description: 'Retro 50s-60s charm',
    color: '#ea580c',
  },
  { 
    value: 'japanese', 
    label: 'Japanese', 
    description: 'Zen and harmony',
    color: '#84cc16',
  },
] as const

// Motion presets for video
export const MOTION_PRESETS = [
  { 
    value: 'orbit', 
    label: 'Orbit', 
    description: 'Smooth circular camera movement around the room',
  },
  { 
    value: 'push_in', 
    label: 'Push In', 
    description: 'Dramatic zoom into the focal point',
  },
  { 
    value: 'pan', 
    label: 'Pan', 
    description: 'Horizontal sweep across the scene',
  },
  { 
    value: 'tilt', 
    label: 'Tilt', 
    description: 'Vertical reveal from floor to ceiling',
  },
  { 
    value: 'dolly', 
    label: 'Dolly', 
    description: 'Forward movement through the space',
  },
] as const

// Budget levels
export const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget-Friendly', description: 'Affordable options' },
  { value: 'mid', label: 'Mid-Range', description: 'Quality and value' },
  { value: 'luxury', label: 'Luxury', description: 'Premium materials' },
] as const

// FAQ items
export const FAQ_ITEMS = [
  {
    question: 'How does AI Home Designer work?',
    answer: 'Simply upload a photo of your room or describe your dream space. Our AI analyzes your input and generates realistic, professional-quality redesigns in seconds. You can choose from various styles and customize the output to match your vision.',
  },
  {
    question: 'What types of rooms can I design?',
    answer: 'You can design any room type including living rooms, bedrooms, kitchens, bathrooms, dining rooms, home offices, kids rooms, and outdoor spaces. Our AI is trained on millions of interior design images to handle any space.',
  },
  {
    question: 'How many credits do I need?',
    answer: 'Photo generations use 1 photo credit each. Video animations use 1 video credit. You get 1 free photo generation per day. After that, you can purchase credit packs starting at just $9.99.',
  },
  {
    question: 'Can I use the designs for commercial purposes?',
    answer: 'Yes! All generated designs are yours to use. Interior designers, real estate agents, and architects commonly use our tool to visualize spaces for clients.',
  },
  {
    question: 'How long does generation take?',
    answer: 'Photo generations typically complete in 10-30 seconds. Video animations take 1-2 minutes depending on complexity. You can continue browsing while your generation processes.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support JPEG, PNG, and WebP formats. Images should be at least 512x512 pixels for best results. Maximum file size is 10MB.',
  },
]

// Example prompts for photo makeover
export const EXAMPLE_PROMPTS = [
  'Add plants and natural lighting',
  'Make it feel more spacious',
  'Add a cozy reading nook',
  'Create a home theater setup',
  'Add built-in shelving',
  'Make it kid-friendly',
]
