import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';

import MatchItem from './MatchItem';

class Feed extends Component {
    render() {
        const {viewer, matches} = this.props;

        return (
            <div>
                {viewer.tutorialComplete || 'TUTORIAL'}
                <ul>
                    {matches.map(match => (
                        <li key={match.wishItem.id+match.posessionItem.id+match.user.id}>
                            <div>
                                희망
                                <MatchItem item={match.wishItem} />

                                상대방 보유
                                <MatchItem item={match.posessionItem} />
                                <div>{match.user.name}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(Feed, {
    viewer: graphql`
        fragment Feed_viewer on User {
            id
            name
        }
    `,
    matches: graphql`
        fragment Feed_matches on Match @relay(plural: true) {
            wishItem {
                id
                ...MatchItem_item
            }
            posessionItem {
                id
                ...MatchItem_item
            }
            user {
                id
                name
            }
        }
    `,
});