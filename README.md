# Super Spelling Adventure!

[![Deploy to GitHub Pages](https://github.com/mfarme/super-spelling-adventure/actions/workflows/deploy.yml/badge.svg)](https://github.com/mfarme/super-spelling-adventure/actions/workflows/deploy.yml)

A spelling game designed to make my daughter's spelling homework more fun. We coded it together. Features multiple game modes, colorful animations, encouraging characters, and audio support to help children master their spelling words.

![Spelling Adventure Screenshot](https://github.com/mfarme/super-spelling-adventure/blob/main/public/screenshot.png)


## Features
- Easy Word Entry: Add single words or comma-separated lists
- Auto-Save: Words are automatically saved in your browser

### **Multiple Game Modes**
- **Typing Challenge**
- **Letter Hunt**
- **Word Scramble**

### **Interactive Learning**
- Audio Support: Hear words pronounced clearly and spelled out letter by letter
- Voice Selection: Choose from three realistic voice options powered by Piper TTS
  - 🟢 **Luna Light**: Gentle & Clear (Female voice)
  - 🔵 **Max Clear**: Strong & Friendly (Male voice) 
  - 🟡 **Sam Sweet**: Kid-Friendly voice
- Voice Preview: Try each voice before selecting your favorite
- Smart Fallback: Automatically uses browser speech synthesis if Piper TTS is unavailable



## 🚀 Quick Start

### Option 1: Play Online 
Visit the live demo: **[Play Super Spelling Adventure!](https://mfarme.github.io/super-spelling-adventure)**

### Option 2: Download and Run Locally
1. **Download**: Click the green "Code" button above and select "Download ZIP"
2. **Extract**: Unzip the downloaded file to your computer
3. **Open**: Double-click `index.html` to start playing in your web browser

### Option 3: Run with Piper TTS (Advanced)
For the best voice experience with realistic TTS voices:

1. **Prerequisites**: Python 3.7+ installed on your system
2. **Download**: Clone or download this repository
3. **Start**: Run the startup script:
   ```bash
   ./start.sh
   ```
   Or manually:
   ```bash
   # Install Piper TTS
   pip install piper-tts
   
   # Start TTS server
   python3 tts_server.py &
   
   # Start web server  
   python3 -m http.server 8000
   ```
4. **Play**: Open http://localhost:8000 in your browser

The app will automatically detect and use Piper TTS for realistic voices, or fall back to browser speech synthesis if unavailable.



This project is open source and available under the MIT License. Feel free to use it for educational purposes, modify it, or share it with others!



**Made with ❤️ for young learners everywhere!**
