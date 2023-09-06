import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
import { DOM_IDS } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameModel = new Model();
    const gameView = new View();
    const gameController = new Controller(gameModel, gameView);

    const restartButton = document.getElementById(DOM_IDS.RESTART_BTN);
    const settingsButton = document.getElementById(DOM_IDS.SETTINGS_BTN);
    const settingsMenu = document.getElementById(DOM_IDS.SETTINGS_MENU);
    const minNumberInput = settingsMenu.querySelector(`#${DOM_IDS.MIN_NUMBER_INPUT}`);
    const maxNumberInput = settingsMenu.querySelector(`#${DOM_IDS.MAX_NUMBER_INPUT}`);
    const guessForm = document.getElementById(DOM_IDS.GUESS_FORM);

    guessForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const inputValue = document.getElementById(DOM_IDS.GUESS_INPUT).value;
        gameController.handleGuess(inputValue);
    })

    settingsButton.addEventListener('click', () => {
        settingsButton.classList.toggle('active');
        settingsMenu.classList.toggle('visible');
    })

    restartButton.addEventListener('click', () => {
        gameController.restartGame(minNumberInput.value, maxNumberInput.value);
    })
})