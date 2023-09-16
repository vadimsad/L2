import { Chart } from "./chart.js";
import { bubbleSort, insertionSort, mergeSort, quickSort, selectionSort } from "./sorting.js";

const wrapper = document.querySelector('.sort-chart');
const playButton = document.getElementById('play-button');
const resetButton = document.getElementById('shuffle-button');
const numbersCountInput = document.getElementById('numbers-count');
const algorithmSelect = document.getElementById('algorithm');
const speedInput = document.getElementById('speed');

const NUMBERS_COUNT = numbersCountInput.value;
const selectOptions = [
    {
        name: 'Сортировка пузырьком',
        value: 'bubble',
        function: bubbleSort,
    },
    {
        name: 'Сортировка вставками',
        value: 'insertion',
        function: insertionSort,
    },
    {
        name: 'Сортировка выбором',
        value: 'selection',
        function: selectionSort,
    },
    {
        name: 'Сортировка слиянием',
        value: 'merge',
        function: mergeSort,
    },
    {
        name: 'Быстрая сортировка',
        value: 'quick',
        function: quickSort,
    },
];

const chart = new Chart(wrapper, NUMBERS_COUNT, selectOptions);

wrapper.setAttribute('style', `grid-template-columns: repeat(${NUMBERS_COUNT}, 1fr)`);

playButton.addEventListener('click', () => {
    if (!chart.isSorting) {
        chart.startSort(resetInputs);

        disableInputs();
    } else {
        chart.pauseSort();

        resetInputs();
    }
});

resetButton.addEventListener('click', () => {
    chart.resetColumns();
});

numbersCountInput.addEventListener('change', (event) => {
    const newValue = event.target.value;
    chart.numbersCount = newValue;
    chart.sortingFunction = getSortFunctionByName(algorithmSelect.value)
    wrapper.setAttribute('style', `grid-template-columns: repeat(${chart.numbersCount}, 1fr)`);
    if (newValue >= 200) {
        wrapper.style.gap = '0';
    } else {
        wrapper.style.gap = '';
    }
});

algorithmSelect.addEventListener('change', (event) => {
    const sortFunctionName = event.target.value;
    chart.sortingFunction = getSortFunctionByName(sortFunctionName);
});

speedInput.addEventListener('change', (event) => {
    const sortingSpeed = event.target.value;
    chart.sortingSpeed = sortingSpeed;
});

function resetInputs() {
    playButton.classList.remove('pause');
    numbersCountInput.disabled = false;
    algorithmSelect.disabled = false;
    resetButton.disabled = false;
};

function disableInputs() {
    playButton.classList.add('pause');
    numbersCountInput.disabled = true;
    algorithmSelect.disabled = true;
    resetButton.disabled = true;
};

function getSortFunctionByName(name) {
    return selectOptions.find(option => option.value === name)?.function;
};