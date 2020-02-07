import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventList from './EventList';
import ToggleSwitch from './ToggleSwitch';
import TextInput from './TextInput';

import AddEventMutation from '../mutations/AddEventMutation';

class ArtistApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editable: false,
        };
    }

    handleToggle() {
        this.setState(state => ({
            editable: !state.editable,
        }));
    }

    handleTextInputSave(eventName) {
        AddEventMutation.commit(this.props.relay.environment, eventName, this.props.artist);
    }

    render() {
        const {editable} = this.state;
        const {artist} = this.props;

        return (
            <div>
                <h1>{artist.name}</h1>
                <ul>
                    {artist.members.map(member => (
                        <li key={member.memberId}>{member.name}</li>
                    ))}
                </ul>
                <ToggleSwitch on={editable} onChange={this.handleToggle.bind(this)} label='Admin' />
                {editable && <TextInput placeholder='이벤트 이름' onSave={this.handleTextInputSave.bind(this)}/>}
                <EventList artist={artist} />
            </div>
        );
    }
}

export default createFragmentContainer(ArtistApp, {
    artist: graphql`
        fragment ArtistApp_artist on Artist {
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
