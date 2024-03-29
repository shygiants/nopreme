export function range(end) {
    return [...Array(end).keys()];
}

export function strcmp(f, s) {
    return f.localeCompare(s);
}

export function buildGetter(fieldName) {
    const fieldNames = fieldName.split('.');

    function getter(elem) {
        let currElem = elem;

        for (const field of fieldNames) 
            currElem = currElem instanceof Array ? currElem.map(e => e[field]) : currElem[field];

        return currElem;
    }

    return getter;
}

export function getUniqueValues(arr, fieldName, comparator=strcmp) {
    const getter = buildGetter(fieldName);

    const values = arr.map(getter);

    function reduce(elem) {
        if (elem instanceof Array) 
            return elem.sort(comparator).join(',');

        return elem;
    }

    return [...new Set(values.map(reduce))].map(val => val.split(','));
}

export function classify(arr, fieldName, comparator=strcmp) {
    const getter = buildGetter(fieldName);

    function reduce(elem) {
        if (elem instanceof Array) 
            return elem.sort(comparator).join(',');

        return elem;
    }

    const directory = new Map();

    for (const elem of arr) {
        const fieldValue = reduce(getter(elem));

        if (directory.has(fieldValue)) {
            directory.get(fieldValue).push(elem);
        } else {
            directory.set(fieldValue, [elem]);
        }
    }

    return directory;
}

export function getNodesFromConnection(connection) {
    return connection.edges.map(edge => edge.node);
}

export function intersection(arr1, arr2) {
    return arr1.filter(value => -1 !== arr2.indexOf(value));
}