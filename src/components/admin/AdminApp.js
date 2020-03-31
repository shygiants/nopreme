import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header, Main, Box, Heading, Text, Anchor} from 'grommet';
import {deepMerge} from 'grommet/utils';

import Link from '../Link';

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

class AdminApp extends Component {
    render() {
        const {viewer, children} = this.props;
    
        return (
            <Grommet theme={customGrommet}>
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

export default createFragmentContainer(AdminApp, {
    viewer: graphql`
        fragment AdminApp_viewer on User {
            id
        }
    `,
});

