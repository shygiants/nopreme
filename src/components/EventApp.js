import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import GoodsList from './GoodsList';
import ToggleSwitch from './ToggleSwith';

import AddGoodsMutation from '../mutations/AddGoodsMutation';
import TextInput from './TextInput';

class EventApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editable: false,
        };
    }

    handleTextInputSave(goodsName) {
        const {relay, event, artist} = this.props;
        AddGoodsMutation.commit(
            relay.environment, 
            goodsName, 
            event, 
            artist);
    }

    handleToggle() {
        this.setState(state => ({
            editable: !state.editable,
        }));
    }

    render() {
        const {artist, event} = this.props;
        const {editable} = this.state;

        return (
            <div>
                <h1>{event.name}</h1>
                <h2>{artist.name}</h2>
                <ToggleSwitch on={editable} onChange={this.handleToggle.bind(this)} label='Admin' />
                {editable && <TextInput placeholder='굿즈 이름' onSave={this.handleTextInputSave.bind(this)} />}
                <GoodsList event={event} />
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
            artistId
            name
        }
    `,
});