import { AIPlayer, Player } from "./player.js";

export class GameBoard {
    player1 = null;
    player2 = null;
    nextMoveOwner = null;

    constructor(container, boardSize = 3, gameMode = 'friend') {
        this.container = container;
        this.boardSize = boardSize;
        this.winCells = [];
        this.gameMode = gameMode;
        this._board = this._createBoard();
    }

    _createBoard() {
        const board = [];

        for (let row = 0; row < this.boardSize; row++) {
            const currentRow = [];

            for (let col = 0; col < this.boardSize; col++) {
                currentRow.push(new Cell(row, col));
            }

            board.push(currentRow);
        }

        return board;
    }

    startGame(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.players = [player1, player2];

        this.nextMoveOwner = Math.random() > 0.5 ? player1 : player2;

        this.updateBoard();

        if (this.gameMode !== 'friend' && this.nextMoveOwner instanceof AIPlayer) {
            this.AImakeMove(this.gameMode === 'ai-hard');
        }
    }

    restartGame(player1, player2) {
        this._board = this._createBoard();
        this.startGame(player1, player2);
    }

    makeMove(row, col) {
        const cell = this._board[row][col];

        // Если в ячейке уже есть значение, возвращаем null, игра продолжается
        if (cell.value) {
            return null;
        }

        cell.value = this.nextMoveOwner.symbol;

        // Циклически обходим массив с игроками и назначаем следующий ход
        this.nextMoveOwner = this.players[(this.players.indexOf(this.nextMoveOwner) + 1) % this.players.length];

        this.updateBoard();

        const moveResult = this.checkWinner(this);

        // Если игра завершилась, возвращаем moveResult (null)
        if (moveResult !== null) {
            return moveResult;
        }

        // Если играем с компьютером и текущий ход его, делаем его ход
        if (this.gameMode !== 'friend' && this.nextMoveOwner instanceof AIPlayer) {
            return this.AImakeMove(this.gameMode === 'ai-hard');
        }

        return moveResult
    }

    AImakeMove(isHardMode) {

        if (isHardMode) {
            // Реализация алгоритма минимакса для сложного режима

        } else {
            // Рандомный ход для простого режима
            const emptyCells = this.getEmptyCells();
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const { row, col } = emptyCells[randomIndex];

            const moveResult = this.makeMove(row, col);
            return moveResult;
        }
    }

    // Функция возвращает:
    // {player.symbol} - победитель
    // 'draw' - ничья
    // null - игра продолжается
    checkWinner(board) {
        const symbolsToWin = board.boardSize;

        // Проверка горизонтальных, вертикальных и диагональных линий
        const checkLines = (lines) => {
            for (const line of lines) {
                let currentSymbol = null;
                let consecutiveCells = [];

                for (const [row, col] of line) {
                    const cell = board._board[row][col];

                    if (cell.value === null) {
                        continue;
                    }

                    if (cell.value !== currentSymbol) {
                        currentSymbol = cell.value;
                        consecutiveCells = [];
                    }

                    consecutiveCells.push(cell);

                    if (consecutiveCells.length === symbolsToWin) {
                        board.winCells = consecutiveCells;
                        return currentSymbol;
                    }
                }

            }
            return null;
        };

        const horizontalLines = [];
        const verticalLines = [];
        const diagonalLines = [];

        // Горизонтальные линии
        for (let row = 0; row < board.boardSize; row++) {
            const line = [];
            for (let col = 0; col < board.boardSize; col++) {
                line.push([row, col]);
            }
            horizontalLines.push(line);
        }

        // Вертикальные линии
        for (let col = 0; col < board.boardSize; col++) {
            const line = [];
            for (let row = 0; row < board.boardSize; row++) {
                line.push([row, col]);
            }
            verticalLines.push(line);
        }

        // Диагональные линии (сверху вниз)
        for (let startRow = 0; startRow <= board.boardSize - symbolsToWin; startRow++) {
            for (let startCol = 0; startCol <= board.boardSize - symbolsToWin; startCol++) {
                const line = [];
                for (let i = 0; i < symbolsToWin; i++) {
                    line.push([startRow + i, startCol + i]);
                }
                diagonalLines.push(line);
            }
        }

        // Диагональные линии (снизу вверх)
        for (let startRow = board.boardSize - 1; startRow >= symbolsToWin - 1; startRow--) {
            for (let startCol = 0; startCol <= board.boardSize - symbolsToWin; startCol++) {
                const line = [];
                for (let i = 0; i < symbolsToWin; i++) {
                    line.push([startRow - i, startCol + i]);
                }
                diagonalLines.push(line);
            }
        }

        // Проверка всех линий
        const winner = checkLines([...horizontalLines, ...verticalLines, ...diagonalLines]);

        if (winner === null && board.getEmptyCells().length === 0) {
            return 'draw';
        }

        return winner;
    }

    updateInfo(moveResult, infoBlock) {
        if (moveResult === null) {
            infoBlock.textContent = `Сейчас ход: ${this.nextMoveOwner.symbol}`;
        } else if (moveResult === 'draw') {
            infoBlock.textContent = `Ничья`;
        } else {
            infoBlock.textContent = `Победил ${moveResult}`;
        }
    }

    updateBoard() {
        if (!this.container) return;

        this.container.innerHTML = '';
        this._board.flat().forEach(cell => {
            const cellElement = document.createElement('button');
            const cellInner = document.createElement('span');
            cellElement.className = 'cell';
            cellElement.type = 'button';
            cellElement.dataset.row = cell.row;
            cellElement.dataset.col = cell.col;

            if (cell.value) {
                cellInner.textContent = cell.value;
            }

            cellElement.append(cellInner);
            this.container.append(cellElement);
        });
    }

    getBoard() {
        return this._board;
    }

    getEmptyCells() {
        return this._board.flat().filter(cell => cell.value === null);
    }

}

class Cell {
    constructor(row, col, value = null) {
        this.row = row;
        this.col = col;
        this.value = value;
    }
}


