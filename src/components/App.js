import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header, Main, Footer, Layer, Button, Box, Heading} from 'grommet';
import { Search } from 'grommet-icons';
import Avatar from './Avatar';
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
        const {viewer, children} = this.props;

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
                        <Link to='/menu' label={<Avatar viewer={viewer}/>} />
                        
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
            ...MenuLayer_viewer
        }
    `,
});

