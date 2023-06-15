import './style.css'

// Deklarowanie zmiennych
let gameBoard = document.getElementById('game-board');
let currentPlayerDisplay = document.getElementById('currentPlayer');
let cards = [];
let flippedCards = [];
let score = 0;
let scoreRed = 0;
let scoreBlue = 0;
let currentPlayer = 1;
let canFlip = true;

// Generowanie wartości karty
function generateCardValues(numPairs) {
    let values = [];
    for (let i = 1; i <= numPairs; i++) {
        values.push(i);
        values.push(i);
    }
    return shuffleArray(values);
}

// Mieszanie tablicy
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Tworzenie tablicy z kartami
async function createGameBoard() {
    let numRowsInput = document.getElementById('rows');
    let numColsInput = document.getElementById('cols');
    let numRows = parseInt(numRowsInput.value);
    let numCols = parseInt(numColsInput.value);
    if (numRows < 2 || numCols < 2 || (numRows * numCols) % 2 !== 0) {
        alert('Błąd w ustawieniach gry.');
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

// Obsługa kliknięcia karty
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

// Sprawdzanie dopasowania pary kart
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

// Koniec gry
function endGame() {
    let message = 'Gra zakończona!'
    if (scoreRed == scoreBlue) {
        message += 'Remis!';
    }
    else if (scoreRed > scoreBlue) {
        message += '1 gracz wygrał!';
    }
    else {
        message += '2 gracz wygrał!';
    }
    alert(message);
}

// Inicjalizacja gry
window.startGame = async function startGame() {
    let startButton = document.querySelector('button');
    startButton.disabled = true;
    currentPlayerDisplay.textContent = currentPlayer;
    await createGameBoard();
}
