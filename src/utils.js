import request from 'request-promise-native';

export function range(end) {
    return [...Array(end).keys()];
}

export function getKakaoUserInfo(accessToken) {
    return request({
      uri: 'https://kapi.kakao.com/v2/user/me',
      json: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
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