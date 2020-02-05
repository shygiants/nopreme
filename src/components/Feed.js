import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';

class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            event: null,
            goods: null,
            item: null,
        };
    }

    render() {
        const {viewer} = this.props;

        return (
            <div>
                {viewer.posesses.length === 0 ? 'No posession' : 'You have something'}
            </div>
        );
    }
}

export default createFragmentContainer(Feed, {
    viewer: graphql`
        fragment Feed_viewer on User {
            id
            name
            collects {
                id
                idx
            }
            posesses  {
                id
                idx
            }
            wishes  {
                id
                idx
            }
        }
    `,
});