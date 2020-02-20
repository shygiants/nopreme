import React, {
    Component
} from 'react';
import {grommet} from 'grommet/themes';

import {Grommet, Header, Main, Box, Heading, Footer} from 'grommet';
import {Configure, User, Logout, CircleQuestion} from 'grommet-icons';

export default class Container extends Component {
    constructor(props) {
        super(props);

        grommet.global.colors.brand='#e5732f';
    }

    render() {
        const {children} = this.props;

        return (
            <Grommet
                theme={grommet} 
            >
                <Main>
                    {children}
                </Main>
            </Grommet>
        );
    }
}