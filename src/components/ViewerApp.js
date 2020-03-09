import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import Link from './Link';
import {Box, Anchor, Text} from 'grommet';
import {User, Logout, CircleQuestion, Announce, Twitter, Help} from 'grommet-icons';

class ViewerApp extends Component {
    logout() {
        localStorage.removeItem('jwt');
    }

    render() {
        const {viewer} = this.props;

        return (
            <Box
                direction='column'
                align='start'
                gap='medium'
                pad={{horizontal: 'medium'}}
            >
                <Box direction='row-reverse' fill='horizontal'>
                    <Text color='brand'>{viewer.name}</Text>
                </Box>

                <Link to='/profile' icon={<User />} label='프로필' />
                <Link to='/notice' icon={<Announce />} label='공지사항' />
                <Anchor target='_blank' href='https://twitter.com/nomorepremium/status/1230938532425826305' icon={<Help />} label='사용법' />

                <Anchor target='_blank' href='/documents' icon={<CircleQuestion />} label='문의' />
                <Anchor target='_blank' href='https://twitter.com/nomorepremium' icon={<Twitter />} label='공식 트위터' />

                {/* <Link to='/settings' icon={<Configure />} label='설정' /> */}
                <Anchor href='/' icon={<Logout />} label='로그 아웃' onClick={this.logout} />
                
            </Box>
        );
    }
}

export default createFragmentContainer(ViewerApp, {
    viewer: graphql`
        fragment ViewerApp_viewer on User {
            id
            name
        }
    `,
});

