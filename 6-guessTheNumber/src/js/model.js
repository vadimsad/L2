import { MESSAGES, DEFAULT_MIN_NUMBER, DEFAULT_MAX_NUMBER, DEFAULT_MAX_ATTEMPTS } from "./constants.js";

export default class Model {
    constructor(minNumber = DEFAULT_MIN_NUMBER, maxNumber = DEFAULT_MAX_NUMBER, maxAttempts = DEFAULT_MAX_ATTEMPTS) {
        this.isWin = false;
        this.attempts = 0;
        this.minNumber = minNumber;
        this.maxNumber = maxNumber;
        this.maxAttempts = maxAttempts;
        this.targetNumber = Model.getRandomNumber(this.minNumber, this.maxNumber);

        this.WIN_MESSAGE = MESSAGES.WIN;
        this.LESS_THAN_CURRENT_MESSAGE = MESSAGES.LESS_THAN_CURRENT;
        this.GREATER_THAN_CURRENT_MESSAGE = MESSAGES.GREATER_THAN_CURRENT;
        this.OUT_OF_BOUNDARIES_MESSAGE = MESSAGES.OUT_OF_BOUNDARIES(this.minNumber, this.maxNumber);
    }

    checkGuess(number) {
        this.attempts++;

        if (+number === this.targetNumber) {
            this.isWin = true;
            return this.WIN_MESSAGE;
        } else if (number > this.targetNumber) {
            return this.LESS_THAN_CURRENT_MESSAGE;
        } else {
            return this.GREATER_THAN_CURRENT_MESSAGE;
        }
    }

    isTargetNumberEven() {
        return this.targetNumber % 2 === 0;
    }

    static getRandomNumber(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    static isNumber(number) {
        return !isNaN(parseInt(number));
    }
}