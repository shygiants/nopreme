import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import Link from './Link';
import {Box, Anchor, Text} from 'grommet';
import {User, Logout, CircleQuestion} from 'grommet-icons';

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

                <Anchor target='_blank' href='/documents' icon={<CircleQuestion />} label='문의' />

                {/* <Link to='/settings' icon={<Configure />} label='설정' /> */}
                <Link to='/' icon={<Logout />} label='로그 아웃' onClick={this.logout} />
                
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

