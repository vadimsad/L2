import { FIGURES, FIGURE_NAMES, GAMEBOARD_COLS, GAMEBOARD_ROWS } from "./constants.js";
import { getRandomElement, rotateMatrix } from "./utils.js";

export class Tetris {
    gameBoard = [];
    figure = null;

    constructor() {
        this.isGameOver = false;
        this.score = 0;
        this.generateGameBoard();
        this.generateFigure();
    }

    generateGameBoard() {
        this.gameBoard = new Array(GAMEBOARD_ROWS).fill().map(() => new Array(GAMEBOARD_COLS).fill(0));
    }

    generateFigure() {
        const figureName = getRandomElement(FIGURE_NAMES);
        const matrix = FIGURES[figureName];

        // Колонка и строка, на которых нужно отрисовать фигуру
        const col = GAMEBOARD_COLS / 2 - Math.floor(matrix.length / 2);
        const row = -2;

        this.figure = {
            name: figureName,
            matrix,
            row,
            col
        }
    }

    moveFigureDown(updateScore) {
        this.figure.row++;
        if (!this.isValidPosition()) {
            this.figure.row--;
            this.placeFigure(updateScore);
        }
    }

    moveFigureLeft() {
        this.figure.col--;
        if (!this.isValidPosition()) {
            this.figure.col++;
        }
    }

    moveFigureRight() {
        this.figure.col++;
        if (!this.isValidPosition()) {
            this.figure.col--;
        }
    }

    rotateFigure() {
        const originalMatrix = this.figure.matrix;
        this.figure.matrix = rotateMatrix(this.figure.matrix)

        if (!this.isValidPosition()) {
            this.figure.matrix = originalMatrix;
        }
    }

    isValidPosition() {
        const matrixSize = this.figure.matrix.length;

        for (let row = 0; row < matrixSize; row++) {
            for (let col = 0; col < matrixSize; col++) {
                const matrixCell = this.figure.matrix[row][col];
                if (!matrixCell) continue;
                if (this.isOutsideGameBoard(row, col)) return false;
                if (this.isCollides(row, col)) return false;
            }
        }

        return true;
    }

    isOutsideGameBoard(row, col) {
        return this.figure.col + col < 0 || this.figure.col + col >= GAMEBOARD_COLS || this.figure.row + row >= this.gameBoard.length;
    }

    isOutsideOfTopGameBoard(row) {
        return this.figure.row + row < 0;
    }

    isCollides(row, col) {
        return this.gameBoard[this.figure.row + row]?.[this.figure.col + col];
    }

    placeFigure(updateScore) {
        const matrixSize = this.figure.matrix.length;

        for (let row = 0; row < matrixSize; row++) {
            for (let col = 0; col < matrixSize; col++) {
                const matrixCell = this.figure.matrix[row][col];
                if (!matrixCell) continue;
                if (this.isOutsideOfTopGameBoard(row)) {
                    this.isGameOver = true;
                    return;
                }

                this.gameBoard[this.figure.row + row][this.figure.col + col] = this.figure.name;
            }
        }

        this.processFilledRows(updateScore);
        this.generateFigure();
    }

    processFilledRows(updateScore) {
        const filledRows = this.findFilledRows();
        this.removeRows(filledRows);

        this.score += this.getScore(filledRows.length);
        updateScore();
    }

    getScore(filledRowsQuantity) {
        if (filledRowsQuantity === 1) {
            return 100;
        } else if (filledRowsQuantity === 2) {
            return 300;
        } else if (filledRowsQuantity === 3) {
            return 700;
        } else if (filledRowsQuantity === 4) {
            return 1500;
        } else {
            return 0;
        }
    }

    findFilledRows() {
        const filledRows = [];

        for (let row = 0; row < GAMEBOARD_ROWS; row++) {
            if (this.gameBoard[row].every(cell => !!cell)) {
                filledRows.push(row);
            }
        }

        return filledRows;
    }

    removeRows(rows) {
        rows.forEach(row => this.dropRowsAbove(row))
    }

    dropRowsAbove(rowToDelete) {
        for (let row = rowToDelete; row > 0; row--) {
            this.gameBoard[row] = this.gameBoard[row - 1];
        }
        this.gameBoard[0] = new Array(GAMEBOARD_COLS).fill(0);
    }
}