import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Text, Button} from 'grommet';

import {Transaction} from 'grommet-icons';

import MatchItem from './MatchItem';

class ExchangeApp extends Component {

    handleClick() {
        // const {viewer, match, onExchangeRequest, onExchangeCancel, onExchangeReject, exchange} = this.props;

        // if (!exchange) 
        //     return onExchangeRequest(match);

        // switch (viewer.userId) {
        //     case exchange.requestor.userId:
        //         onExchangeCancel(exchange);
        //         break;
        //     case exchange.acceptor.userId:
        //         onExchangeReject(exchange);
        //         break;
        //     default:
        //         throw new Error();
        // }
    }

    getButtonLabel() {
        const {viewer, exchange} = this.props;

        if (!exchange) 
            return '교환 신청';

        switch (viewer.userId) {
            case exchange.requestor.userId:
                return '신청 취소';
            case exchange.acceptor.userId:
                return '신청 거절';
            default:
                throw new Error();
        }
    }

    render() {
        const {exchange} = this.props;

        const {reqPosessionItem, accPosessionItem, acceptor, requestor} = exchange;

        return (
            <Box
                direction='column'
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

                    <MatchItem user={requestor} item={reqPosessionItem} />
                    
                    <Transaction />

                    <MatchItem user={acceptor} item={accPosessionItem} />

                </Box>

                <Box 
                    direction='row'
                >
                    <Text 
                        size='xsmall' 
                        color='dark-3'
                        truncate
                    >
                        {reqPosessionItem.goods.name}
                    </Text>
                </Box>
                <Button 
                    href={exchange.status !== 'REJECTED' ? exchange.acceptor.openChatLink : null} 
                    target='_blank' 
                    fill='horizontal' 
                    primary
                    color='#f7ce46'
                    disabled={exchange.status === 'REJECTED'}
                    label={(
                        <Box
                            direction='column'
                            fill='horizontal'
                            align='center'
                        >       
                            <Text
                                color='#1f1f1f'
                                textAlign='center'
                            >
                                {exchange.status === 'REJECTED' ? '거절됨' : '오픈 채팅으로 연락하기'}
                            </Text>
                        </Box>
                    )} />
                <Button 
                    fill='horizontal' 
                    onClick={this.handleClick.bind(this)} 
                    label={this.getButtonLabel.bind(this)()} />
            </Box>  
        );
    }
}

export default createFragmentContainer(ExchangeApp, {
    viewer: graphql`
        fragment ExchangeApp_viewer on User {
            id
            userId
        }
    `,
    exchange: graphql`
        fragment ExchangeApp_exchange on Exchange {
            id
            exchangeId
            acceptor {
                id
                userId
                openChatLink
                ...MatchItem_user                
            }
            requestor {
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
            status
        }
    `,
});