import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import Link from './Link';
import { Heading, Box, Image, Text } from 'grommet';

class GoodsInfo extends Component {
    render() {
        const {event, goods} = this.props;
        
        const curr = location.hash.slice(1);

        return (
            <Box
                direction='column'
                gap='small'
            >
                <Box
                    height='100vw'
                    width='100vw'
                >
                    <Image src={goods.img} fill fit='contain' />
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
                        {goods.name}
                    </Heading>
                    <Link to={curr + `/events/${event.eventId}`} label={event.name}/>
                    <Text size='xsmall' color='dark-3'>{goods.description}</Text>
                </Box>
            </Box>
        );
    }
}

export default createFragmentContainer(GoodsInfo, {
    event: graphql`
        fragment GoodsInfo_event on Event {
            id
            name
            eventId
        }
    `,
    goods: graphql`
        fragment GoodsInfo_goods on Goods {
            id
            name
            img
            description
        }
    `,
});