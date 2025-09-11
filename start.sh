#!/bin/bash
# Startup script for Super Spelling Adventure with Piper TTS

echo "Starting Super Spelling Adventure with Piper TTS..."

# Check if Python and pip are available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Install Piper TTS if not already installed
echo "Checking Piper TTS installation..."
python3 -c "import piper" 2>/dev/null || {
    echo "Installing Piper TTS..."
    pip install piper-tts
}

# Start TTS server in background
echo "Starting Piper TTS server on port 8080..."
python3 tts_server.py &
TTS_PID=$!

# Wait a moment for TTS server to start
sleep 3

# Start web server
echo "Starting web server on port 8000..."
python3 -m http.server 8000 &
WEB_PID=$!

echo ""
echo "🌟 Super Spelling Adventure is now running! 🌟"
echo ""
echo "📱 Web App: http://localhost:8000"
echo "🎤 TTS Server: http://localhost:8080"
echo ""
echo "The app will use Piper TTS for realistic voices!"
echo "If Piper TTS is not available, it will fall back to browser speech synthesis."
echo ""
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $TTS_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    echo "Servers stopped. Goodbye! 👋"
    exit 0
}

# Set trap to cleanup on interrupt
trap cleanup SIGINT

# Wait for both processes
wait $TTS_PID $WEB_PID