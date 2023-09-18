import { GAMEBOARD_COLS, GAMEBOARD_ROWS } from "./constants.js";
import { Tetris } from "./tetris.js";
import { getCellIndexByPosition } from "./utils.js";

let lastX;
let lastY;
let timeoutId;
let requestId;
let tetris;
const threshold = 20;
const cells = document.querySelectorAll('.cell');
const gameWrapper = document.querySelector('.game-wrapper');
const scoreBlock = document.querySelector('.score');
const gameStatusBlock = document.querySelector('.game-status');
const restartButton = document.querySelector('.restart');

setEventListeners();

startGame();

function update() {
    cells.forEach(cell => cell.dataset.figure = '');
    updateGameBoard();
    drawFigure();
}

function updateGameBoard() {
    for (let row = 0; row < GAMEBOARD_ROWS; row++) {
        for (let col = 0; col < GAMEBOARD_COLS; col++) {
            const cell = tetris.gameBoard[row][col];
            if (!cell) continue;

            const cellIndex = getCellIndexByPosition(row, col);
            cells[cellIndex].dataset.figure = cell;
        }
    }
}

function updateScore() {
    scoreBlock.textContent = 'Счет: ' + tetris.score;
}

function drawFigure() {
    const { name, matrix, row: figureRow, col: figureCol } = tetris.figure;

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix.length; col++) {
            const matrixCell = matrix[row][col];

            if (!matrixCell) continue;
            if (figureRow + row < 0) continue;

            const cellIndex = getCellIndexByPosition(figureRow + row, figureCol + col);
            cells[cellIndex].dataset.figure = name;
        }
    }
}

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowDown': {
            moveDown();
            break;
        }
        case 'ArrowLeft': {
            moveLeft();
            break;
        }
        case 'ArrowRight': {
            moveRight();
            break;
        }
        case 'ArrowUp': {
            rotate();
            break;
        }
        default: {
            break;
        }
    }
}

function moveDown() {
    tetris.moveFigureDown(updateScore);
    update();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
}

function moveLeft() {
    tetris.moveFigureLeft();
    update();
}

function moveRight() {
    tetris.moveFigureRight();
    update();
}

function rotate() {
    tetris.rotateFigure();
    update();
}

function startLoop() {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700)
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}

function gameOver() {
    stopLoop();
    gameWrapper.classList.add('game-over');
    gameStatusBlock.classList.add('shown');
    document.removeEventListener('keydown', onKeyDown);
}

function startGame() {
    tetris = new Tetris();

    document.addEventListener('keydown', onKeyDown);

    moveDown();

    scoreBlock.textContent = 'Счет: ' + tetris.score;
    gameWrapper.classList.remove('game-over');
    gameStatusBlock.classList.remove('shown');
}

function setEventListeners() {
    restartButton.addEventListener('click', startGame);

    gameWrapper.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        lastX = touch.clientX;
        lastY = touch.clientY;
    })

    gameWrapper.addEventListener('touchmove', (event) => {
        event.preventDefault();

        const touch = event.touches[0];
        const deltaX = lastX - touch.clientX;
        const deltaY = lastY - touch.clientY;

        if (Math.abs(deltaX) >= threshold) {

            if (deltaX > 0) {
                moveLeft();
            } else {
                moveRight();
            }

            lastX = touch.clientX;
        }

        if (Math.abs(deltaY) >= threshold) {

            if (deltaY < 0) {
                moveDown();

                lastY = touch.clientY;
            }
        }
    })

    // Если устройство сенсорное
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
        gameWrapper.addEventListener('click', () => {
            rotate();
        })
    }
}