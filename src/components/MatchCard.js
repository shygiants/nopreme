import React, {Component} from 'react';
import {Box, Text, Button} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction} from 'grommet-icons';

import MatchItem from './MatchItem';
import AddExchangeMutation from '../mutations/AddExchangeMutation';

class MatchCard extends Component{
    handleClick() {
        const {match, onExchangeRequest, onExchangeCancel, exchange} = this.props;

        exchange? onExchangeCancel(exchange) : onExchangeRequest(match);
    }

    render() {
        const {viewer, match, exchange} = this.props;

        let leftItem, rightItem, acc;
        if (match !== null) {
            const {wishItem, posessionItem, user} = match;
            leftItem = wishItem;
            rightItem = posessionItem;
            acc = user;
        }
        
        if (exchange !== null) {
            const {reqPosessionItem, accPosessionItem, acceptor} = exchange;
            leftItem = accPosessionItem;
            rightItem = reqPosessionItem;
            acc = acceptor;
        }

        if (leftItem.goods.name !== rightItem.goods.name)
            throw new Error('`leftItem` and `rightItem` should be the same goods');

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

                    <MatchItem user={viewer} item={leftItem} />
                    
                    <Transaction />

                    <MatchItem user={acc} item={rightItem} />

                </Box>
                <Box 
                    direction='row'
                >
                    <Text 
                        size='xsmall' 
                        color='dark-3'
                        truncate
                    >
                        {leftItem.goods.name}
                    </Text>
                </Box>
                {exchange && (
                    <Button href={exchange.acceptor.openChatLink} target='_blank' fill='horizontal' label='오픈 채팅으로 연락하기' />
                )}
                <Button onClick={this.handleClick.bind(this)} fill='horizontal' label={exchange? '신청 취소' : '교환 신청'} />
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
    `,
    exchange: graphql`
        fragment MatchCard_exchange on Exchange {
            id
            exchangeId
            acceptor {
                id
                userId
                openChatLink
                ...MatchItem_user                
            }
            reqPosessionItem {
                id
                itemId
                goods {
                    id
                    name
                }
                ...MatchItem_item
            }
            accPosessionItem {
                id
                itemId
                goods {
                    id
                    name
                }
                ...MatchItem_item
            }
        }
    `,
})
