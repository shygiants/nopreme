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