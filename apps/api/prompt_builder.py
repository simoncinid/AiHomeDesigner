"""
Prompt engineering for interior design.
"""

MAX_PROMPT_LENGTH = 3000

def truncate_prompt(prompt: str, max_length: int = MAX_PROMPT_LENGTH) -> str:
    """Truncate prompt to max length, cutting at word boundary if possible."""
    if len(prompt) <= max_length:
        return prompt
    
    truncated = prompt[:max_length]
    # Try to cut at last space to avoid cutting words
    last_space = truncated.rfind(' ')
    if last_space > max_length * 0.8:  # Only if we don't lose too much
        truncated = truncated[:last_space]
    
    return truncated.rstrip('.,;: ')

def build_t2i_prompt(room_type: str, style: str, user_prompt: str = None, lighting: str = None) -> str:
    """Build text-to-image prompt."""
    base = f'Interior {room_type}, {style} style.'
    
    # Add user prompt if provided
    if user_prompt:
        base += f' {user_prompt}'
    
    # Add lighting if specified
    if lighting:
        base += f' Lighting: {lighting}.'
    
    # Add quality/style instructions: if user specified a different style (illustration, sketch, painting, etc.), follow that. Otherwise, use hyperrealistic professional photography.
    base += ' STYLE INSTRUCTION: If a different artistic style (illustration, sketch, drawing, painting, cartoon, anime, watercolor, digital art, concept art, stylized, abstract) is explicitly specified in the user prompt above, follow that style. Otherwise, generate as hyperrealistic, ultra-detailed, super high-resolution professional interior photography, 8K quality, extreme detail, photorealistic rendering, professional architectural photography, magazine-quality shot. Use super realistic lighting: balanced natural daylight with warm ambient lights, realistic soft shadows, natural light diffusion, professional lighting setup. High-end materials, exceptional detail and clarity, perfect textures, sharp focus throughout. Wide-angle 24mm lens, eye-level perspective, natural room proportions. Elegant minimal clutter, designer furniture. No text, no watermark, no people.'
    
    return truncate_prompt(base)

def build_edit_prompt(style: str, wall_color: str = None, floor_material: str = None, edit_intent: str = None, user_prompt: str = None) -> str:
    """Build image edit prompt for redesigning a room while preserving its structure."""
    
    # Detailed instruction for exact preservation of perspective and dimensions
    prompt = f'''ABSOLUTE CRITICAL REQUIREMENT - IMAGE OVERLAY COMPATIBILITY: The output image MUST be perfectly overlayable with the original input image. This means PIXEL-PERFECT preservation of:

1. EXACT CAMERA PARAMETERS: Maintain identical focal length, field of view, lens distortion, depth of field, and camera position. The virtual camera must remain in the EXACT same position as the original photo.

2. EXACT PERSPECTIVE AND GEOMETRY: Preserve all vanishing points, perspective lines, angles of walls/ceiling/floor. Every architectural line must align EXACTLY with the original. No perspective shift, no rotation, no tilt, no zoom.

3. EXACT DIMENSIONS AND PROPORTIONS: The room must have the IDENTICAL dimensions. Wall heights, room width, ceiling position, floor area - all must match the original EXACTLY. No stretching, no compression, no cropping, no aspect ratio change.

4. EXACT SPATIAL LAYOUT: All walls, ceiling, floor boundaries, doors, windows, architectural elements must be in the EXACT same pixel positions. The silhouette of the room structure must be IDENTICAL.

5. EXACT LIGHTING DIRECTION AND SHADOWS: Preserve the direction of natural light sources (windows, skylights). Shadow directions must remain consistent. Only modify the COLOR and INTENSITY of lights, not their positions or directions.

WHAT TO MODIFY - ONLY THESE ELEMENTS:
- Furniture: Replace with {style} style furniture in the SAME approximate positions
- Decor and decorative objects: Update to match {style} aesthetic
- Soft furnishings (curtains, rugs, cushions): Change colors, patterns, textures
- Wall colors and finishes: May adjust tones to complement {style}
- Material appearances (wood tones, fabric textures): Update to {style} materials
- Lighting color temperature and intensity: Adjust to enhance {style} atmosphere

WHAT MUST NEVER CHANGE:
- Room architecture, walls, ceiling, floor plan
- Window and door positions, sizes, and shapes
- Camera angle, height, tilt, and position
- Perspective and vanishing points
- Overall image composition and framing
- Background visible through windows (keep same view)
- Room scale and proportions'''
    
    if wall_color:
        prompt += f'\n\nWall color specification: Apply {wall_color} to the walls while maintaining all architectural details and shadows.'
    
    if floor_material:
        prompt += f'\n\nFloor material specification: Change floor appearance to {floor_material} while preserving exact floor boundaries and perspective.'
    
    if edit_intent:
        prompt += f'\n\nSpecific modification requested: {edit_intent}. Apply this change while strictly maintaining all perspective and dimensional requirements above.'
    
    if user_prompt:
        prompt += f'\n\nAdditional user instructions: {user_prompt}. Implement these changes while ensuring the image remains perfectly overlayable with the original.'
    
    # Quality instructions
    prompt += '''

OUTPUT QUALITY REQUIREMENTS:
- Hyperrealistic rendering with extreme attention to detail
- 8K resolution quality with sharp focus throughout
- Professional interior photography aesthetic
- PBR-accurate material rendering (realistic wood grain, fabric textures, metal reflections)
- Natural lighting with soft shadows and realistic light diffusion
- Magazine-quality final image suitable for professional presentation
- No text, watermarks, logos, or artificial elements
- No people or animals unless specifically requested'''
    
    return truncate_prompt(prompt)

