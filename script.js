// Spelling Adventure Game!
// Made with love for learning and fun!

class SpellingGame {
    constructor() {
        this.words = [];
        this.currentWordIndex = 0;
        this.currentWord = '';
        this.gameMode = 'typing';
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.wordsCorrect = 0;
        this.isGameActive = false;
        this.guessedLetters = [];
        this.revealedLetters = [];

        // Character expressions for different situations
        this.characters = {
            welcome: '🧙‍♀️',
            thinking: '🤔',
            happy: '😊',
            excited: '🎉',
            encouraging: '💪',
            celebrating: '🎊',
            magic: '✨'
        };

        // Encouraging messages
        this.encouragingMessages = [
            "You're doing amazing! ✨",
            "Keep up the great work! 🌟",
            "You're a spelling superstar! ⭐",
            "Fantastic job! 🎉",
            "You're getting better and better! 💪",
            "Wow, you're so smart! 🧠",
            "I believe in you! 💖",
            "You've got this! 🚀"
        ];

        this.hints = {
            // Add some fun hints for common words
            'the': 'This tiny word appears in almost every sentence!',
            'and': 'This word connects two things together.',
            'you': 'This word points to the person reading this!',
            'are': 'This word tells us what someone is being.',
            'for': 'This word shows what something is meant to help.',
            'with': 'This word means "together" or "alongside".',
            'have': 'This word means to own or possess something.',
            'this': 'This word points to something close by.',
            'that': 'This word points to something farther away.',
            'from': 'This word shows where something comes out of.',
            'they': 'This word refers to other people or things.',
            'know': 'This word means to understand or be aware of.',
            'want': 'This word means to wish for or desire.',
            'been': 'This is the past form of "be".',
            'good': 'This word is the opposite of bad.',
            'much': 'This word means "a lot" or "very".',
            'some': 'This word means "a few" or "a little bit".',
            'time': 'This word measures minutes, hours, and days.',
            'very': 'This word makes other words stronger.',
            'when': 'This word asks about what time something happens.',
            'come': 'This word means to move toward something.',
            'here': 'This word means "in this place".',
            'just': 'This word can mean "only" or "recently".',
            'like': 'This word can mean "similar to" or "enjoy".',
            'long': 'This word is the opposite of short.',
            'make': 'This word means to create or build.',
            'many': 'This word means "a lot of" (for countable things).',
            'over': 'This word can mean "above" or "finished".',
            'such': 'This word means "of that kind".',
            'take': 'This word means to grab or carry away.',
            'than': 'This word is used when comparing two things.',
            'them': 'This word refers to other people or things (object form).',
            'well': 'This word can mean "good" or describe how something is done.',
            'were': 'This is the past form of "are".'
        };

        this.initializeElements();
        this.setupEventListeners();
        this.loadSavedWords();
        this.createFloatingParticles();
    }

