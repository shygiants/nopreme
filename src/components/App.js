import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header, Main, Box, Heading, Text, Anchor} from 'grommet';
import { Search, User} from 'grommet-icons';
import {deepMerge} from 'grommet/utils';

import Link from './Link';
import NoticeLayer from './NoticeLayer';


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
    constructor(props) {
        super(props);

        const {homeNotice} = this.props;

        let showNotice;
        if (!homeNotice)
            showNotice = false;
        else {
            if (localStorage.getItem('homeNoticeId') !== homeNotice.noticeId)
                showNotice = true;
            else {
                const closeAt = new Date(localStorage.getItem('closeAt'));
                const curr = new Date();

                const diff = curr - closeAt;
                
                showNotice = diff > (1000 * 60 * 60 * 3);
            }
        }

        this.state = {
            showNotice,
        };
    }

    handleClose() {
        const {homeNotice} = this.props;

        this.setState({
            showNotice: false,
        });

        localStorage.setItem('homeNoticeId', homeNotice.noticeId);
        localStorage.setItem('closeAt', new Date());
    }

    render() {
        const {showNotice} = this.state;
        const {router, viewer, children, homeNotice} = this.props;

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
                    <Box
                        direction='row'
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

                        <Anchor 
                            alignSelf='end'
                            target='blank'
                            href='https://twitter.com/official_izone/status/1236985333595746304?s=20'  
                            label={(
                                <Text
                                    size='xsmall'
                                >
                                    고마워 유진아 ❤️
                                </Text>
                            )}
                        />
                    </Box>
                        
                    
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
                    {showNotice && homeNotice && (
                        <NoticeLayer 
                            homeNotice={homeNotice} 
                            onClose={this.handleClose.bind(this)} 
                        />
                    )}
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
    homeNotice: graphql`
        fragment App_homeNotice on Notice {
            id
            noticeId
            ...NoticeLayer_homeNotice
        }
    `,
});

