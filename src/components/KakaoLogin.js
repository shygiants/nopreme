import React, {
    Component
} from 'react';

export default class KakaoLogin extends Component {
    constructor(props) {
        super(props);

        // 사용할 앱의 JavaScript 키를 설정해 주세요.
        Kakao.init(process.env.KAKAO_JS_KEY);
    }

    componentDidMount() {
        // 카카오 로그인 버튼을 생성합니다.
        Kakao.Auth.createLoginButton({
            container: '#kakao-login-btn',
            success: this.props.onSuccess,
            fail: err => {
                throw err;
            }
        });
    }

    render() {
        return (
            <div>
                <a id="kakao-login-btn"></a>
                <a href="http://developers.kakao.com/logout">로그아웃</a>
            </div>
        );
    }
}