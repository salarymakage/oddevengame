// DOM Elements
const registerScreen = document.getElementById('register-screen');
const gameScreen = document.getElementById('game-screen');

const playerNameInput = document.getElementById('player-name');
const playerDisplay = document.getElementById('player-display');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const correctDisplay = document.getElementById('correct');
const wrongDisplay = document.getElementById('wrong');
const heartsDisplay = document.getElementById('hearts');
const timeDisplay = document.getElementById('time');
const questionDisplay = document.getElementById('question');

let playerName = '';
let score = 0;
let level = 1;
let correctAnswers = 0;
let wrongAnswers = 0;
let hearts = 3; // Start with 3 hearts
let timeLeft = 60; // Initial time in seconds
let currentAnswer = '';
let gameTimer;

// Start Game
function startGame() {
    playerName = playerNameInput.value.trim() || 'Player';
    playerDisplay.textContent = `Player: ${playerName}`;
    registerScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    resetGameVariables();
    updateDisplay();
    generateQuestion();
    startTimer();
}

// Reset Game Variables
function resetGameVariables() {
    score = 0;
    level = 1;
    correctAnswers = 0;
    wrongAnswers = 0;
    hearts = 3; // Reset to 3 hearts
    timeLeft = 60; // Start with 60 seconds
}

// Update Game Display
function updateDisplay() {
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    correctDisplay.textContent = correctAnswers;
    wrongDisplay.textContent = wrongAnswers;
    heartsDisplay.textContent = '❤️'.repeat(hearts);
    timeDisplay.textContent = `${timeLeft}s`;
}

// Start Countdown Timer
function startTimer() {
    clearInterval(gameTimer); // Clear any existing timer
    gameTimer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            handleTimeOut();
        }
    }, 1000);
}

// Handle Time Out
function handleTimeOut() {
    clearInterval(gameTimer);
    hearts--;

    if (hearts > 0) {
        timeLeft = Math.max(30, 60 - level * 5); // Reduce timer based on level, with a minimum of 30 seconds
        updateDisplay();
        startTimer(); // Restart timer with reduced time
    } else {
        endGame(); // Lose the game if hearts are zero
    }
}

// Generate a New Question Based on Level
function generateQuestion() {
    const { problem, answer } = createMathProblem();
    questionDisplay.innerHTML = `Is <br><span id="number">${problem}</span><br> odd or even?`;
    currentAnswer = answer;
}

// Create a Math Problem with Integer-only Division, Positive Results, and Level-based Complexity
function createMathProblem() {
    const operators = ['+', '-', '*', '/'];
    let numOperations = Math.min(3, level); // Increase operations as level goes up, max 3
    let terms = [];
    let result;

    do {
        terms = [getRandomInt(2, 50)]; // Start with a base number between 2 and 50

        for (let i = 0; i < numOperations; i++) {
            const operator = operators[getRandomInt(0, operators.length - 1)];
            let nextNum = getRandomInt(2, 50);

            // Ensure we only add valid operations that result in whole numbers
            if (operator === '/') {
                while (terms[terms.length - 1] % nextNum !== 0) {
                    nextNum = getRandomInt(2, 50); // Regenerate to avoid non-integer results
                }
            }

            terms.push(operator);
            terms.push(nextNum);
        }

        result = evaluateExpression(terms);
    } while (result <= 0 || !Number.isInteger(result)); // Ensure positive integer results

    const problem = terms.join(' ');
    const answer = result % 2 === 0 ? 'even' : 'odd';
    return { problem, answer };
}

// Evaluate Expression in Array Form (PEMDAS)
function evaluateExpression(terms) {
    let stack = [];

    // Perform * and / operations first
    for (let i = 0; i < terms.length; i++) {
        if (terms[i] === '*') {
            let last = stack.pop();
            stack.push(last * terms[++i]);
        } else if (terms[i] === '/') {
            let last = stack.pop();
            stack.push(last / terms[++i]);
        } else {
            stack.push(terms[i]);
        }
    }

    // Perform + and - operations
    let result = stack[0];
    for (let i = 1; i < stack.length; i += 2) {
        const operator = stack[i];
        const next = stack[i + 1];
        if (operator === '+') result += next;
        else if (operator === '-') result -= next;
    }

    return result;
}

// Submit Answer
function submitAnswer(answer) {
    if (answer === currentAnswer) {
        score += 10;
        correctAnswers++;
        timeLeft += 5; // Add 5 seconds for a correct answer
        if (correctAnswers % 5 === 0) levelUp();
    } else {
        wrongAnswers++;
        timeLeft -= 15; // Subtract 15 seconds for a wrong answer
    }

    if (timeLeft <= 0) {
        handleTimeOut();
    } else {
        updateDisplay();
        generateQuestion();
    }
}

// Level Up Function
function levelUp() {
    level++;
    timeLeft = Math.max(30, 60 - level * 5); // Set time based on level, min 30 seconds
    generateQuestion();
    startTimer();
}

// End Game Function with Custom Popup
function endGame() {
  clearInterval(gameTimer);

  // Set the popup content with player stats
  document.getElementById('end-game-message').textContent = `Game Over, ${playerName}!`;
  document.getElementById('end-game-score').textContent = `Score: ${score}`;
  document.getElementById('end-game-correct').textContent = `Correct Answers: ${correctAnswers}`;
  document.getElementById('end-game-wrong').textContent = `Wrong Answers: ${wrongAnswers}`;

  // Hide other elements like school info
  document.querySelector('.school-info').style.display = 'none';

  // Show the end game popup
  document.getElementById('end-game-popup').style.display = 'flex';
}

// Restart Game Function
function restartGame() {
  document.getElementById('end-game-popup').style.display = 'none';
  document.querySelector('.school-info').style.display = 'block'; // Show school info again
  registerScreen.style.display = 'block';
  gameScreen.style.display = 'none';
  resetGameVariables();
}



// Utility Function to Get Random Integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
