import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventInfo from './EventInfo';

class EventApp extends Component {
    render() {
        const {artist, event} = this.props;

        return (
            <EventInfo artist={artist} event={event} />
        );
    }
}

export default createFragmentContainer(EventApp, {
    event: graphql`
        fragment EventApp_event on Event @argumentDefinitions(
            artistName: {type: "String"},
        ) {
            id
            eventId
            ...EventInfo_event @arguments(artistName: $artistName)
        }
    `,
    artist: graphql`
        fragment EventApp_artist on Artist {
            id
            artistId
            name
            ...EventInfo_artist
        }
    `,
});