def build_quick_edit_prompt(edit_intent: str) -> str:
    """Build quick edit prompt for targeted modifications while preserving all spatial characteristics."""
    
    prompt = f'''CRITICAL PRESERVATION REQUIREMENTS - IMAGE MUST BE PERFECTLY OVERLAYABLE WITH ORIGINAL:

The modified image must align EXACTLY with the original when overlaid. This requires PIXEL-PERFECT preservation of:

1. CAMERA AND PERSPECTIVE: Identical camera position, focal length, field of view, perspective lines, vanishing points. No zoom, pan, tilt, or any camera movement whatsoever.

2. ROOM GEOMETRY AND DIMENSIONS: Exact same wall positions, ceiling height, floor boundaries, room proportions. Every architectural element must be in the IDENTICAL pixel position.

3. SPATIAL LAYOUT: All doors, windows, architectural features must remain in EXACT same locations. The room silhouette must be unchanged.

4. COMPOSITION AND FRAMING: Identical image boundaries, aspect ratio, and overall composition. No cropping, no reframing.

TARGETED MODIFICATION REQUEST: {edit_intent}

Apply ONLY this specific change. Everything else must remain EXACTLY as in the original image:
- Same furniture positions (unless furniture is being modified)
- Same decorative objects (unless decor is being modified)
- Same lighting direction and shadows (only intensity/color may change if lighting is being modified)
- Same background and window views
- Same floor and wall positions

OUTPUT QUALITY:
- Hyperrealistic, ultra-detailed rendering
- 8K quality with extreme detail and sharp focus
- Professional photography aesthetic
- Natural, realistic lighting with soft shadows
- PBR-accurate materials and textures
- No text, watermarks, or artificial elements'''
    
    return truncate_prompt(prompt)

def build_video_prompt(motion_preset: str) -> str:
    """Build video prompt from motion preset."""
    motion_map = {
        'dolly-in': 'slow cinematic dolly-in, subtle parallax, stable camera',
        'parallax': 'subtle parallax movement, stable camera',
        'orbit': 'slow orbit around the scene, gentle parallax',
        'pan': 'slow horizontal pan, cinematic reveal',
        'reveal': 'cinematic reveal, slow motion, stable',
    }
    
    motion_text = motion_map.get(motion_preset, 'slow cinematic movement')
    prompt = f'{motion_text}. Hyperrealistic, ultra-detailed interior, stable, no flicker, subtle natural motion, smooth camera movement, professional quality, 8K resolution, extreme detail, photorealistic rendering.'
    
    return truncate_prompt(prompt)
