import React, {
    Component
} from 'react';

import KakaoLogin from './KakaoLogin';
import {Box, Heading, Paragraph, Anchor} from 'grommet';

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
            if (json.token !== undefined && json.token !== null) {
                // SIGN IN
                localStorage.setItem('jwt', json.token);
                window.location.href = 'http://localhost:4000';
            }

            throw new Error('No Token');
        }).catch(console.error);
    }

    render() {
        const nopreme = <b><i>Nopreme</i></b>;
        const premium = (<Anchor 
                            target='_blank' 
                            href='https://dic.daum.net/word/view.do?wordid=kkw000937633&supid=kku011048313' 
                            label='플미' 
                        />);
        return (
            <Box
                height='100vh'
                direction='column'
                align='center'
                justify='center'
                pad='large'
            >
                <Heading
                    color='brand'
                >
                    {nopreme}
                </Heading>
                <Paragraph
                    size='small'
                >
                    아티스트를 사랑하는 팬들끼리 굿즈 교환
                </Paragraph>                
                <KakaoLogin onSuccess={this.handleSignIn} />
                <Paragraph
                    margin={{top: 'large'}}
                    size='small'
                >
                    {nopreme} = <b><i>No</i></b> + <i><b>Prem</b>ium</i> ({premium}, 프리미엄) + <b><i>e</i></b> <br/>
                    {nopreme}은 아티스트에 대한 팬들의 열렬한 마음을 이용해 부당하게 이득을 취하는 {premium}를 근절합니다.
                </Paragraph>
            </Box>
        );
    }

}