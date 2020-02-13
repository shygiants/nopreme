import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Box} from 'grommet';

import MatchCard from './MatchCard';

class Feed extends Component {
    render() {
        const {viewer, matches} = this.props;

        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
                align='center'
                gap='medium'
            >
                {viewer.tutorialComplete || 'TUTORIAL'}
                {matches.map(match => (
                    <MatchCard key={match.wishItem.id+match.posessionItem.id+match.user.id} viewer={viewer} match={match} />                            
                ))}
            </Box>
        );
    }
}

export default createFragmentContainer(Feed, {
    viewer: graphql`
        fragment Feed_viewer on User {
            id
            name
            ...MatchCard_viewer
        }
    `,
    matches: graphql`
        fragment Feed_matches on Match @relay(plural: true) {
            wishItem {
                id
            }
            posessionItem {
                id
            }
            user {
                id
            }
            ...MatchCard_match
        }
    `,
});