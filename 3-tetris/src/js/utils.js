import { GAMEBOARD_COLS } from "./constants.js";

export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getCellIndexByPosition(row, col) {
    return row * GAMEBOARD_COLS + col;
}

export function rotateMatrix(matrix) {
    const rotatedMatrix = [];

    for (let row = 0; row < matrix.length; row++) {
        rotatedMatrix[row] = [];
        for (let col = 0; col < matrix.length; col++) {
            rotatedMatrix[row][col] = matrix[matrix.length - col - 1][row]
        }
    }

    return rotatedMatrix;
}