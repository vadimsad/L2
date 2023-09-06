export const MESSAGES = {
    WIN: 'Вы угадали!',
    LESS_THAN_CURRENT: 'Загаданное число меньше вашего',
    GREATER_THAN_CURRENT: 'Загаданное число больше вашего',
    OUT_OF_BOUNDARIES: (min, max) => `Число должно быть в диапазоне от ${min} до ${max}`,
}

export const DOM_IDS = {
    GUESS_FORM: 'guess-form',
    GUESS_INPUT: 'guess-input',
    GUESS_SUBMIT: 'guess-submit',
    ATTEMPTS_ITEMS: 'attempts-items',
    ATTEMPTS_COUNT: 'attempts-count',
    MESSAGE: 'message',
    HINT: 'hint',
    RESTART_BTN: 'restart',
    SETTINGS_BTN: 'settings',
    SETTINGS_MENU: 'settings-menu',
    MIN_NUMBER_INPUT: 'min-number-input',
    MAX_NUMBER_INPUT: 'max-number-input',
}

export const DEFAULT_MIN_NUMBER = 1;
export const DEFAULT_MAX_NUMBER = 100;
export const DEFAULT_MAX_ATTEMPTS = Infinity;