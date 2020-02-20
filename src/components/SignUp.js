import React, {
    Component
} from 'react';

import TextsInput from './TextsInput';

export default class SignUp extends Component {
    handleInputs({nickname, openChatLink}) {
        const accessToken = localStorage.getItem('kakao-jwt');

        return fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname, openChatLink, accessToken}),
        }).then((res) => res.json()).then(({token}) => {
            localStorage.setItem('jwt', token);
            window.location.href = `http://${process.env.PUBLIC_URL}`;
        }).catch(console.error);
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('kakao-jwt');

        if (accessToken === null) {
            window.location.href = `http://${process.env.PUBLIC_URL}/signin`;
            return;
        }
        // TODO: CORS
        return fetch('/kakao/nickname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({accessToken}),
        }).then((res) => res.json()).then((json => {
            this.setState({
                nickname: json.nickname
            });
        }).bind(this)).catch(console.error);
    }

    render() {
        return (
            (this.state !== null && this.state.nickname !== null) ?
            <div>
                <h1>회원 가입</h1>
                <TextsInput 
                    onSave={this.handleInputs.bind(this)} 
                    texts={[{
                        name: 'nickname', 
                        display: '닉네임',
                        initialValue: this.state.nickname,
                    }, {
                        name: 'openChatLink', 
                        display: '오픈채팅방 링크'
                    }]} />

            </div> : 'Loading...'
        );
    }
}