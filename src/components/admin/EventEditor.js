import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Heading, Text, Anchor, DataTable, Image} from 'grommet';

import EventGoodsList from './EventGoodsList';

import AddGoodsMutation from '../../mutations/AddGoodsMutation';
import GoodsInput from '../GoodsInput';

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
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
            >
                <Box
                    width='medium'
                    height='medium'
                >
                    <Image
                        src={event.img}
                        fit='contain'
                    />
                </Box>
                <Heading level={2}>{event.name}</Heading>
                <Text>{event.description}</Text>
                <Text>{event.date}</Text>
                
                <EventGoodsList event={event} />
                <GoodsInput onSubmit={this.handleGoodsSave.bind(this)} />

            </Box>
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
            name
            img
            description
            date
            ...EventGoodsList_event @arguments(artistName: $artistName)
        }
    `,
    artist: graphql`
        fragment EventEditor_artist on Artist {
            id
            artistId
            name
        }
    `,
});