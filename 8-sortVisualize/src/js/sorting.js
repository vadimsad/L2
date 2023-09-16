const MAX_DELAY = 500;

const delay = async (ms) => new Promise(res => setTimeout(res, ms));

function calculateDelayBySpeed(speed) {
    return MAX_DELAY * (1 - speed / 100);
}

export async function bubbleSort(columns, sortingMeta, savedVars, onSorted) {

    for (let i = savedVars.i; i < columns.length; i++) {

        let swapped = false;

        for (let j = i === savedVars.i ? savedVars.j : 0; j < columns.length - i - 1; j++) {
            const current = columns[j];
            const next = columns[j + 1];

            current.setStatus('current');
            next.setStatus('current');

            await delay(calculateDelayBySpeed(sortingMeta.speed));

            if (!sortingMeta.inProgress) {
                savedVars.i = i;
                savedVars.j = j;
                return;
            }

            if (current.number > next.number) {
                // Меняем местами
                const temp = current.number;
                current.number = next.number;
                next.number = temp;

                current.setStatus('less');
                next.setStatus('greater');

                swapped = true;

                await delay(calculateDelayBySpeed(sortingMeta.speed));
            }

            current.resetStatus();
            next.resetStatus();

            await delay(calculateDelayBySpeed(sortingMeta.speed));
        }

        if (!swapped && sortingMeta.inProgress) {
            break;
        }
    }

    onSorted();
    sortingMeta.inProgress = false;
}

export async function insertionSort(columns, sortingMeta, savedVars, onSorted) {
    for (let i = savedVars.i === 0 ? 1 : savedVars.i; i < columns.length; i++) {
        const currentElement = columns[i];
        let j = i === savedVars.i ? savedVars.j : i - 1;

        const currentNumber = i === savedVars.i ? savedVars.k : currentElement.number;

        currentElement.setStatus('current');
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Сдвигаем элементы, чтобы вставить текущий элемент на правильное место
        while (j >= 0 && columns[j].number > currentNumber) {

            columns[j + 1].number = columns[j].number;
            j--;

            columns[j + 1].setStatus('current')
            columns[j + 2].setStatus('greater');
            await delay(calculateDelayBySpeed(sortingMeta.speed));

            if (!sortingMeta.inProgress) {
                savedVars.i = i;
                savedVars.j = j;
                savedVars.k = currentNumber;
                return;
            }

            columns[j + 1].resetStatus();
            columns[j + 2].resetStatus();
        }

        // Вставляем текущий элемент на правильное место
        columns[j + 1].number = currentNumber;

        columns[j + 1].setStatus('greater');
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        if (!sortingMeta.inProgress) {
            savedVars.i = i;
            savedVars.j = j;
            savedVars.k = currentNumber;
            return;
        }

        currentElement.resetStatus();
        columns[j + 1].resetStatus();
    }

    onSorted();
    sortingMeta.inProgress = false;
}

export async function selectionSort(columns, sortingMeta, savedVars, onSorted) {
    for (let i = savedVars.i; i < columns.length; i++) {
        columns[i].setStatus('current');

        // let prevMinElement = null;
        let minElement = i === savedVars.i ? (columns.find(col => col === savedVars.k) || columns[i]) : columns[i];

        for (let j = i === savedVars.i ? savedVars.j : i + 1; j < columns.length; j++) {
            columns[j].setStatus('current');

            await delay(calculateDelayBySpeed(sortingMeta.speed));

            if (!sortingMeta.inProgress) {
                savedVars.i = i;
                savedVars.j = j;
                savedVars.k = minElement;
                return;
            }

            if (columns[j].number < minElement.number) {
                minElement.resetStatus('less');
                columns[j].setStatus('less');

                minElement = columns[j];

            }

            columns[j].resetStatus('current');
            columns[i].setStatus('current');
        }

        minElement.resetStatus();

        const temp = minElement.number;
        minElement.number = columns[i].number;
        columns[i].number = temp;

        columns[i].setStatus('greater');
        minElement.setStatus('greater');

        await delay(calculateDelayBySpeed(sortingMeta.speed));

        columns[i].resetStatus();
        minElement.resetStatus();
    }

    onSorted();
    sortingMeta.inProgress = false;
}

export async function mergeSort(columns, sortingMeta, savedVars, onSorted, origColumns, recursionLevel = 0) {
    sortingMeta.inPause = false;

    // Если массив состоит из одного или менее элементов, он считается отсортированным и возвращается без изменений
    if (columns.length <= 1 || !sortingMeta.inProgress) {
        return columns;
    }

    recursionLevel++;

    // Если origColumns не определен, используем columns как исходный массив
    if (!origColumns) {
        origColumns = columns
    }

    // Создаем копию исходного массива, чтобы изменения в левых и правых частях не влияли на оригинальный массив 
    const arrCopy = columns.map(a => ({ ...a }));

    // Находим середину массива и разделяем его на два подмассива: left и right
    const middle = Math.floor(arrCopy.length / 2);
    const left = arrCopy.slice(0, middle);
    const right = arrCopy.slice(middle);

    // Рекурсивно сортируем левый и правый подмассивы
    const sortedLeft = await mergeSort(left, sortingMeta, savedVars, onSorted, origColumns, recursionLevel);
    const sortedRight = await mergeSort(right, sortingMeta, savedVars, onSorted, origColumns, recursionLevel);

    // Вызываем функцию merge для объединения и сортировки левого и правого подмассивов

    const sorted = await merge(sortedLeft, sortedRight, origColumns, sortingMeta);

    // console.log(recursionLevel)

    // Если сортировка завершена
    if (recursionLevel === 1 && !sortingMeta.inPause) {
        onSorted();
        sortingMeta.inProgress = false;
    }

    return sorted;
}

