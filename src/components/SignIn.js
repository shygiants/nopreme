import React, {
    Component
} from 'react';

import KakaoLogin from './KakaoLogin';

export default class SignIn extends Component {
    handleSignIn({access_token, refresh_token}) {
        return fetch('/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken: access_token
            }),
        }).then((res) => res.json()).then(json => {
            console.log(json);

            if (json.token !== undefined && json.token !== null) {
                localStorage.setItem('jwt', json.token);
                window.location.href = 'http://localhost:4000';
            } else {
                localStorage.setItem('kakao-jwt', access_token);
                window.location.href = 'http://localhost:4000/signin/#/signup';
            }

        }).catch(console.error);
    }

    render() {
        return (
            <div>
                <KakaoLogin onSuccess={this.handleSignIn} />
            </div>
        );
    }

}