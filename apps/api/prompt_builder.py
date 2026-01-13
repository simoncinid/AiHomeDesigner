"""
Prompt engineering for interior design.
"""

MAX_PROMPT_LENGTH = 600

def truncate_prompt(prompt: str, max_length: int = MAX_PROMPT_LENGTH) -> str:
    """Truncate prompt to max length, cutting at word boundary if possible."""
    if len(prompt) <= max_length:
        return prompt
    
    truncated = prompt[:max_length]
    last_space = truncated.rfind(' ')
    if last_space > max_length * 0.8:
        truncated = truncated[:last_space]
    
    return truncated.rstrip('.,;: ')


def build_with_priority(system_prompt: str, system_prompt_short: str, user_prompt: str = None, max_len: int = MAX_PROMPT_LENGTH) -> str:
    """
    Build prompt with user_prompt priority.
    1. Try full system + user
    2. If over limit, use short system + user
    3. If still over, truncate system (never user)
    """
    user_part = f' {user_prompt}' if user_prompt else ''
    
    # Try full system prompt
    full = system_prompt + user_part
    if len(full) <= max_len:
        return full
    
    # Try short system prompt
    short = system_prompt_short + user_part
    if len(short) <= max_len:
        return short
    
    # Truncate system prompt to fit user prompt
    available_for_system = max_len - len(user_part)
    if available_for_system > 50:
        return truncate_prompt(system_prompt_short, available_for_system) + user_part
    
    # Edge case: user prompt alone is too long, return as much as possible
    return truncate_prompt(user_part.strip(), max_len)


def build_t2i_prompt(room_type: str, style: str, user_prompt: str = None, lighting: str = None) -> str:
    """Build text-to-image prompt."""
    base = f'Interior {room_type}, {style} style.'
    
    if lighting:
        base += f' {lighting} lighting.'
    
    system_full = base + ' Hyperrealistic professional interior photography, 8K, extreme detail, natural lighting, soft shadows, magazine quality. No text, no watermark, no people.'
    
    system_short = base + ' Hyperrealistic 8K interior photo, natural light. No text/watermark.'
    
    return build_with_priority(system_full, system_short, user_prompt)


def build_edit_prompt(style: str, wall_color: str = None, floor_material: str = None, edit_intent: str = None, user_prompt: str = None) -> str:
    """Build image edit prompt for redesigning a room while preserving its structure."""
    
    # Full system prompt - concise but complete
    system_full = f'''CRITICAL: Output must be PIXEL-PERFECT overlayable with original. Preserve EXACT: camera position, perspective, vanishing points, room dimensions, wall/ceiling/floor boundaries, window/door positions, light direction, shadows. ONLY change: furniture, decor, colors, materials to {style} style.'''
    
    # Short version
    system_short = f'''Preserve EXACT perspective, dimensions, camera angle. Only change furniture/decor/colors to {style} style.'''
    
    # Build user additions
    user_additions = ''
    if wall_color:
        user_additions += f' Walls: {wall_color}.'
    if floor_material:
        user_additions += f' Floor: {floor_material}.'
    if edit_intent:
        user_additions += f' {edit_intent}.'
    if user_prompt:
        user_additions += f' {user_prompt}'
    
    user_additions = user_additions.strip() if user_additions else None
    
    return build_with_priority(system_full, system_short, user_additions)


def build_quick_edit_prompt(edit_intent: str) -> str:
    """Build quick edit prompt for targeted modifications."""
    
    system_full = '''CRITICAL: Image must be PIXEL-PERFECT overlayable with original. Preserve EXACT: camera, perspective, dimensions, room geometry, all positions. Hyperrealistic 8K output.'''
    
    system_short = '''Preserve EXACT perspective and dimensions. Hyperrealistic output.'''
    
    return build_with_priority(system_full, system_short, edit_intent)


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
    prompt = f'{motion_text}. Hyperrealistic interior, stable, smooth camera, 8K, no flicker.'
    
    return truncate_prompt(prompt)
