import { GameBoard } from "./gameBoard.js";
import { AIPlayer, Player } from "./player.js";

const BOARD_SIZE = 3;

const infoBlock = document.querySelector('.info');
const boardWrapper = document.querySelector('.board');
const restart = document.querySelector('.restart');
const gameModeInputs = document.querySelectorAll('input[name="gamemode"]');

boardWrapper.style = `
    grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
    grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
`;

const board = new GameBoard(boardWrapper, BOARD_SIZE);

// Устанавливаем выбранный режим игры
gameModeInputs.forEach(input => input.id === board.gameMode ? input.checked = true : '');

// Начинаем новую игру
startNewGame(board.gameMode);

boardWrapper.addEventListener('click', (event) => {
    const target = event.target;
    const isClickOnCell = target.classList.contains('cell');

    if (isClickOnCell) {
        const cellRow = target.dataset.row;
        const cellCol = target.dataset.col;

        const moveResult = board.makeMove(cellRow, cellCol);
        board.updateInfo(moveResult, infoBlock);

        if (moveResult !== null) {
            if (moveResult !== 'draw') {
                paintWinnerCells(board.winCells);
            }
            toggleGameBoard(true);
        }
    }
})

restart.addEventListener('click', () => {
    startNewGame(board.gameMode);
})

gameModeInputs.forEach(input => input.addEventListener('change', (event) => {
    const id = event.target.id;
    const checked = event.target.checked;

    if (checked) {
        board.gameMode = id;
        startNewGame(board.gameMode);
    }
}))

function startNewGame(gameMode) {
    let player1, player2;

    switch (gameMode) {
        case 'friend': {
            player1 = new Player('Player-1', 'x');
            player2 = new Player('Player-2', 'o');
            break;
        };
        case 'ai-easy': {
            player1 = new Player('Player-1', 'x');
            player2 = new AIPlayer('Player-2', 'o');
            break;
        };
        case 'ai-hard': {
            player1 = new Player('Player-1', 'x');
            player2 = new AIPlayer('Player-2', 'o', true);
            break;
        };
    }

    board.restartGame(player1, player2);
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