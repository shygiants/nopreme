import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventList from './EventList';
import ToggleSwitch from './ToggleSwith';

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
                <EventList artist={artist} editable={editable} />
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
