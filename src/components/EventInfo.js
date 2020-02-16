import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import { Heading, Box, Image, Text } from 'grommet';

class EventInfo extends Component {
    render() {
        const {artist, event} = this.props;

        return (
            <Box
                direction='column'
                gap='small'
            >
                <Box
                    height='100vw'
                    width='100vw'
                >
                    <Image src={event.img} fill fit='contain' />
                </Box>
                <Box
                    direction='column'
                    gap='small'
                    pad={{horizontal: 'medium'}}
                >
                    <Heading
                        level='2'
                        truncate
                        margin={{vertical: 'small'}}
                    >
                        {event.name}
                    </Heading>
                    <Heading
                        level='3'
                        truncate
                        margin='0'
                    >
                        {artist.name}
                    </Heading>
                    <Text>{event.date}</Text>
                    <Text size='xsmall' color='dark-3'>{event.description}</Text>

                </Box>
            </Box>
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