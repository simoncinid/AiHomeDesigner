import httpx
import os
from typing import Optional, List, Dict, Any
import time

WAVESPEED_API_KEY = os.getenv('WAVESPEED_API_KEY')
WAVESPEED_BASE_URL = 'https://api.wavespeed.ai/api/v3'

async def upload_media(file_content: bytes, filename: str) -> str:
    """Upload media to WaveSpeedAI and return download_url."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        files = {'file': (filename, file_content)}
        headers = {'Authorization': f'Bearer {WAVESPEED_API_KEY}'}
        
        response = await client.post(
            f'{WAVESPEED_BASE_URL}/media/upload/binary',
            files=files,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return data['data']['download_url']

async def submit_seedream_t2i(
    prompt: str,
    size: str = '2048*2048',
) -> str:
    """Submit text-to-image request and return request_id."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            'Authorization': f'Bearer {WAVESPEED_API_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'prompt': prompt,
            'size': size,
            'enable_base64_output': False,
            'enable_sync_mode': False,
        }
        
        response = await client.post(
            f'{WAVESPEED_BASE_URL}/bytedance/seedream-v4',
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return data['data']['id']

async def submit_seedream_edit(
    prompt: str,
    images: List[str],
    size: str = '2048*2048',
) -> str:
    """Submit image edit request and return request_id."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            'Authorization': f'Bearer {WAVESPEED_API_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'prompt': prompt,
            'images': images,
            'size': size,
            'enable_base64_output': False,
            'enable_sync_mode': False,
        }
        
        response = await client.post(
            f'{WAVESPEED_BASE_URL}/bytedance/seedream-v4/edit',
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return data['data']['id']

async def submit_ltx_i2v(
    image_url: str,
    prompt: str,
    duration: int = 5,
    resolution: str = '720p',
) -> str:
    """Submit image-to-video request and return request_id."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            'Authorization': f'Bearer {WAVESPEED_API_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'image': image_url,
            'prompt': prompt,
            'duration': duration,
            'resolution': resolution,
            'seed': -1,
            'loras': [],
        }
        
        response = await client.post(
            f'{WAVESPEED_BASE_URL}/wavespeed-ai/ltx-2-19b/image-to-video-lora',
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return data['data']['id']

async def submit_dreamina_i2v(
    image_url: str,
    prompt: str,
) -> str:
    """Submit image-to-video request using Dreamina v3.0 (1080p, 5 seconds fixed)."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            'Authorization': f'Bearer {WAVESPEED_API_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'duration': 5,
            'image': image_url,
            'prompt': prompt,
            'seed': -1,
        }
        
        response = await client.post(
            f'{WAVESPEED_BASE_URL}/bytedance/dreamina-v3.0/image-to-video-1080p',
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return data['data']['id']

async def submit_seedance_i2v(
    image_url: str,
    prompt: str,
    duration: int = 5,
    aspect_ratio: str = '16:9',
) -> str:
    """Submit image-to-video request using Seedance v1.5-pro."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {
            'Authorization': f'Bearer {WAVESPEED_API_KEY}',
            'Content-Type': 'application/json',
        }
        
        # Always use 1080p resolution for high quality output
        resolution = '1080p'
        
        payload = {
            'camera_fixed': False,
            'duration': duration,
            'generate_audio': True,
            'image': image_url,
            'prompt': prompt,
            'resolution': resolution,
            'seed': -1,
        }
        
        response = await client.post(
            f'{WAVESPEED_BASE_URL}/bytedance/seedance-v1.5-pro/image-to-video-fast',
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        return data['data']['id']

async def poll_result(request_id: str) -> Dict[str, Any]:
    """Poll prediction result and return status, outputs, error."""
    import sys
    def log(msg):
        sys.stderr.write(f'[WAVESPEED POLL] {msg}\n')
        sys.stderr.flush()
    
    log(f'Polling request_id={request_id}')
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {'Authorization': f'Bearer {WAVESPEED_API_KEY}'}
        
        try:
            response = await client.get(
                f'{WAVESPEED_BASE_URL}/predictions/{request_id}/result',
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()
            
            status = data.get('data', {}).get('status', 'unknown')
            outputs = data.get('data', {}).get('outputs', [])
            error = data.get('data', {}).get('error')
            
            log(f'Request {request_id}: status={status}, outputs_count={len(outputs) if isinstance(outputs, list) else 0}, error={error}')
            
            return {
                'status': status,
                'outputs': outputs,
                'error': error,
            }
        except Exception as e:
            log(f'Error polling {request_id}: {str(e)}')
            raise