async function merge(left, right, arr, sortingMeta) {

    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // Вычисляем размер блока для слияния
    const blockSize = left.length + right.length;

    // Находим начальный индекс блока в исходном массиве arr
    const blockStart = arr.indexOf(arr.find(col => col.number === left[0]._number));

    // Выделяем блок в исходном массиве
    const block = arr.slice(blockStart, blockSize + blockStart);

    while (leftIndex < left.length && rightIndex < right.length) {

        // Находим элементы, которые будут сравниваться
        const arrLeftItem = arr.find(col => col.number === left[leftIndex]._number);
        const arrRightItem = arr.find(col => col.number === right[rightIndex]._number);

        arrLeftItem.setStatus('current');
        arrRightItem.setStatus('current');

        await delay(calculateDelayBySpeed(sortingMeta.speed));

        arrLeftItem.resetStatus('current');
        arrRightItem.resetStatus('current');

        if (left[leftIndex]._number < right[rightIndex]._number) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {

            // Если элементы должны быть обменены, меняем их значения
            const arrLeftItem = arr.find(col => col.number === left[leftIndex]._number);
            const arrRightItem = arr.find(col => col.number === right[rightIndex]._number);

            arrRightItem.setStatus('less');
            arrLeftItem.setStatus('greater');

            await delay(calculateDelayBySpeed(sortingMeta.speed));

            arrRightItem.resetStatus();
            arrLeftItem.resetStatus();

            const temp = arrRightItem.number;
            arrRightItem.number = left[leftIndex]._number;
            arrLeftItem.number = temp;

            result.push(right[rightIndex]);
            rightIndex++;
        }

        if (!sortingMeta.inProgress) {
            sortingMeta.inPause = true;
            return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
        }
    }

    await delay(calculateDelayBySpeed(sortingMeta.speed));

    // К отсортированному массиву добавляем оставшиеся элементы одного из подмассивов left или right
    const res = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));

    // Отображаем изменения в исходном массиве
    for (let i = 0; i < block.length; i++) {
        block[i].number = res[i]._number;

        block[i].setStatus('greater');

        await delay(calculateDelayBySpeed(sortingMeta.speed));

        block[i].resetStatus()
    }

    return res;
}

export async function quickSort(columns, sortingMeta, savedVars, onSorted) {
    let left = 0;
    let right = columns.length - 1;
    savedVars.left = left;
    savedVars.right = right;

    await quickSortRecursive(columns, left, right, sortingMeta, savedVars, onSorted);

    if (sortingMeta.inProgress) {
        onSorted();
    }

    sortingMeta.inProgress = false;
}

async function quickSortRecursive(columns, left, right, sortingMeta, savedVars, onSorted) {
    // Базовый случай: если левая граница больше или равна правой, выходим из рекурсии
    if (left >= right || !sortingMeta.inProgress) {
        return;
    }

    // Получаем индекс опорного элемента после разделения
    const pivotIndex = await partition(columns, left, right, sortingMeta, savedVars);

    // Рекурсивно сортируем левую и правую части массива
    await quickSortRecursive(columns, left, pivotIndex - 1, sortingMeta, savedVars, onSorted);
    await quickSortRecursive(columns, pivotIndex + 1, right, sortingMeta, savedVars, onSorted);

}

// Функция для разделения массива и получения индекса опорного элемента
async function partition(columns, left, right, sortingMeta, savedVars) {
    // Определяем опорный элемент как последний элемент массива
    const pivot = columns[right].number;
    // Индекс последнего элемента, который меньше опорного
    let i = left - 1;

    // Итерируем по элементам подмассива
    for (let j = left; j <= right - 1; j++) {
        columns[j].setStatus('current');
        await delay(calculateDelayBySpeed(sortingMeta.speed));

        // Если текущий элемент меньше опорного, переносим этот элемент в начало массива
        // таким образом все элементы, меньшие чем опорный, оказываются в левой части массива,
        // а большие, чем опорный - в правой
        if (columns[j].number < pivot) {
            i++;
            const temp = columns[i].number;
            columns[i].number = columns[j].number;
            columns[j].number = temp;

            await delay(calculateDelayBySpeed(sortingMeta.speed));

            columns[j].resetStatus();
        }

        columns[j].resetStatus();
    }

    // Меняем местами опорный элемент и элемент на позиции i + 1,
    // таким образом все элементы слева опорного будут меньше его,
    // а справа - больше
    const temp = columns[i + 1].number;
    columns[i + 1].number = columns[right].number;
    columns[right].number = temp;

    columns[i + 1].setStatus('greater');
    columns[right].setStatus('greater');

    await delay(calculateDelayBySpeed(sortingMeta.speed));

    columns[i + 1].resetStatus();
    columns[right].resetStatus();

    // Возвращаем индекс опорного элемента
    return i + 1;
}

