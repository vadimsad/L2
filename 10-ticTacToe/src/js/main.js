import { GameBoard } from "./gameBoard.js";
import { getFromLocalStorage, saveToLocalStorage } from "./localstorage.js";
import { AIPlayer, Player } from "./player.js";

const infoBlock = document.querySelector('.info');
const boardWrapper = document.querySelector('.board');
const restart = document.querySelector('.restart');
const gameModeInputs = document.querySelectorAll('input[name="gamemode"]');

const savedData = getFromLocalStorage();

const BOARD_SIZE = savedData?.board?.boardSize || 3;

boardWrapper.style = `
    grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
    grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
`;

const board = new GameBoard(boardWrapper, BOARD_SIZE, savedData);

// Устанавливаем выбранный режим игры
gameModeInputs.forEach(input => input.id === board.gameMode ? input.checked = true : '');

// Начинаем новую игру
startNewGame(board.gameMode);

setEventListeners();

function startNewGame() {
    board.start();
    board.updateInfo(null, infoBlock);
}

function restartGame() {
    board.restart();
    board.updateInfo(null, infoBlock);
}

function paintWinnerCells(cells) {
    cells.forEach(cell => {
        const cellElement = boardWrapper.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`)
        cellElement.classList.add('win');
    })
}

function toggleGameBoard(toggleMode) {
    const cells = boardWrapper.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.disabled = toggleMode;
    })
}

function setEventListeners() {
    boardWrapper.addEventListener('click', (event) => {
        const isClickOnCell = event.target.classList.contains('cell');

        if (isClickOnCell) {
            const cellRow = event.target.dataset.row;
            const cellCol = event.target.dataset.col;

            const moveResult = board.makeMove(cellRow, cellCol);
            board.updateInfo(moveResult, infoBlock);

            if (moveResult !== null) {
                if (moveResult !== 'draw') {
                    paintWinnerCells(board.winCells);
                }
                toggleGameBoard(true);
            } else {
                saveToLocalStorage({
                    board: board.getBoard(),
                    gameMode: board.gameMode,
                    nextMoveOwnerSymbol: board.nextMoveOwner.symbol,
                    player1: board.player1,
                    player2: board.player2,
                })
            }
        }
    })

    restart.addEventListener('click', () => {
        restartGame(board.gameMode);
    })

    gameModeInputs.forEach(input => input.addEventListener('change', (event) => {
        const id = event.target.id;
        const checked = event.target.checked;

        if (checked) {
            board.gameMode = id;
            restartGame(board.gameMode);
        }
    }))
}