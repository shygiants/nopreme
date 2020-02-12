import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header, Main, Footer, Layer, Button, Box, Heading} from 'grommet';
import { Menu, Search } from 'grommet-icons';
import Avatar from './Avatar';
import Link from './Link';

class App extends Component {
    constructor(props) {
        super(props);

        grommet.global.colors.brand='#e5732f';
    }

    render() {
        const {viewer, children} = this.props;

        return (
            <Grommet theme={grommet}>
                <Header>
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
                    pad='medium'
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

