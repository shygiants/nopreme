import React, {Component} from 'react';
import {Box} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';

class Settings extends Component {    
    render() {
        const {viewer} = this.props;

        return (
            <Box>{viewer.tutorialComplete ? 'TUTORIAL COMPLETE' : 'TUTORIAL'}</Box>
        );
    }
}

export default createFragmentContainer(Settings, {
    viewer: graphql`
        fragment Settings_viewer on User {
            id
            userId
            name
            openChatLink
            tutorialComplete
        }
    `,
});