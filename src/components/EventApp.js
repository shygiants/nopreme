import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import GoodsList from './GoodsList';

class EventApp extends Component {
    render() {
        const {artist, event} = this.props;

        return (
            <div>
                <h1>{event.name}</h1>
                <h2>{artist.name}</h2>
                <GoodsList event={event} artist={artist} />
            </div>
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
            name
            ...GoodsList_event @arguments(artistName: $artistName)
        }
    `,
    artist: graphql`
        fragment EventApp_artist on Artist {
            id
            name
            ...GoodsList_artist
        }
    `,
});