import { Column } from "./column.js";

export class Chart {
    _numbersCount = 0;
    _sortingMeta = { inProgress: false, inPause: false, speed: 50 };
    _sortingFunction = null;
    _savedSortVars = {
        i: 0,
        j: 0,
        k: 0
    };

    constructor(container, numbersCount, options, defaultOption = options[0]) {
        this._numbersCount = numbersCount;
        this.container = container;
        this._sortingFunction = defaultOption.function;
        this.columnsValues = this.generateColumnsValues(numbersCount);
        this.columns = this.generateColumns(this.container, this.columnsValues);
        this._createSelectOptions('algorithm', options);
    }

    _createSelectOptions(selectElementId, options) {
        const selectElement = document.getElementById(selectElementId);
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.name;

            selectElement.append(optionElement);
        })
    }

    generateColumnsValues(maxNumber) {
        const values = [];

        for (let i = 1; i <= maxNumber; i++) {
            values.push(i);
        }

        return this.shuffleValues(values);
    }

    generateColumns(container, values) {
        const columns = [];

        values.forEach(value => {
            columns.push(new Column(container, value, this._numbersCount));
        });

        return columns;
    }

    startSort(onSortingDone) {
        if (!this._sortingMeta.inProgress) {
            this._sortingMeta.inProgress = true;
            this.sort(onSortingDone);
        }
    }

    finishSort(onSortingDone) {
        this.finalBlink();
        onSortingDone();
    }

    pauseSort() {
        this._sortingMeta.inProgress = false;
    }

    sort(onSortingDone) {
        this._sortingFunction(this.columns, this._sortingMeta, this._savedSortVars, this.finishSort.bind(this, onSortingDone));
    }

    shuffleValues(values) {
        return values.sort(() => Math.random() - 0.5);
    }

    resetColumns() {
        this._updateColumns(this._numbersCount);
    }

    finalBlink() {
        this.columns.forEach(column => column.blink())
    }

    _updateColumns(value) {
        this.container.innerHTML = '';
        this.columnsValues = this.generateColumnsValues(value);
        this.columns = this.generateColumns(this.container, this.columnsValues);
    }

    set sortingFunction(value) {
        this._sortingFunction = value;
        this._savedSortVars = {
            i: 0,
            j: 0,
            someVar: 0
        }
    }

    set numbersCount(value) {
        this._numbersCount = value;
        this._updateColumns(value);
    }

    set sortingSpeed(value) {
        this._sortingMeta.speed = value;
    }

    get isSorting() {
        return this._sortingMeta.inProgress;
    }

    get numbersCount() {
        return this._numbersCount;
    }
}