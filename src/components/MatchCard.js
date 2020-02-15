import React, {Component} from 'react';
import {Box, Text, Button} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction} from 'grommet-icons';

import MatchItem from './MatchItem';
import AddExchangeMutation from '../mutations/AddExchangeMutation';

class MatchCard extends Component{
    handleClick() {
        const {match, onExchangeRequest} = this.props;

        onExchangeRequest(match);
    }

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
                pad='medium'
                gap='small'
            >
                <Box
                    direction='row'
                    align='center'
                    justify='between'
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
                <Button onClick={this.handleClick.bind(this)} fill='horizontal' label='교환 신청' />
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
                itemId
                goods {
                    id
                    name
                }
                ...MatchItem_item
            }
            posessionItem {
                id
                itemId
                goods {
                    id
                    name
                }
                ...MatchItem_item
            }
            user {
                id
                userId
                openChatLink
                ...MatchItem_user
            }
        }
    `
})
