import request from 'request-promise-native';
import nameGenerator from '@afuggini/namegenerator';
import {nicknameExists} from './data/database/database';

export async function generateNewNickname() {
    const newNickname = nameGenerator('-');

    while (await nicknameExists(newNickname)) {}

    return newNickname;
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

export function intersection(arr1, arr2) {
    return arr1.filter(value => -1 !== arr2.indexOf(value));
}