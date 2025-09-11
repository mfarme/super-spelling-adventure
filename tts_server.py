#!/usr/bin/env python3
"""
Simple TTS server using Piper TTS for the Super Spelling Adventure game.
Provides three tiny footprint voice options.
"""

import json
import io
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import urllib.request
import os
import tempfile
from pathlib import Path

try:
    from piper import PiperVoice
except ImportError:
    print("Piper TTS not available. Install with: pip install piper-tts")
    exit(1)

class TTSServer(BaseHTTPRequestHandler):
    # Voice models - using small/tiny models for better performance
    VOICES = {
        'female-light': {
            'name': 'Luna Light',
            'model_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ljspeech/low/en_US-ljspeech-low.onnx',
            'config_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ljspeech/low/en_US-ljspeech-low.onnx.json',
            'model_file': 'en_US-ljspeech-low.onnx',
            'config_file': 'en_US-ljspeech-low.onnx.json'
        },
        'male-clear': {
            'name': 'Max Clear',
            'model_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/low/en_US-ryan-low.onnx',
            'config_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/low/en_US-ryan-low.onnx.json',
            'model_file': 'en_US-ryan-low.onnx',
            'config_file': 'en_US-ryan-low.onnx.json'
        },
        'child-friendly': {
            'name': 'Sam Sweet',
            'model_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/amy/low/en_US-amy-low.onnx',
            'config_url': 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/amy/low/en_US-amy-low.onnx.json',
            'model_file': 'en_US-amy-low.onnx',
            'config_file': 'en_US-amy-low.onnx.json'
        }
    }

    def __init__(self, *args, **kwargs):
        self.models_dir = Path('piper_models')
        self.models_dir.mkdir(exist_ok=True)
        self.voices = {}
        super().__init__(*args, **kwargs)

    def do_GET(self):
        parsed_url = urlparse(self.path)
        
        if parsed_url.path == '/tts':
            self.handle_tts_request(parsed_url)
        elif parsed_url.path == '/voices':
            self.handle_voices_request()
        elif parsed_url.path == '/health':
            self.handle_health_request()
        else:
            self.send_error(404, "Not Found")

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def handle_health_request(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps({"status": "ok", "voices_available": len(self.voices)})
        self.wfile.write(response.encode())

    def handle_voices_request(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        voices_info = {}
        for voice_id, voice_info in self.VOICES.items():
            voices_info[voice_id] = {
                'name': voice_info['name'],
                'available': voice_id in self.voices
            }
        
        response = json.dumps(voices_info)
        self.wfile.write(response.encode())

    def handle_tts_request(self, parsed_url):
        query_params = parse_qs(parsed_url.query)
        
        text = query_params.get('text', [''])[0]
        voice = query_params.get('voice', ['female-light'])[0]
        
        if not text:
            self.send_error(400, "Missing 'text' parameter")
            return
            
        if voice not in self.VOICES:
            self.send_error(400, f"Invalid voice '{voice}'. Available: {list(self.VOICES.keys())}")
            return
        
        try:
            # Load voice if not already loaded
            if voice not in self.voices:
                self.load_voice(voice)
            
            # Generate speech
            audio_data = self.generate_speech(text, voice)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'audio/wav')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(audio_data)))
            self.end_headers()
            self.wfile.write(audio_data)
            
        except Exception as e:
            print(f"Error generating speech: {e}")
            self.send_error(500, f"Speech generation failed: {str(e)}")

    def load_voice(self, voice_id):
        """Load a Piper voice model"""
        voice_info = self.VOICES[voice_id]
        model_path = self.models_dir / voice_info['model_file']
        config_path = self.models_dir / voice_info['config_file']
        
        # Download model and config if not present
        if not model_path.exists():
            print(f"Downloading {voice_info['name']} model...")
            self.download_file(voice_info['model_url'], model_path)
        
        if not config_path.exists():
            print(f"Downloading {voice_info['name']} config...")
            self.download_file(voice_info['config_url'], config_path)
        
        # Load the voice
        print(f"Loading {voice_info['name']} voice...")
        self.voices[voice_id] = PiperVoice.load(str(model_path))
        print(f"{voice_info['name']} voice loaded successfully!")

    def download_file(self, url, destination):
        """Download a file from URL to destination"""
        try:
            urllib.request.urlretrieve(url, destination)
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            raise

    def generate_speech(self, text, voice_id):
        """Generate speech audio for the given text using the specified voice"""
        voice = self.voices[voice_id]
        
        # Generate audio
        audio_buffer = io.BytesIO()
        voice.synthesize(text, audio_buffer)
        
        return audio_buffer.getvalue()

def main():
    # Initialize server
    server_address = ('localhost', 8080)
    httpd = HTTPServer(server_address, TTSServer)
    
    print("Piper TTS Server starting...")
    print(f"Server running on http://{server_address[0]}:{server_address[1]}")
    print("Available endpoints:")
    print("  GET /health - Server health check")
    print("  GET /voices - List available voices")
    print("  GET /tts?text=hello&voice=female-light - Generate speech")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == "__main__":
    main()