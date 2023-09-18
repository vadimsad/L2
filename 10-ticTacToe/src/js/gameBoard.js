import { getBestMove } from "./minimax.js";
import { AIPlayer, Player } from "./player.js";

export class GameBoard {
    player1 = null;
    player2 = null;
    nextMoveOwner = null;

    constructor(container, boardSize, savedData) {
        this.container = container;
        this.boardSize = boardSize;
        this.winCells = [];

        if (savedData !== null) {
            const { board, gameMode, nextMoveOwnerSymbol, player1, player2 } = savedData;
            this.gameMode = gameMode;
            this._board = board;

            // Из объектов создаем экземпляры классов Player
            this.player1 = player1.isHard === undefined ? new Player(player1.name, player1.symbol) : new AIPlayer(player1.name, player1.symbol, player1.isHard);
            this.player2 = player2.isHard === undefined ? new Player(player2.name, player2.symbol) : new AIPlayer(player2.name, player2.symbol, player2.isHard);
            this.players = [this.player1, this.player2];

            // Определяем, какой из игроков ходит следующим
            this.nextMoveOwner = this.players.find(player => player.symbol === nextMoveOwnerSymbol);
        } else {
            this.gameMode = 'friend';
            this._board = this.createBoard();
            this.createPlayers(this.gameMode);
            this.nextMoveOwner = Math.random() > 0.5 ? this.player1 : this.player2;
        }
    }

    createBoard() {
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

    createPlayers(gameMode) {
        switch (gameMode) {
            case 'friend': {
                this.player1 = new Player('Player-1', 'x');
                this.player2 = new Player('Player-2', 'o');
                break;
            };
            case 'ai-easy': {
                this.player1 = new Player('Player-1', 'x');
                this.player2 = new AIPlayer('Player-2', 'o', false);
                break;
            };
            case 'ai-hard': {
                this.player1 = new Player('Player-1', 'x');
                this.player2 = new AIPlayer('Player-2', 'o', true);
                break;
            };
        }
        this.players = [this.player1, this.player2];
    }

    start() {
        this.updateBoard();

        if (this.gameMode !== 'friend' && this.nextMoveOwner instanceof AIPlayer) {
            this.AImakeMove(this.gameMode === 'ai-hard');
        }
    }

    restart() {
        this._board = this.createBoard();
        this.createPlayers(this.gameMode);
        this.nextMoveOwner = Math.random() > 0.5 ? this.player1 : this.player2;
        this.start();
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
            const move = getBestMove(this, this.player2, this.player1);
            return this.makeMove(move.i, move.j);

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


