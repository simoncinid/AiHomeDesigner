"""
Prompt engineering for interior design.
"""

def build_t2i_prompt(room_type: str, style: str, user_prompt: str = None, lighting: str = None) -> str:
    """Build text-to-image prompt."""
    base = f'Photorealistic interior, {room_type}, {style} style. Balanced natural daylight + warm ambient lights, realistic shadows, clean materials, high detail. Wide-angle 24mm, eye-level, natural perspective. Minimal clutter. No text, no watermark.'
    
    if user_prompt:
        return f'{base} {user_prompt}'
    
    if lighting:
        return f'{base} Lighting: {lighting}.'
    
    return base

def build_edit_prompt(style: str, wall_color: str = None, floor_material: str = None, edit_intent: str = None) -> str:
    """Build image edit prompt."""
    prompt = f'Interior redesign of the same room. Keep room layout, architecture, camera angle, and perspective unchanged. Replace finishes and furniture to match {style} style.'
    
    if wall_color:
        prompt += f' Update wall paint to {wall_color}.'
    
    if floor_material:
        prompt += f' Floor to {floor_material}.'
    
    if edit_intent:
        prompt += f' {edit_intent}.'
    
    prompt += ' Keep lighting direction consistent, realistic PBR textures, photorealistic. No text, no watermark.'
    
    return prompt

def build_quick_edit_prompt(edit_intent: str) -> str:
    """Build quick edit prompt."""
    return f'Keep everything identical. Only change {edit_intent}. Preserve composition, camera, and lighting.'

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
    return f'{motion_text}. Photorealistic, stable, no flicker, subtle motion, smooth.'
