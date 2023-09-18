export function getBestMove(boardInstance, maximizingPlayer, minimizingPlayer) {
    const board = boardInstance.getBoard();
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            const cell = board[i][j];

            if (cell.value === null) {
                cell.value = maximizingPlayer.symbol;
                const score = minimax(boardInstance, 0, false, maximizingPlayer, minimizingPlayer, -Infinity, Infinity);
                cell.value = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { i, j };
                }
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing, maximizingPlayer, minimizingPlayer, alpha, beta) {
    const result = board.checkWinner(board);

    if (result !== null) {
        if (result === maximizingPlayer.symbol) {
            return 10 - depth; // Выигрыш с учетом глубины
        } else if (result === minimizingPlayer.symbol) {
            return depth - 10; // Проигрыш с учетом глубины
        } else {
            return 0; // Ничья
        }
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < board.boardSize; i++) {
            for (let j = 0; j < board.boardSize; j++) {
                const cell = board.getBoard()[i][j];

                if (cell.value === null) {
                    cell.value = maximizingPlayer.symbol;
                    const score = minimax(board, depth + 1, false, maximizingPlayer, minimizingPlayer, alpha, beta);
                    cell.value = null;
                    bestScore = Math.max(score, bestScore);

                    // Обновление "альфа"
                    alpha = Math.max(alpha, bestScore);

                    // Проверка на отсечение
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < board.boardSize; i++) {
            for (let j = 0; j < board.boardSize; j++) {
                const cell = board.getBoard()[i][j];

                if (cell.value === null) {
                    cell.value = minimizingPlayer.symbol;
                    const score = minimax(board, depth + 1, true, maximizingPlayer, minimizingPlayer, alpha, beta);
                    cell.value = null;
                    bestScore = Math.min(score, bestScore);

                    // Обновление "бета"
                    beta = Math.min(beta, bestScore);

                    // Проверка на отсечение
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
}
