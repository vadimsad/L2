const KEY = 'tic-tac-toe';

export function saveToLocalStorage(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function getFromLocalStorage() {
    try {
        const data = JSON.parse(localStorage.getItem(KEY))
        return data;
    } catch (error) {
        console.warn(error);
        return null;
    }
}