#!/usr/bin/env python3
"""
Simple TTS server demo for the Super Spelling Adventure game.
Demonstrates Piper TTS integration pattern with three voice options.
Falls back to system TTS when Piper models are not available.
"""

import json
import io
import base64
import subprocess
import tempfile
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path

class TTSServer(BaseHTTPRequestHandler):
    # Voice configuration - demonstrates Piper TTS integration pattern
    VOICES = {
        'female-light': {
            'name': 'Luna Light',
            'description': 'Gentle & Clear',
            'icon': '👩',
            'piperModel': 'en_US-ljspeech-low',  # Would be used with actual Piper models
            'systemVoice': 'female'  # Fallback for demo
        },
        'male-clear': {
            'name': 'Max Clear', 
            'description': 'Strong & Friendly',
            'icon': '👨',
            'piperModel': 'en_US-ryan-low',
            'systemVoice': 'male'
        },
        'child-friendly': {
            'name': 'Sam Sweet',
            'description': 'Kid-Friendly', 
            'icon': '🧒',
            'piperModel': 'en_US-amy-low',
            'systemVoice': 'child'
        }
    }

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
        
        # Check what TTS engines are available
        engines_available = []
        
        # Check for espeak (common on Linux)
        try:
            subprocess.run(['espeak', '--version'], capture_output=True, check=True)
            engines_available.append('espeak')
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Check for say (macOS)
        try:
            subprocess.run(['say', '-v', '?'], capture_output=True, check=True)
            engines_available.append('say')
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
            
        response = json.dumps({
            "status": "ok", 
            "voices_available": len(self.VOICES),
            "tts_engines": engines_available,
            "demo_mode": True,
            "note": "This is a Piper TTS integration demo. In production, it would use actual Piper models."
        })
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
                'description': voice_info['description'],
                'piperModel': voice_info['piperModel'],
                'available': True  # Demo mode - all voices "available"
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
            # In a real implementation, this would use Piper TTS
            # For demo purposes, we'll generate a simple audio response
            audio_data = self.generate_demo_audio(text, voice)
            
            if audio_data:
                # Send audio response
                self.send_response(200)
                self.send_header('Content-Type', 'audio/wav')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(audio_data)))
                self.end_headers()
                self.wfile.write(audio_data)
            else:
                # Send JSON response indicating TTS was triggered
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = json.dumps({
                    'status': 'success',
                    'message': f'TTS triggered for voice "{self.VOICES[voice]["name"]}"',
                    'text': text,
                    'voice': voice,
                    'note': 'In production, this would return Piper TTS audio data'
                })
                self.wfile.write(response.encode())
                
        except Exception as e:
            print(f"Error generating speech: {e}")
            self.send_error(500, f"Speech generation failed: {str(e)}")

    def generate_demo_audio(self, text, voice_id):
        """
        Generate demo audio using system TTS if available.
        In production, this would use Piper TTS models.
        """
        voice_info = self.VOICES[voice_id]
        
        # Try espeak first (Linux)
        try:
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                # Configure espeak parameters based on voice
                voice_params = []
                if voice_info['systemVoice'] == 'female':
                    voice_params = ['-s', '160', '-p', '60']  # Slower, higher pitch
                elif voice_info['systemVoice'] == 'male':
                    voice_params = ['-s', '180', '-p', '30']  # Medium speed, lower pitch
                else:  # child-friendly
                    voice_params = ['-s', '140', '-p', '80']  # Slower, much higher pitch
                
                cmd = ['espeak'] + voice_params + ['-w', temp_file.name, text]
                result = subprocess.run(cmd, capture_output=True, check=True)
                
                # Read the generated audio file
                with open(temp_file.name, 'rb') as f:
                    audio_data = f.read()
                
                # Clean up temp file
                os.unlink(temp_file.name)
                return audio_data
                
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # Try macOS say command
        try:
            with tempfile.NamedTemporaryFile(suffix='.aiff', delete=False) as temp_file:
                # Use different voices for each option
                voice_name = 'Victoria' if voice_info['systemVoice'] == 'female' else 'Daniel' if voice_info['systemVoice'] == 'male' else 'Kyoko'
                
                cmd = ['say', '-v', voice_name, '-o', temp_file.name, text]
                result = subprocess.run(cmd, capture_output=True, check=True)
                
                # Convert AIFF to WAV using sox if available, or return AIFF
                try:
                    wav_file = temp_file.name.replace('.aiff', '.wav')
                    subprocess.run(['sox', temp_file.name, wav_file], capture_output=True, check=True)
                    with open(wav_file, 'rb') as f:
                        audio_data = f.read()
                    os.unlink(wav_file)
                except (subprocess.CalledProcessError, FileNotFoundError):
                    # Return AIFF if sox not available
                    with open(temp_file.name, 'rb') as f:
                        audio_data = f.read()
                
                os.unlink(temp_file.name)
                return audio_data
                
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass
        
        # No system TTS available - return None to trigger JSON response
        print(f"No TTS engine available. Would use Piper TTS for: '{text}' with voice '{voice_id}'")
        return None

def main():
    # Initialize server
    server_address = ('localhost', 8080)
    httpd = HTTPServer(server_address, TTSServer)
    
    print("Piper TTS Integration Demo Server starting...")
    print(f"Server running on http://{server_address[0]}:{server_address[1]}")
    print("")
    print("🎤 Available Voice Options:")
    for voice_id, voice_info in TTSServer.VOICES.items():
        print(f"  {voice_info['icon']} {voice_info['name']} - {voice_info['description']}")
    print("")
    print("📡 Available endpoints:")
    print("  GET /health - Server health check and TTS engine status")
    print("  GET /voices - List available voice options")
    print("  GET /tts?text=hello&voice=female-light - Generate speech")
    print("")
    print("Note: This demo shows Piper TTS integration architecture.")
    print("In production, it would use actual Piper models for realistic voices.")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
        httpd.shutdown()

if __name__ == "__main__":
    main()