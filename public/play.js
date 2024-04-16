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

class MathPuzzleSolver {
  constructor() {
      this.currentPuzzle = null;
      this.currentAnswer = '';
      this.score = 0;
      this.timer = null;
      this.timeLimit = 60; // seconds for each puzzle
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
          alert('You have completed all the puzzles!');
          this.resetGame();
      }
  }

  submitAnswer() {
      const userAnswer = document.getElementById('userAnswer').value.trim();
      if (userAnswer === this.currentAnswer) {
          this.score++;
          alert('Correct answer!');
      } else {
          alert('Wrong answer!');
      }
      this.updateScore(this.score);
      this.loadNextPuzzle();
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
}

const game = new MathPuzzleSolver();
document.addEventListener('DOMContentLoaded', () => game.init());