import React, {
    Component
} from 'react';
import {Box, Text, Anchor} from 'grommet';

export default class KakaoLogin extends Component {
    constructor(props) {
        super(props);

        // 사용할 앱의 JavaScript 키를 설정해 주세요.
        // Kakao.init(process.env.KAKAO_JS_KEY);
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
            <Box
                align='center'
                margin='large'
            >
                <a id="kakao-login-btn"></a>
                <Text
                    size='xsmall'
                    color='dark-3'
                >
                    계속 진행하면 <i>Nopreme</i> 
                    <Anchor target='_blank' href='/documents/#/terms-of-service' label='서비스 약관'/> 및 
                    <Anchor target='_blank' href='/documents/#/privacy-policy' label='개인정보 보호정책' />에 동의하는 것으로 간주됩니다.
                </Text>                
            </Box>
        );
    }
}