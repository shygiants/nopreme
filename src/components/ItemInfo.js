import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import { Heading, Box, Image, Text } from 'grommet';
import {Favorite, Transaction, Archive, Share} from 'grommet-icons'

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

                <Box
                    direction='row'
                    justify='around'
                    pad='medium'
                >
                    <Box direction='row' gap='xsmall'>
                        <Archive size='medium'/>
                        <Text>{item.collected ? '수집 완료' : '미수집'}</Text>
                    </Box>

                    <Box direction='row' gap='xsmall'>
                        <Share size='medium'/>
                        <Text>{item.posessed ? '보유' : '미보유'}</Text>
                    </Box>

                    <Box direction='row' gap='xsmall'>
                        <Favorite size='medium'/>
                        <Text>{item.wished ? '희망' : '비희망'}</Text>
                    </Box>
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
            collected
            posessed
            wished
        }
    `,
});