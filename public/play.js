const puzzles = [
    {
        question: '12 + 15',
        answer: '27'
    },
    {
        question: '34 - 8',
        answer: '26'
    },
    {
        question: '7 * 6',
        answer: '42'
    }
];

let ws;

function initWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  ws = new WebSocket(`${protocol}://${window.location.host}/ws`);  // Replace with your WebSocket URL
  ws.onopen = () => console.log('Connected to WebSocket');
  ws.onmessage = (message) => {
    const chatMessages = document.getElementById('chat-messages');
    const msgData = JSON.parse(message.data);
    const msgElement = document.createElement('div');
    msgElement.textContent = `${msgData.name}: ${msgData.message}`;
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
  };
  ws.onerror = (error) => console.log('WebSocket error:', error);
  ws.onclose = () => console.log('WebSocket connection closed');
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value;
  const msgData = { name: 'User', message: message }; // Replace 'User' with the actual user name if available
  ws.send(JSON.stringify(msgData));
  input.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    game.init();
  
    // Set up WebSocket connection
    initWebSocket();
  
    // Event listeners for game buttons
    document.getElementById('start-game').addEventListener('click', () => game.startGame());
    document.getElementById('show-hint').addEventListener('click', () => game.showHint());
    document.getElementById('reset-game').addEventListener('click', () => game.resetGame());
  
    // Event listener for the chat send button
    document.getElementById('send-message').addEventListener('click', sendMessage);
  });

class MathPuzzleSolver {
    constructor() {
        this.currentPuzzle = null;
        this.currentAnswer = '';
        this.score = 0;
        this.timer = null;
        this.timeLimit = 60;
        this.puzzleIndex = 0;
    }

    init() {
        document.querySelector('.btn-primary').addEventListener('click', () => this.startGame());
        document.querySelector('.btn-info').addEventListener('click', () => this.showHint());
        document.querySelector('.btn-danger').addEventListener('click', () => this.resetGame());
        this.updateScore(0);
    }

    startGame() {
        this.score = 0;
        this.updateScore(this.score);
        this.puzzleIndex = 0;
        this.loadNextPuzzle();
        this.startTimer();
    }

    loadNextPuzzle() {
        if (this.puzzleIndex < puzzles.length) {
            const puzzle = puzzles[this.puzzleIndex++];
            this.currentPuzzle = puzzle.question;
            this.currentAnswer = puzzle.answer;

            const puzzleContainer = document.getElementById('puzzle-container');
            puzzleContainer.innerHTML = `<h2>Solve the puzzle: ${this.currentPuzzle}</h2>`;
            puzzleContainer.innerHTML += '<input type="text" id="userAnswer"><button onclick="game.submitAnswer()">Submit</button>';
        } else {
            this.saveScore(this.score);
            alert('You have completed all the puzzles!');
            this.resetGame();
        }
    }

    submitAnswer() {
        const userAnswer = document.getElementById('userAnswer').value.trim();
        if (userAnswer === this.currentAnswer) {
            this.score++;
            alert('Correct answer!');
            this.updateScore(this.score);
            this.loadNextPuzzle();
        } else {
            alert('Wrong answer!');
        }
    }

    showHint() {
        alert(`Hint: The answer is ${this.currentAnswer}`);
    }

    resetGame() {
        clearInterval(this.timer);
        this.timer = null;
        this.score = 0;
        this.updateScore(this.score);
        const puzzleContainer = document.getElementById('puzzle-container');
        puzzleContainer.innerHTML = '<p>Game reset. Click start to play again!</p>';
    }

    startTimer() {
        this.timeLimit = 60; // reset timer to 60 seconds
        const timerElement = document.getElementById('timer');
        const updateTimer = () => {
            if (this.timeLimit > 0) {
                const minutes = Math.floor(this.timeLimit / 60);
                const seconds = this.timeLimit % 60;
                timerElement.textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                this.timeLimit--;
            } else {
                clearInterval(this.timer);
                this.saveScore(this.score);
                alert('Time is up! Game over.');
                this.resetGame();
            }
        };
        updateTimer();
        this.timer = setInterval(updateTimer, 1000);
    }

    updateScore(score) {
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${score}`;
        }
    }

    async saveScore(score) {
        const userName = localStorage.getItem('userName') || 'Guest';
        const date = new Date().toLocaleDateString();
        const newScore = { name: userName, score: score, date: date };

        try {
            const response = await fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newScore)
            });

            const scores = await response.json();
            localStorage.setItem('scores', JSON.stringify(scores));
            console.log('Score saved to server:', scores);
        } catch (error) {
            console.error('Failed to save score:', error);
            this.updateScoresLocal(newScore);
        }
    }

    updateScoresLocal(newScore) {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push(newScore);
        localStorage.setItem('scores', JSON.stringify(scores));
        console.log('Score updated locally:', scores);
    }
}

const game = new MathPuzzleSolver();