import React, {Component} from 'react';
import {Box, Text, Button} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';

class Profile extends Component {
    render() {
        const {viewer} = this.props;
        return (
            <Box>
                {viewer.name}
                {viewer.openChatLink}
            </Box>
        );
    }
}

export default createFragmentContainer(Profile, {
    viewer: graphql`
        fragment Profile_viewer on User {
            id
            userId
            name
            openChatLink
        }
    `,
});