import React, {
    Component
} from 'react';
import {grommet} from 'grommet/themes';

import {Grommet, Header, Main, Heading, Footer} from 'grommet';
import Link from './Link';
import {User} from 'grommet-icons';

export default class Container extends Component {
    constructor(props) {
        super(props);

        grommet.global.colors.brand='#e5732f';

        Kakao.init(process.env.KAKAO_JS_KEY);
    }

    render() {
        const {children} = this.props;

        return (
            <Grommet
                theme={grommet} 
            >
                <Header
                    pad={{horizontal: 'medium'}}
                    elevation='xsmall'
                >
                    <Link 
                        to='/'
                        label={(
                            <Heading
                                margin='xsmall'
                                level='2'
                                color='brand'
                            >
                                <b><i>Nopreme</i></b> 고객센터
                            </Heading>
                        )}
                    />
                </Header>
                <Main>
                    {children}
                </Main>
                <Footer
                    direction='column'
                    align='start'
                    background='brand'
                    pad='medium'
                >
                    <Link color='light-1' to='/talk-channel' icon={<User />} label='상담' />
                    <Link color='light-1' to='/terms-of-service' icon={<User />} label='서비스 약관' />
                    <Link color='light-1' to='/privacy-policy' icon={<User />} label='개인정보 보호정책' />

                </Footer>
            </Grommet>
        );
    }
}