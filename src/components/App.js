import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {Link} from 'found';
import {grommet} from 'grommet/themes';
import {Grommet, Box, Header} from 'grommet'

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
            // <div>
            //     <ul>
            //         <li><Link to='/'>Home</Link></li>
            //         <li><Link to='/browse'>Browse</Link></li>
            //     </ul>
                
            //     <h3>Viewer: {viewer.name} {viewer.admin && '(ADMIN)'}</h3>
            //     
            // </div>
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

