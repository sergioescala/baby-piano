document.addEventListener('DOMContentLoaded', () => {
    const pianoContainer = document.getElementById('piano-container');
    const currentTheme = 'animals';

    const animalSounds = {
        '0': 'sounds/cat.mp3',
        '1': 'sounds/dog.mp3',
        '2': 'sounds/cow.mp3',
        '3': 'sounds/sheep.mp3',
        '4': 'sounds/horse.mp3',
        '5': 'sounds/pig.mp3',
        '6': 'sounds/lion.mp3',
        '7': 'sounds/monkey.mp3',
        '8': 'sounds/duck.mp3'
    };

    const animalEmojis = ['🐱', '🐶', '🐮', '🐑', '🐴', '🐷', '🦁', '🐵', '🦆'];
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
        sequence.push(Math.floor(Math.random() * 9));
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
        const audio = new Audio(animalSounds[index]);
        audio.play();
    }

    createPianoKeys();
    startIdleAnimation();

    function createPianoKeys() {
        const colors = ['#ff4d4d', '#ffa54d', '#ffff4d', '#4dff4d', '#4d4dff', '#a54dff', '#ff4da5', '#4dffff', '#a5ff4d'];

        for (let i = 0; i < 9; i++) {
            const key = document.createElement('div');
            key.classList.add('piano-key');
            key.style.backgroundColor = colors[i];

            const emojiSpan = document.createElement('span');
            emojiSpan.classList.add('emoji');
            emojiSpan.textContent = animalEmojis[i];
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