"""
Prompt engineering for interior design.
"""

MAX_PROMPT_LENGTH = 500

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
    # Check if user wants a non-photorealistic style
    user_wants_artistic = user_prompt and any(keyword in user_prompt.lower() for keyword in [
        'illustration', 'sketch', 'drawing', 'painting', 'artistic', 'cartoon', 'anime', 
        'watercolor', 'oil painting', 'digital art', 'concept art', 'stylized', 'abstract'
    ])
    
    if user_wants_artistic:
        # If user explicitly wants artistic style, use their style
        base = f'Interior {room_type}, {style} style. {user_prompt}'
        if lighting:
            base += f' Lighting: {lighting}.'
        return truncate_prompt(base)
    
    # Default: hyperrealistic professional photography
    base = f'Hyperrealistic, ultra-detailed, super high-resolution professional interior photography, {room_type}, {style} style. 8K quality, extreme detail, photorealistic rendering, professional architectural photography, magazine-quality shot. Balanced natural daylight with warm ambient lights, realistic soft shadows, high-end materials, exceptional detail and clarity, perfect textures, sharp focus throughout. Wide-angle 24mm lens, eye-level perspective, natural room proportions. Elegant minimal clutter, designer furniture. No text, no watermark, no people.'
    
    if user_prompt:
        prompt = f'{base} {user_prompt}'
    elif lighting:
        prompt = f'{base} Lighting: {lighting}.'
    else:
        prompt = base
    
    return truncate_prompt(prompt)

def build_edit_prompt(style: str, wall_color: str = None, floor_material: str = None, edit_intent: str = None, user_prompt: str = None) -> str:
    """Build image edit prompt for redesigning a room while preserving its structure."""
    # Check if user wants a non-photorealistic style
    user_wants_artistic = user_prompt and any(keyword in user_prompt.lower() for keyword in [
        'illustration', 'sketch', 'drawing', 'painting', 'artistic', 'cartoon', 'anime', 
        'watercolor', 'oil painting', 'digital art', 'concept art', 'stylized', 'abstract'
    ])
    
    # Core instruction: preserve everything structural
    prompt = f'''CRITICAL: Preserve EXACTLY the original image structure. Keep IDENTICAL: room layout, walls, ceiling, floor plan, doors, windows, architectural elements, camera angle, perspective, field of view, lighting direction, shadows, background outside windows, room dimensions and proportions.

ONLY modify: furniture, decor, soft furnishings, colors, materials, and decorative objects to match {style} style.'''
    
    if wall_color:
        prompt += f' Wall color: {wall_color}.'
    
    if floor_material:
        prompt += f' Floor material: {floor_material}.'
    
    if edit_intent:
        prompt += f' Specific change: {edit_intent}.'
    
    if user_prompt:
        prompt += f' Additional: {user_prompt}.'
    
    if user_wants_artistic:
        prompt += ' Output: follow the artistic style specified in the prompt. No text, no watermark.'
    else:
        prompt += ' Output: hyperrealistic, ultra-detailed, super high-resolution, 8K quality, extreme detail, photorealistic rendering, professional photography quality, PBR textures, consistent lighting, magazine-quality shot. No text, no watermark.'
    
    return truncate_prompt(prompt)

def build_quick_edit_prompt(edit_intent: str) -> str:
    """Build quick edit prompt."""
    prompt = f'''CRITICAL: Keep EVERYTHING identical - room structure, walls, windows, doors, camera angle, perspective, proportions, lighting, background. 

ONLY change: {edit_intent}. 

Preserve exact composition, architectural elements, and all other objects. Output: hyperrealistic, ultra-detailed, super high-resolution, 8K quality, extreme detail, photorealistic rendering, professional photography quality.'''
    
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
