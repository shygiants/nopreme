import React, {
    Component
} from 'react';
import {Box, Text, Anchor} from 'grommet';

export default class KakaoLogin extends Component {
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
                    <Anchor target='_blank' href='/documents/#/privacy-policy' label='개인정보 처리방침' />에 동의하는 것으로 간주됩니다.
                </Text>                
            </Box>
        );
    }
}