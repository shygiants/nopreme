import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventList from './EventList';
import EventInput from './EventInput';

import AddEventMutation from '../mutations/AddEventMutation';

class ArtistEditor extends Component {
    handleEventSave({name, date, description, img}) {
        AddEventMutation.commit(this.props.relay.environment, {
            name, 
            date, 
            description,
            img,
            artist: this.props.artist,
        });
    }

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
                <h2>이벤트 추가</h2>
                <EventInput onSubmit={this.handleEventSave.bind(this)} />
                <h2>이벤트 목록</h2>
                <EventList artist={artist} />
            </div>
        );
    }
}

export default createFragmentContainer(ArtistEditor, {
    artist: graphql`
        fragment ArtistEditor_artist on Artist {
            id
            artistId
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
