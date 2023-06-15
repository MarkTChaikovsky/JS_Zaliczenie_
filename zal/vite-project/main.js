import './style.css'

// Оголошення змінних
let gameBoard = document.getElementById('game-board');
let currentPlayerDisplay = document.getElementById('currentPlayer');
let cards = [];
let flippedCards = [];
let score = 0;
let scoreRed = 0;
let scoreBlue = 0;
let currentPlayer = 1;
let canFlip = true;

// Генерація значень карток
function generateCardValues(numPairs) {
    let values = [];
    for (let i = 1; i <= numPairs; i++) {
        values.push(i);
        values.push(i);
    }
    return shuffleArray(values);
}

// Перемішування масиву
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Створення дошки з картками
async function createGameBoard() {
    let numRowsInput = document.getElementById('rows');
    let numColsInput = document.getElementById('cols');
    let numRows = parseInt(numRowsInput.value);
    let numCols = parseInt(numColsInput.value);
    if (numRows < 2 || numCols < 2 || (numRows * numCols) % 2 !== 0) {
        alert('Помилка в налаштуваннях гри.');
        return;
    }
    numRowsInput.disabled = true;
    numColsInput.disabled = true;
    let totalCards = numRows * numCols;
    let cardValues = generateCardValues(totalCards / 2);
    gameBoard.style.setProperty('--numRows', numRows);
    gameBoard.style.setProperty('--numCols', numCols);
    for (let i = 0; i < totalCards; i++) {
        let card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = cardValues[i];
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    }
}

// Обробник кліку на картку
function flipCard() {
    if (!canFlip || flippedCards.includes(this) || this.classList.contains('matched')) {
        return;
    }
    this.textContent = this.dataset.value;
    flippedCards.push(this);
    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 1000);
    }
}

// Перевірка на збіг пари карток
function checkMatch() {
    let card1 = flippedCards[0];
    let card2 = flippedCards[1];
    if (card1.dataset.value === card2.dataset.value) {
        if (currentPlayer == 1) {
            scoreRed++;  
        }
        else {
            scoreBlue++;
        }
        card1.classList.add('matched');
        card2.classList.add('matched');
        score++;
        console.log(score);
        if (score === cards.length / 2) {
            endGame();
        }
        else {
            // currentPlayer = currentPlayer === 1 ? 2 : 1;
            // currentPlayerDisplay.textContent = currentPlayer;
            canFlip = true;
            flippedCards = [];
        }
    } else {
        card1.textContent = '';
        card2.textContent = '';
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerDisplay.textContent = currentPlayer;
        canFlip = true;
        flippedCards = [];
    }
}

// Завершення гри
function endGame() {
    let message = 'Гра завершена!'
    if (scoreRed == scoreBlue) {
        message += 'Нічия!';
    }
    else if (scoreRed > scoreBlue) {
        message += 'Переміг 1 гравець!';
    }
    else {
        message += 'Переміг 2 гравець!';
    }
    alert(message);
}

// Ініціалізація гри
window.startGame = async function startGame() {
    let startButton = document.querySelector('button');
    startButton.disabled = true;
    currentPlayerDisplay.textContent = currentPlayer;
    await createGameBoard();
}
