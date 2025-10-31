document.addEventListener('DOMContentLoaded', () => {
    const themeSelection = document.getElementById('theme-selection');
    const pianoContainer = document.getElementById('piano-container');
    const animalsBtn = document.getElementById('animals-btn');
    const fruitsBtn = document.getElementById('fruits-btn');
    let currentTheme = '';
    let audioContext;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.error('Web Audio API is not supported in this browser');
    }

    class Sound {
        constructor(context) {
            this.context = context;
        }

        init() {
            this.oscillator = this.context.createOscillator();
            this.gainNode = this.context.createGain();

            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.context.destination);
            this.oscillator.type = 'sine';
        }

        play(value, time) {
            this.init();

            this.oscillator.frequency.value = value;
            this.gainNode.gain.setValueAtTime(1, this.context.currentTime);

            this.oscillator.start(time);
            this.stop(time);
        }

        stop(time) {
            this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
            this.oscillator.stop(time + 0.5);
        }
    }

    const animalSounds = {
        '0': 'sounds/cat.mp3',
        '1': 'sounds/dog.mp3',
        '2': 'sounds/cow.mp3',
        '3': 'sounds/sheep.mp3',
        '4': 'sounds/horse.mp3',
        '5': 'sounds/pig.mp3'
    };

    const animalEmojis = ['🐱', '🐶', '🐮', '🐑', '🐴', '🐷'];
    const fruitEmojis = ['🍉', '🍇', '🍓', '🍊', '🍌', '🍍'];
    let idleAnimation;
    let sequence = [];
    let gameInProgress = false;
    let followMeTimeout;

    function startFollowMeGame() {
        gameInProgress = true;
        sequence = [];
        addNewStepToSequence();
        playSequence();
    }

    function addNewStepToSequence() {
        sequence.push(Math.floor(Math.random() * 6));
    }

    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                return;
            }
            const keyIndex = sequence[i];
            const keys = document.querySelectorAll('.piano-key');
            keys[keyIndex].classList.add('active');
            playSound(keyIndex);
            setTimeout(() => {
                keys[keyIndex].classList.remove('active');
            }, 500);
            i++;
        }, 1000);
    }

    function startIdleAnimation() {
        idleAnimation = setInterval(() => {
            const keys = document.querySelectorAll('.piano-key');
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            randomKey.classList.add('active');
            setTimeout(() => {
                randomKey.classList.remove('active');
            }, 500);
        }, 2000);
    }

    function stopIdleAnimation() {
        clearInterval(idleAnimation);
        clearTimeout(followMeTimeout);
    }

    function playSound(index) {
        stopIdleAnimation();
        if (currentTheme === 'fruits' && audioContext) {
            const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
            const note = new Sound(audioContext);
            const now = audioContext.currentTime;
            note.play(frequencies[index], now);
        } else if (currentTheme === 'animals') {
            const audio = new Audio(animalSounds[index]);
            audio.play();
        }
    }

    animalsBtn.addEventListener('click', () => {
        startGame('animals');
    });

    fruitsBtn.addEventListener('click', () => {
        startGame('fruits');
    });

    function startGame(theme) {
        currentTheme = theme;
        themeSelection.classList.add('hidden');
        pianoContainer.classList.remove('hidden');
        createPianoKeys(theme);
        startIdleAnimation();
    }

    function createPianoKeys(theme) {
        const colors = ['#ff4d4d', '#ffa54d', '#ffff4d', '#4dff4d', '#4d4dff', '#a54dff'];
        const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];

        for (let i = 0; i < 6; i++) {
            const key = document.createElement('div');
            key.classList.add('piano-key');
            key.style.backgroundColor = colors[i];

            const emojiSpan = document.createElement('span');
            emojiSpan.classList.add('emoji');
            emojiSpan.textContent = currentTheme === 'animals' ? animalEmojis[i] : fruitEmojis[i];
            key.appendChild(emojiSpan);

            pianoContainer.appendChild(key);

            key.addEventListener('mousedown', () => {
                key.classList.add('active');
                playSound(i);
            });

            key.addEventListener('mouseup', () => {
                key.classList.remove('active');
                clearTimeout(followMeTimeout);
                followMeTimeout = setTimeout(startFollowMeGame, 5000);
                startIdleAnimation();
            });

            key.addEventListener('mouseleave', () => {
                key.classList.remove('active');
            });
        }
    }
});