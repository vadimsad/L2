export class Column {
    _number = 0;
    _timerBlink = null;

    constructor(container, number, maxNumber) {
        this._maxNumber = maxNumber;

        this.column = document.createElement('div');
        this.line = document.createElement('div');
        this.lineValue = document.createElement('div');
        this.lineNumber = document.createElement('div');

        this.number = number;

        this.column.classList.add('chart-item');
        this.line.classList.add('chart-line');
        this.lineValue.classList.add('chart-value');
        this.lineNumber.classList.add('chart-number');

        this.line.append(this.lineValue);
        this.column.append(this.line);
        this.column.append(this.lineNumber);
        container.append(this.column);
    }

    setStatus(status) {
        this.resetStatus()
        this.lineValue.classList.add(status)
        if (status == 'greater') this.blink()
    }

    resetStatus(status) {
        if (status === undefined) {
            this.lineValue.classList.remove('greater');
            this.lineValue.classList.remove('less');
            this.lineValue.classList.remove('current');
        } else {
            this.lineValue.classList.remove(status);
        }
    }

    blink() {
        this.lineValue.classList.remove('blink');
        clearTimeout(this._timerBlink);
        this.lineValue.classList.add('blink');
        this._timerBlink = setTimeout(() => {
            this.lineValue.classList.remove('blink');
        }, 500)
    }

    set number(value) {
        this._number = value;
        this.lineValue.style.height = value * 100 / this._maxNumber + '%';

        if (this._maxNumber <= 50) {
            this.lineNumber.textContent = value;
        }
    }

    get number() {
        return this._number;
    }
}