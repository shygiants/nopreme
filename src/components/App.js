import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header, Main, Footer, Layer, Button, Box, Heading} from 'grommet';
import {deepMerge} from 'grommet/utils'
import { Menu } from 'grommet-icons';

import MenuLayer from './MenuLayer';

class App extends Component {
    constructor(props) {
        super(props);

        this.setShow = this.setShow.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);

        this.state = {
            layer: false,
        };

        grommet.global.colors.brand='#e5732f';
        grommet.global.colors.focus='#e5732f';
    }

    setShow(show) {
        this.setState({
            layer: show,
        });
    }

    openMenu() {
        this.setShow(true);
    }

    closeMenu() {
        this.setShow(false);
    }

    render() {
        const {viewer, children} = this.props;

        return (
            <Grommet theme={grommet}>
                <Header>
                    <Box
                        direction='row'
                        align='center'
                    >
                        <Button icon={<Menu />} onClick={this.openMenu} />
                        <Heading
                            margin='xsmall'
                            level='2'
                            color='brand'
                        >
                            <b><i>Nopreme</i></b>
                        </Heading>
                    </Box>
                </Header>
                <Main background='light-1'>
                    <MenuLayer
                        viewer={viewer}
                        show={this.state.layer}
                        onClose={this.closeMenu}
                    />
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

