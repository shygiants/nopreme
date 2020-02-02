import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventList from './EventList';

class ArtistApp extends Component {
    render() {
        const {artist} = this.props;

        return (
            <div>
                <h1>{artist.name}</h1>
                <ul>
                    {artist.members.map(member => (
                        <li key={member.memberId}>{member.name}</li>
                    ))}
                </ul>
                <EventList artist={artist} />
            </div>
        );
    }
}

export default createFragmentContainer(ArtistApp, {
    artist: graphql`
        fragment ArtistApp_artist on Artist {
            id
            name
            members {
                id
                memberId
                name
            }
            ...EventList_artist
        }
    `,
});
