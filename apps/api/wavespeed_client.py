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

async def poll_result(request_id: str) -> Dict[str, Any]:
    """Poll prediction result and return status, outputs, error."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        headers = {'Authorization': f'Bearer {WAVESPEED_API_KEY}'}
        
        response = await client.get(
            f'{WAVESPEED_BASE_URL}/predictions/{request_id}/result',
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        
        status = data.get('data', {}).get('status', 'unknown')
        outputs = data.get('data', {}).get('outputs', [])
        error = data.get('data', {}).get('error')
        
        return {
            'status': status,
            'outputs': outputs,
            'error': error,
        }