    initializeElements() {
        // Screen elements
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultsScreen = document.getElementById('results-screen');

        // Welcome screen elements
        this.newWordInput = document.getElementById('new-word-input');
        this.addWordBtn = document.getElementById('add-word-btn');
        this.wordList = document.getElementById('word-list');
        this.clearWordsBtn = document.getElementById('clear-words-btn');
        this.modeButtons = document.querySelectorAll('.mode-btn');

        // Game screen elements
        this.gameCharacter = document.getElementById('game-character');
        this.characterSpeech = document.getElementById('character-speech');
        this.wordDisplay = document.getElementById('word-display');
        this.gameInput = document.getElementById('game-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedback = document.getElementById('feedback');
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.wordCounterElement = document.getElementById('word-counter');
        this.progressFill = document.getElementById('progress-fill');
        this.nextWordBtn = document.getElementById('next-word');
        this.backToMenuBtn = document.getElementById('back-to-menu');

        // Audio buttons
        this.hearWordBtn = document.getElementById('hear-word');
        this.hearSpelledBtn = document.getElementById('hear-spelled');
        this.hintBtn = document.getElementById('hint-btn');

        // Results screen elements
        this.resultsCharacter = document.getElementById('results-character');
        this.resultsTitle = document.getElementById('results-title');
        this.finalScoreElement = document.getElementById('final-score');
        this.wordsCorrectElement = document.getElementById('words-correct');
        this.bestStreakElement = document.getElementById('best-streak');
        this.playAgainBtn = document.getElementById('play-again');
        this.newWordsBtn = document.getElementById('new-words');

        // Celebration element
        this.celebration = document.getElementById('celebration');
    }

    setupEventListeners() {
        // Welcome screen events
        this.addWordBtn.addEventListener('click', () => this.addWord());
        this.newWordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWord();
        });
        this.clearWordsBtn.addEventListener('click', () => this.clearAllWords());

        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectGameMode(btn.dataset.mode));
        });

        // Game screen events
        this.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.gameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnswer();
        });
        this.nextWordBtn.addEventListener('click', () => this.nextWord());
        this.backToMenuBtn.addEventListener('click', () => this.showWelcomeScreen());

        // Audio events
        this.hearWordBtn.addEventListener('click', () => this.speakWord());
        this.hearSpelledBtn.addEventListener('click', () => this.speakWordSpelled());
        this.hintBtn.addEventListener('click', () => this.showHint());

        // Results screen events
        this.playAgainBtn.addEventListener('click', () => this.startGame());
        this.newWordsBtn.addEventListener('click', () => this.showWelcomeScreen());
    }

    createFloatingParticles() {
        // Create more floating particles for extra magic!
        const particles = document.querySelector('.particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 6 + 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = `hsl(${Math.random() * 360}, 70%, 80%)`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particle.style.animation = `float ${Math.random() * 4 + 4}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 4 + 's';
            particles.appendChild(particle);
        }
    }

    addWord() {
        const input = this.newWordInput.value.trim();
        if (!input) return;
        
        // Check if input contains commas (comma-separated list)
        const wordsToAdd = input.includes(',') 
            ? input.split(',').map(word => word.trim().toLowerCase()).filter(word => word.length > 0)
            : [input.toLowerCase()];
        
        let addedCount = 0;
        let duplicateCount = 0;
        
        wordsToAdd.forEach(word => {
            // Basic validation - only letters and common punctuation
            if (word && /^[a-zA-Z\s'-]+$/.test(word) && !this.words.includes(word)) {
                this.words.push(word);
                addedCount++;
            } else if (this.words.includes(word)) {
                duplicateCount++;
            }
        });
        
        if (addedCount > 0) {
            this.updateWordList();
            this.saveWords();
            this.newWordInput.value = '';
            
            if (addedCount === 1) {
                this.showMessage('Word added! ✨', 'success');
            } else {
                this.showMessage(`${addedCount} words added! 🎉`, 'success');
            }
        }
        
        if (duplicateCount > 0) {
            const message = duplicateCount === 1 
                ? 'One word already exists! 🤔' 
                : `${duplicateCount} words already exist! 🤔`;
            this.showMessage(message, 'warning');
        }
        
        if (addedCount === 0 && duplicateCount === 0) {
            this.showMessage('Please enter valid words (letters only)! 📝', 'warning');
        }
    }

    updateWordList() {
        this.wordList.innerHTML = '';
        this.words.forEach((word, index) => {
            const wordTag = document.createElement('div');
            wordTag.className = 'word-tag';
            wordTag.innerHTML = `
                <span>${word}</span>
                <button class="remove-word" onclick="game.removeWord(${index})">×</button>
            `;
            this.wordList.appendChild(wordTag);
        });
    }

    removeWord(index) {
        this.words.splice(index, 1);
        this.updateWordList();
        this.saveWords();
    }

    clearAllWords() {
        if (confirm('Are you sure you want to clear all words? 🤔')) {
            this.words = [];
            this.updateWordList();
            this.saveWords();
            this.showMessage('All words cleared! 🗑️', 'info');
        }
    }

    saveWords() {
        localStorage.setItem('spellingWords', JSON.stringify(this.words));
    }

    loadSavedWords() {
        const saved = localStorage.getItem('spellingWords');
        if (saved) {
            this.words = JSON.parse(saved);
            this.updateWordList();
        } else {
            // Add some default words to get started
            this.words = [
                'cat', 'dog', 'sun', 'moon', 'star', 'tree', 'book', 'play', 'happy', 'friend'
            ];
            this.updateWordList();
        }
    }

    selectGameMode(mode) {
        if (this.words.length === 0) {
            this.showMessage('Please add some words first! 📝', 'warning');
            return;
        }

        this.gameMode = mode;
        this.startGame();
    }

    startGame() {
        if (this.words.length === 0) {
            this.showMessage('Please add some words first! 📝', 'warning');
            return;
        }

        // Reset game state
        this.currentWordIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.wordsCorrect = 0;
        this.isGameActive = true;

        // Shuffle words for variety
        this.shuffleWords();

        // Show game screen
        this.showGameScreen();
        this.loadCurrentWord();
        this.updateCharacter('excited', "Let's start our spelling adventure! 🚀");
    }

    shuffleWords() {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    }

    loadCurrentWord() {
        if (this.currentWordIndex >= this.words.length) {
            this.endGame();
            return;
        }

        this.currentWord = this.words[this.currentWordIndex];
        this.guessedLetters = [];
        this.revealedLetters = [];

        this.updateWordDisplay();
        this.updateUI();
        this.clearFeedback();
        this.gameInput.value = '';
        this.gameInput.focus();

        // Update placeholder based on game mode
        this.updateInputPlaceholder();

        // Speak the word automatically
        setTimeout(() => this.speakWord(), 500);
    }

    updateInputPlaceholder() {
        const placeholders = {
            typing: 'Type the word you hear...',
            letters: 'Guess a letter or the whole word...',
            scramble: 'Unscramble these letters...'
        };
        this.gameInput.placeholder = placeholders[this.gameMode];
    }

    updateWordDisplay() {
        this.wordDisplay.innerHTML = '';

        if (this.gameMode === 'scramble') {
            // Show scrambled letters
            const scrambled = this.scrambleWord(this.currentWord);
            scrambled.split('').forEach(letter => {
                const letterBox = document.createElement('div');
                letterBox.className = 'letter-box scrambled';
                letterBox.textContent = letter.toUpperCase();
                this.wordDisplay.appendChild(letterBox);
            });
        } else if (this.gameMode === 'letters') {
            // Show letter boxes with revealed letters
            this.currentWord.split('').forEach((letter, index) => {
                const letterBox = document.createElement('div');
                letterBox.className = 'letter-box';
                if (this.revealedLetters.includes(index)) {
                    letterBox.textContent = letter.toUpperCase();
                    letterBox.classList.add('revealed');
                } else {
                    letterBox.textContent = '';
                }
                this.wordDisplay.appendChild(letterBox);
            });
        } else {
            // Typing mode - show empty boxes
            this.currentWord.split('').forEach(() => {
                const letterBox = document.createElement('div');
                letterBox.className = 'letter-box';
                this.wordDisplay.appendChild(letterBox);
            });
        }
    }

    scrambleWord(word) {
        const letters = word.split('');
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters.join('');
    }

    submitAnswer() {
        if (!this.isGameActive) return;

        const answer = this.gameInput.value.trim().toLowerCase();
        if (!answer) return;

        if (this.gameMode === 'letters' && answer.length === 1) {
            this.guessLetter(answer);
        } else {
            this.guessWord(answer);
        }

        this.gameInput.value = '';
    }

    guessLetter(letter) {
        if (this.guessedLetters.includes(letter)) {
            this.showFeedback(`You already guessed "${letter.toUpperCase()}"! 🤔`, 'incorrect');
            return;
        }

        this.guessedLetters.push(letter);

        if (this.currentWord.includes(letter)) {
            // Correct letter
            this.currentWord.split('').forEach((char, index) => {
                if (char === letter) {
                    this.revealedLetters.push(index);
                }
            });

            this.updateWordDisplay();
            this.showFeedback(`Great! "${letter.toUpperCase()}" is in the word! ✨`, 'correct');
            this.updateCharacter('happy', this.getRandomEncouragement());

            // Check if word is complete
            if (this.isWordComplete()) {
                setTimeout(() => this.handleCorrectWord(), 1000);
            }
        } else {
            // Incorrect letter
            this.showFeedback(`Sorry, "${letter.toUpperCase()}" is not in the word. Try again! 💪`, 'incorrect');
            this.updateCharacter('encouraging', "Don't give up! You're doing great!");
        }
    }

    guessWord(word) {
        if (word === this.currentWord) {
            this.handleCorrectWord();
        } else {
            this.handleIncorrectWord();
        }
    }

    isWordComplete() {
        return this.revealedLetters.length === this.currentWord.length;
    }

    handleCorrectWord() {
        this.score += 10 + (this.streak * 2); // Bonus points for streaks!
        this.streak++;
        this.wordsCorrect++;

        if (this.streak > this.bestStreak) {
            this.bestStreak = this.streak;
        }

        // Reveal the word with animation
        this.revealWordWithAnimation();

        this.showFeedback(`🎉 Correct! "${this.currentWord.toUpperCase()}" - Amazing work!`, 'correct');
        this.updateCharacter('celebrating', this.getRandomEncouragement());

        // Create celebration effect
        this.createCelebration();

        this.nextWordBtn.disabled = false;
        this.updateUI();
    }

    handleIncorrectWord() {
        this.streak = 0; // Reset streak on incorrect answer
        this.showFeedback(`Not quite right. The word was "${this.currentWord.toUpperCase()}". Keep trying! 💪`, 'incorrect');
        this.updateCharacter('encouraging', "That's okay! Learning is all about trying!");

        this.nextWordBtn.disabled = false;
        this.updateUI();
    }

    revealWordWithAnimation() {
        const letterBoxes = this.wordDisplay.querySelectorAll('.letter-box');
        letterBoxes.forEach((box, index) => {
            setTimeout(() => {
                box.textContent = this.currentWord[index].toUpperCase();
                box.classList.add('revealed');
            }, index * 100);
        });
    }

    nextWord() {
        this.currentWordIndex++;
        this.nextWordBtn.disabled = true;

        if (this.currentWordIndex >= this.words.length) {
            setTimeout(() => this.endGame(), 1000);
        } else {
            this.loadCurrentWord();
        }
    }

    endGame() {
        this.isGameActive = false;
        this.showResultsScreen();
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
        this.wordCounterElement.textContent = `${this.currentWordIndex + 1}/${this.words.length}`;

        // Update progress bar
        const progress = ((this.currentWordIndex + 1) / this.words.length) * 100;
        this.progressFill.style.width = progress + '%';
    }

    updateCharacter(emotion, message) {
        this.gameCharacter.textContent = this.characters[emotion];
        this.characterSpeech.textContent = message;

        // Add a little bounce animation
        this.gameCharacter.style.animation = 'none';
        setTimeout(() => {
            this.gameCharacter.style.animation = 'bounce 2s ease-in-out infinite';
        }, 10);
    }

    getRandomEncouragement() {
        return this.encouragingMessages[Math.floor(Math.random() * this.encouragingMessages.length)];
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }

    clearFeedback() {
        this.feedback.textContent = '';
        this.feedback.className = 'feedback';
    }

    speakWord() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(this.currentWord);
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    speakWordSpelled() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const letters = this.currentWord.split('');
            let spellText = 'The word is spelled: ';
            letters.forEach(letter => {
                spellText += letter + ', ';
            });
            spellText += '. The word is ' + this.currentWord;

            const utterance = new SpeechSynthesisUtterance(spellText);
            utterance.rate = 0.7;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    showHint() {
        const hint = this.hints[this.currentWord] || `This word has ${this.currentWord.length} letters and starts with "${this.currentWord[0].toUpperCase()}"`;
        this.updateCharacter('thinking', hint);

        // Speak the hint
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(hint);
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }

    createCelebration() {
        // Create confetti effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
                confetti.style.animationDelay = Math.random() * 2 + 's';
                this.celebration.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    }

    showWelcomeScreen() {
        this.welcomeScreen.classList.add('active');
        this.gameScreen.classList.remove('active');
        this.resultsScreen.classList.remove('active');
    }

    showGameScreen() {
        this.welcomeScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.resultsScreen.classList.remove('active');
    }

    showResultsScreen() {
        this.welcomeScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.resultsScreen.classList.add('active');

        // Update results
        this.finalScoreElement.textContent = this.score;
        this.wordsCorrectElement.textContent = this.wordsCorrect;
        this.bestStreakElement.textContent = this.bestStreak;

        // Set appropriate character and message
        if (this.wordsCorrect === this.words.length) {
            this.resultsCharacter.textContent = '🏆';
            this.resultsTitle.textContent = 'Perfect Score! You\'re a Spelling Champion!';
        } else if (this.wordsCorrect >= this.words.length * 0.8) {
            this.resultsCharacter.textContent = '🌟';
            this.resultsTitle.textContent = 'Excellent Work! You\'re Amazing!';
        } else if (this.wordsCorrect >= this.words.length * 0.6) {
            this.resultsCharacter.textContent = '😊';
            this.resultsTitle.textContent = 'Great Job! Keep Practicing!';
        } else {
            this.resultsCharacter.textContent = '💪';
            this.resultsTitle.textContent = 'Good Effort! Practice Makes Perfect!';
        }

        // Create final celebration
        this.createCelebration();
    }

    showMessage(message, type) {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4facfe' : type === 'warning' ? '#feca57' : '#ff9a9e'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// Initialize the game when the page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new SpellingGame();
});