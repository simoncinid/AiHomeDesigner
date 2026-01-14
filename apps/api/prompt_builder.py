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
    """Build super detailed video prompt from motion preset for professional designers."""
    motion_prompts = {
        'orbit': (
            'A slow, cinematic orbit camera movement around the interior space, '
            'creating a smooth 360-degree reveal of the room. The camera gently rotates around the central focal point, '
            'maintaining perfect focus and stability. Subtle parallax effects between foreground and background elements '
            'add depth and dimension. The movement is fluid and professional, showcasing every detail of the design with '
            'cinematic quality. Hyperrealistic interior photography, 8K resolution, natural lighting, soft shadows, '
            'magazine-quality output. No flicker, no artifacts, perfectly stable camera movement.'
        ),
        'push_in': (
            'A dramatic, slow push-in camera movement that gradually zooms into the focal point of the interior space. '
            'The camera moves forward with cinematic precision, creating a sense of depth and immersion. '
            'The movement starts wide and slowly narrows, drawing attention to key design elements. '
            'Subtle parallax effects enhance the three-dimensional feel. Professional cinematography, '
            'hyperrealistic interior, 8K quality, natural lighting, soft shadows, magazine-grade output. '
            'Smooth, stable movement with no flicker or artifacts.'
        ),
        'pan': (
            'A slow, elegant horizontal pan across the interior space, creating a cinematic reveal of the room. '
            'The camera sweeps smoothly from left to right (or right to left), maintaining perfect focus and stability. '
            'The movement showcases the full breadth of the design, revealing details progressively. '
            'Subtle parallax effects add depth and dimension. Professional cinematography, hyperrealistic interior, '
            '8K resolution, natural lighting, soft shadows, magazine-quality output. Smooth, stable pan with no flicker.'
        ),
        'tilt': (
            'A slow, vertical tilt camera movement that reveals the interior space from floor to ceiling. '
            'The camera starts low and gradually tilts upward, creating a cinematic vertical reveal. '
            'The movement maintains perfect focus and stability, showcasing the full height and vertical elements of the design. '
            'Subtle parallax effects enhance the sense of depth. Professional cinematography, hyperrealistic interior, '
            '8K quality, natural lighting, soft shadows, magazine-grade output. Smooth, stable tilt with no flicker or artifacts.'
        ),
        'dolly': (
            'A smooth, forward dolly camera movement that moves through the interior space, creating an immersive experience. '
            'The camera glides forward with cinematic precision, maintaining perfect focus and stability. '
            'The movement creates a sense of journey through the space, revealing details as the camera progresses. '
            'Subtle parallax effects between foreground and background elements add depth and dimension. '
            'Professional cinematography, hyperrealistic interior, 8K resolution, natural lighting, soft shadows, '
            'magazine-quality output. Smooth, stable dolly movement with no flicker or artifacts.'
        ),
    }
    
    prompt = motion_prompts.get(motion_preset, (
        'A slow, cinematic camera movement showcasing the interior space with professional cinematography. '
        'Smooth, stable movement with subtle parallax effects. Hyperrealistic interior, 8K quality, '
        'natural lighting, soft shadows, magazine-grade output. No flicker, no artifacts.'
    ))
    
    return truncate_prompt(prompt)
