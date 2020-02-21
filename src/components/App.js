import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header, Main, Box, Heading} from 'grommet';
import { Search, User } from 'grommet-icons';
import Link from './Link';
import {deepMerge} from 'grommet/utils';

const customGrommet = deepMerge(grommet, {
    global: {
        colors: {
            brand: '#e5732f'
        },
        focus: {
            border: {
                size: 'xsmall',
                color: 'brand'
            }
        }
    },
    tab: {
        margin: '3px'
    }
});

class App extends Component {
    render() {
        const {router, viewer, children} = this.props;

        if (viewer.openChatLink === undefined || viewer.openChatLink === null) {
            if (location.hash !== '#/profile') {
                router.push('/profile');
            }
        }
            
        return (
            <Grommet style={{height: '100vh'}} theme={customGrommet}>
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
                                <b><i>Nopreme</i></b>
                            </Heading>
                        )}
                    />
                    <Box
                        direction='row'
                        align='center'
                    >
                        <Link icon={<Search />} to='/browse' />
                        <Link icon={<User />} to='/menu' />
                        {/* <Link to='/menu' label={<Avatar viewer={viewer}/>} /> */}
                        
                    </Box>
                </Header>
                <Main
                    background='light-1'
                    pad={{vertical: 'medium'}}
                >
                    {children}
                </Main>
            </Grommet>
        );
    }
}

export default createFragmentContainer(App, {
    viewer: graphql`
        fragment App_viewer on User {
            id
            openChatLink
        }
    `,
});

