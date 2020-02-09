import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

class EventInfo extends Component {
    render() {
        const {artist, event} = this.props;

        return (
            <div>
                <h1>{event.name}</h1>
                <img src={event.img} />
                <h2>{artist.name}</h2>
                <h3>{event.date}</h3>
                <p>{event.description}</p>
            </div>
        );
    }
}

export default createFragmentContainer(EventInfo, {
    event: graphql`
        fragment EventInfo_event on Event @argumentDefinitions(
            artistName: {type: "String"}
        ) {
            id
            name
            img
            date
            description
        }
    `,
    artist: graphql`
        fragment EventInfo_artist on Artist {
            id
            name
        }
    `,
});