import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {grommet} from 'grommet/themes';
import {Grommet, Header} from 'grommet'

import {Avatar, HeaderLink} from './styled-components/HeaderComponent';

class App extends Component {
    render() {
        const {viewer, children} = this.props;

        return (
            <Grommet theme = {grommet}>
                <Header>
                    <HeaderLink/>
                    <Avatar viewer = {viewer}/>
                </Header>
                {children}
            </Grommet>
        );
    }
}

export default createFragmentContainer(App, {
    viewer: graphql`
        fragment App_viewer on User {
            id
            userId
            name
            admin
        }
    `,
});

