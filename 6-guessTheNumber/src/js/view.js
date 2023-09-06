import { DOM_IDS } from "./constants.js";

export default class View {
    constructor() {
        this.hintTimer = null;
    }

    // Метод для обновления текста любого DOM элемента
    updateElementText(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
        }
    }

    // Метод для очистки поля ввода
    clearInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
        }
    }

    // Метод для вывода очередной попытки на экран
    saveAttempt(number) {
        const attemptsBlock = document.getElementById(DOM_IDS.ATTEMPTS_ITEMS);
        if (attemptsBlock) {
            const historyItem = document.createElement('div');
            historyItem.textContent = +number;
            attemptsBlock.append(historyItem);
        }
    }

    // Метод для очистки истории всех попыток
    clearAttempts() {
        const attemptsBlock = document.getElementById(DOM_IDS.ATTEMPTS_ITEMS);
        if (attemptsBlock) {
            attemptsBlock.innerHTML = '';
        }
    }

    // Метод для обновления значения счетчика попыток
    updateAttemptsCount(attemptsCount) {
        const attemptsCountBlock = document.getElementById(DOM_IDS.ATTEMPTS_COUNT);
        if (attemptsCountBlock) {
            attemptsCountBlock.textContent = `Ваши попытки (${attemptsCount}): `;
        }
    }

    showHint(text) {
        const hintElement = document.getElementById(DOM_IDS.HINT);
        if (hintElement && !hintElement.classList.contains('visible')) {
            hintElement.textContent = text;
            hintElement.classList.add('visible');
            this.hintTimer = setTimeout(() => {
                hintElement.classList.remove('visible');
            }, 3000)
        }
    }

    hideHint() {
        const hintElement = document.getElementById(DOM_IDS.HINT);
        if (hintElement && hintElement.classList.contains('visible')) {
            hintElement.classList.remove('visible');

            if (this.hintTimer) {
                clearTimeout(this.hintTimer);
            }
        }
    }
}