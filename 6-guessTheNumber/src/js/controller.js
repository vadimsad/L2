import { DOM_IDS } from "./constants.js";
import Model from "./model.js";

export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    // Функция для обработки пользовательского ввода
    handleGuess(number) {
        // Если введенное значение не является числом, выводим предупреждение
        if (!Model.isNumber(number)) {
            this.view.updateElementText(DOM_IDS.MESSAGE, 'Введите корректное число');
            return;
        }

        // Узнаем, находится ли введенное число внутри диапазона 
        const isWithinBoundaries = number >= this.model.minNumber && number <= this.model.maxNumber;

        // Если число выходит за пределы диапазона, выводим предупреждение
        if (!isWithinBoundaries) {
            this.view.updateElementText(DOM_IDS.MESSAGE, this.model.OUT_OF_BOUNDARIES_MESSAGE);
            return;
        }

        const guessResult = this.model.checkGuess(number);
        // Узнаем, является ли текущая попытка третьей по счету
        const isThirdAttempt = this.model.attempts % 3 === 0;

        // Обновляем DOM элементы
        this.view.updateElementText(DOM_IDS.MESSAGE, guessResult);
        this.view.saveAttempt(number);
        this.view.updateAttemptsCount(this.model.attempts);
        this.view.clearInput(DOM_IDS.GUESS_INPUT);

        // В случае победы блокируем отправку новых попыток
        if (this.model.isWin) {
            this.disableInput();
        }
        // В случае, если это третья неудачная попытка, показываем подсказку
        else if (isThirdAttempt) {
            this.view.showHint(`Загаданное число ${this.model.isTargetNumberEven() ? 'четное' : 'нечетное'}`)
        }

    }

    // Метод для перезапуска игры
    restartGame(minNumber, maxNumber) {
        const isMinValid = Model.isNumber(minNumber);
        const isMaxValid = Model.isNumber(maxNumber);
        const isRangeValid = +minNumber < +maxNumber;

        if (!isMinValid || !isMaxValid || !isRangeValid) {
            this.view.updateElementText(DOM_IDS.MESSAGE, 'Введите корректный диапазон чисел');
            return;
        }

        // Создаем новый экземпляр модели, обнуляем все DOM элементы
        this.model = new Model(+minNumber, +maxNumber);
        this.view.updateElementText(DOM_IDS.MESSAGE, `Я загадал число от ${this.model.minNumber} до ${this.model.maxNumber}, попробуйте его отгадать`);
        this.view.updateElementText(DOM_IDS.ATTEMPTS_COUNT, '');
        this.view.clearAttempts();
        this.view.hideHint();
        this.view.updateElementText(DOM_IDS.HINT, '');
        this.view.clearInput();
        this.enableInput();
    }

    disableInput() {
        document.getElementById(DOM_IDS.GUESS_INPUT).disabled = true;
        document.getElementById(DOM_IDS.GUESS_SUBMIT).disabled = true;
    }

    enableInput() {
        document.getElementById(DOM_IDS.GUESS_INPUT).disabled = false;
        document.getElementById(DOM_IDS.GUESS_SUBMIT).disabled = false;
    }
}