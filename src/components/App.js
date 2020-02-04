import React, {
    Component
} from 'react';

import {graphql, createFragmentContainer,} from 'react-relay';
import {Link} from 'found';

class App extends Component {
    render() {
        const {viewer, children} = this.props;

        return (
            <div>
                <Link to='/'>Home</Link>
                <h3>Viewer: {viewer.name} {viewer.admin && '(ADMIN)'}</h3>
                {children}
            </div>
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

