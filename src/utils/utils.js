const getRandomInteger = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
}

const removeElementsByClass = (className) => {
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach(el => {
        el.parentNode.removeChild(el);
    })
}

const COLORS = ['Brown', 'Blue', 'Yellow'];

const mapIntToColor = (int) => {
    return COLORS[int] ?? null;
}

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const create2dArray = (x, y) => {
    return new Array(x).fill(null).map(() => new Array(y).fill(null));
}

const deepCopy = (arr) => {
    const copy = [];
    arr.forEach(el => {
        if (Array.isArray(el)) {
            copy.push(deepCopy(el));
        } else {
            copy.push(el);
        }
    });
    return copy;
};

const transpose = (array) => {
    return array[0].map((col, colIndex) => array.map(row => row[colIndex]));
}

const findSubarrays = (array, min, filter) => {
    let res = new Array(array.length).fill(0);
    let current = [];
    for (let i = 0; i < array.length; i++) {
        if (filter(array[i])) {
            current.push(i);
        } else {
            if (current.length >= min) {
                current.forEach(i => res[i] = 1)
            }
            current = [];
        }
    }
    if (current.length >= min) {
        current.forEach(i => res[i] = 1)
    }
    return res;
}

const rotateArray = (array, n) => {
    let arr = deepCopy(array);
    for (let i = 0; i < n; i++) {
        arr.push(arr.shift());
    }
    return arr;
}


export {
    getRandomInteger,
    removeElementsByClass,
    mapIntToColor,
    sleep,
    transpose,
    findSubarrays,
    create2dArray,
    deepCopy,
    rotateArray,
}
