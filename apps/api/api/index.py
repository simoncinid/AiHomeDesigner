import sys
import os
import traceback
import json

# Lista COMPLETA di tutte le variabili d'ambiente necessarie
REQUIRED_ENV_VARS = [
    'DATABASE_URL',
    'CA_FILE', 
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'WAVESPEED_API_KEY',
    'IP_SALT',
    'RESEND_API_KEY',
    'SITE_URL',
    'CORS_ORIGINS'
]

def handler(event, context):
    """Handler che mostra TUTTO nella risposta HTML"""
    html_parts = []
    html_parts.append('<html><head><title>Vercel Debug</title><style>body{font-family:monospace;padding:20px;background:#1a1a1a;color:#0f0;}pre{background:#000;padding:10px;overflow:auto;}</style></head><body>')
    html_parts.append('<h1>🔍 VERCEL DEBUG INFO</h1>')
    
    try:
        # Info base
        html_parts.append('<h2>📋 System Info</h2>')
        html_parts.append(f'<p>Python: {sys.version.split()[0]}</p>')
        html_parts.append(f'<p>Current Dir: {os.getcwd()}</p>')
        html_parts.append(f'<p>File: {__file__}</p>')
        
        # Verifica file
        current_file = os.path.abspath(__file__)
        current_dir = os.path.dirname(current_file)
        parent_dir = os.path.dirname(current_dir)
        
        html_parts.append('<h2>📁 File System</h2>')
        html_parts.append(f'<p>Current Dir: {current_dir}</p>')
        html_parts.append(f'<p>Parent Dir: {parent_dir}</p>')
        html_parts.append(f'<p>File Exists: {os.path.exists(current_file)}</p>')
        html_parts.append(f'<p>Parent Exists: {os.path.exists(parent_dir)}</p>')
        
        # Lista file
        try:
            files_current = os.listdir(current_dir) if os.path.exists(current_dir) else []
            files_parent = os.listdir(parent_dir) if os.path.exists(parent_dir) else []
            html_parts.append(f'<p>Files in current: {", ".join(files_current[:10])}</p>')
            html_parts.append(f'<p>Files in parent: {", ".join(files_parent[:10])}</p>')
        except Exception as e:
            html_parts.append(f'<p style="color:red;">Error listing files: {e}</p>')
        
        # Verifica VARIABILI D'AMBIENTE
        html_parts.append('<h2>🔑 Environment Variables</h2>')
        missing_vars = []
        for var in REQUIRED_ENV_VARS:
            val = os.getenv(var)
            if val:
                if 'SECRET' in var or 'KEY' in var or 'PASSWORD' in var:
                    html_parts.append(f'<p style="color:green;">✅ {var}: SET (hidden)</p>')
                elif var == 'DATABASE_URL':
                    html_parts.append(f'<p style="color:green;">✅ {var}: {val[:50]}...</p>')
                elif var == 'CA_FILE':
                    html_parts.append(f'<p style="color:green;">✅ {var}: {len(val)} chars</p>')
                else:
                    html_parts.append(f'<p style="color:green;">✅ {var}: {val[:100]}</p>')
            else:
                html_parts.append(f'<p style="color:red;">❌ {var}: <strong>NOT SET - MANCA!</strong></p>')
                missing_vars.append(var)
        
        if missing_vars:
            html_parts.append(f'<h2 style="color:red;">⚠️ VARIABILI MANCANTI: {", ".join(missing_vars)}</h2>')
        
        # Prova import
        html_parts.append('<h2>📦 Import Test</h2>')
        import_errors = []
        
        try:
            if parent_dir not in sys.path:
                sys.path.insert(0, parent_dir)
            os.chdir(parent_dir)
            html_parts.append(f'<p style="color:green;">✅ Path aggiunto: {parent_dir}</p>')
        except Exception as e:
            html_parts.append(f'<p style="color:red;">❌ Error setting path: {e}</p>')
            import_errors.append(f'Path error: {e}')
        
        # Test import moduli uno per uno
        modules_to_test = [
            ('main', 'main'),
            ('mangum', 'Mangum'),
            ('fastapi', 'FastAPI'),
            ('sqlalchemy', 'create_engine'),
            ('database', 'get_db'),
        ]
        
        for module_name, import_name in modules_to_test:
            try:
                if module_name == 'main':
                    from main import app
                    html_parts.append(f'<p style="color:green;">✅ {module_name} imported</p>')
                elif module_name == 'mangum':
                    from mangum import Mangum
                    html_parts.append(f'<p style="color:green;">✅ {module_name} imported</p>')
                elif module_name == 'fastapi':
                    from fastapi import FastAPI
                    html_parts.append(f'<p style="color:green;">✅ {module_name} imported</p>')
                elif module_name == 'sqlalchemy':
                    from sqlalchemy import create_engine
                    html_parts.append(f'<p style="color:green;">✅ {module_name} imported</p>')
                elif module_name == 'database':
                    from database import get_db
                    html_parts.append(f'<p style="color:green;">✅ {module_name} imported</p>')
            except Exception as e:
                error_msg = str(e)
                html_parts.append(f'<p style="color:red;">❌ {module_name}: {error_msg}</p>')
                html_parts.append(f'<pre style="color:red;">{traceback.format_exc()}</pre>')
                import_errors.append(f'{module_name}: {error_msg}')
        
        # Se tutto ok, prova a creare handler
        if not import_errors and not missing_vars:
            try:
                from main import app
                from mangum import Mangum
                mangum_handler = Mangum(app, lifespan="off")
                html_parts.append('<p style="color:green;">✅ Handler creato, provo a eseguire...</p>')
                result = mangum_handler(event, context)
                html_parts.append('<h2 style="color:green;">✅ SUCCESS!</h2>')
                html_parts.append(f'<pre>{json.dumps(result, indent=2)}</pre>')
                html_parts.append('</body></html>')
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'text/html'},
                    'body': ''.join(html_parts)
                }
            except Exception as e:
                html_parts.append(f'<h2 style="color:red;">❌ Runtime Error</h2>')
                html_parts.append(f'<pre style="color:red;">{traceback.format_exc()}</pre>')
        
        # Mostra errori
        if import_errors:
            html_parts.append('<h2 style="color:red;">❌ Import Errors</h2>')
            for err in import_errors:
                html_parts.append(f'<p style="color:red;">{err}</p>')
        
    except Exception as outer_err:
        html_parts.append('<h2 style="color:red;">💥 CRITICAL ERROR</h2>')
        html_parts.append(f'<pre style="color:red;">{traceback.format_exc()}</pre>')
    
    html_parts.append('</body></html>')
    
    return {
        'statusCode': 500,
        'headers': {'Content-Type': 'text/html'},
        'body': ''.join(html_parts)
    }
