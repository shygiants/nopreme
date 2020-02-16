import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import { Heading, Box, Image, Text } from 'grommet';

class ItemInfo extends Component {
    render() {
        const {item} = this.props;
        const {members, goods} = item;

        const memberName = members.map(member => member.name).join(',');

        return (
            <Box
                direction='column'
                gap='small'
            >
                <Box
                    height='100vw'
                    width='100vw'
                >
                    <Image src={item.img} fill fit='contain' />
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
                        {`${memberName} ${item.idx}`}
                    </Heading>
                    
                    <Text size='xsmall' color='dark-3'>{goods.name}</Text>
                </Box>
            </Box>
        );
    }
}

export default createFragmentContainer(ItemInfo, {
    item: graphql`
        fragment ItemInfo_item on Item {
            id
            idx
            members {
                id
                name
            }
            img
            goods {
                id
                name
            }
        }
    `,
});