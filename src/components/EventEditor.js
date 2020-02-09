import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventGoodsList from './EventGoodsList';
import EventInfo from './EventInfo';

import AddGoodsMutation from '../mutations/AddGoodsMutation';
import GoodsInput from './GoodsInput';

class EventEditor extends Component {

    handleGoodsSave({name, description, img}) {
        const {relay, event, artist} = this.props;
        AddGoodsMutation.commit(
            relay.environment, {
                name, 
                event, 
                artist,
                description, 
                img,
            });
    }

    render() {
        const {artist, event} = this.props;

        return (
            <div>
                <EventInfo  artist={artist} event={event} />
                <h2>굿즈 추가</h2>
                <GoodsInput onSubmit={this.handleGoodsSave.bind(this)} />
                <h2>굿즈 목록</h2>
                <EventGoodsList event={event} />
            </div>
        );
    }
}

export default createFragmentContainer(EventEditor, {
    event: graphql`
        fragment EventEditor_event on Event @argumentDefinitions(
            artistName: {type: "String"},
        ) {
            id
            eventId
            ...EventInfo_event @arguments(artistName: $artistName)
            ...EventGoodsList_event @arguments(artistName: $artistName)
        }
    `,
    artist: graphql`
        fragment EventEditor_artist on Artist {
            id
            artistId
            name
            ...EventInfo_artist
        }
    `,
});