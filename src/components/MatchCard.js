import React, {Component} from 'react';
import {Box, Image, Text} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction} from 'grommet-icons';

import MatchItem from './MatchItem';

class MatchCard extends Component{
    render() {
        const {viewer, match} = this.props;

        const {wishItem, posessionItem, user} = match

        if (wishItem.goods.name !== posessionItem.goods.name)
            throw new Error('`wishItem` and `posessionItem` should be the same goods');

        return (
            <Box
                direction='column'
                round='medium'
                background='#FFFFFF'
                fill='horizontal'
                align='center'
                pad={{vertical: 'medium'}}
            >
                <Box
                    direction='row'
                    align='center'
                    justify='evenly'
                    fill='horizontal'
                >

                    <MatchItem user={viewer} item={wishItem} />
                    
                    <Transaction />

                    <MatchItem user={user} item={posessionItem} />

                </Box>
                <Box 
                    direction='row'
                >
                    <Text 
                        size='xsmall' 
                        color='dark-3'
                        truncate
                    >
                        {wishItem.goods.name}
                    </Text>
                </Box>
            </Box>  
        );
    }
}

export default createFragmentContainer(MatchCard, {
    viewer: graphql`
        fragment MatchCard_viewer on User {
            id
            ...MatchItem_user
        }
    `,
    match: graphql`
        fragment MatchCard_match on Match {
            wishItem {
                id
                goods {
                    id
                    name
                }
                ...MatchItem_item
            }
            posessionItem {
                id
                goods {
                    id
                    name
                }
                ...MatchItem_item
            }
            user {
                id
                ...MatchItem_user
            }
        }
    `,
})
