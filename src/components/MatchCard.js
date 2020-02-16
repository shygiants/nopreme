import React, {Component} from 'react';
import {Box, Text, Button, TextInput, Layer} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction, StatusGood, FormClose} from 'grommet-icons';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import MatchItem from './MatchItem';

class MatchCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            copied: false,
        }
    }

    handleCopy() {
        this.setState({copied: true});
    }

    handleClose() {
        this.setState({copied: false});
    }

    handleClick() {
        const {viewer, match, onExchangeRequest, onExchangeCancel, onExchangeReject, exchange} = this.props;

        if (!exchange) 
            return onExchangeRequest(match);

        switch (viewer.userId) {
            case exchange.requestor.userId:
                onExchangeCancel(exchange);
                break;
            case exchange.acceptor.userId:
                onExchangeReject(exchange);
                break;
            default:
                throw new Error();
        }
    }

    handleRootClick() {
        const {exchange, router} = this.props;

        router.push(`/exchanges/${exchange.exchangeId}`);
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
        const {viewer, match, exchange} = this.props;

        let leftItem, rightItem, acc, req;
        if (match !== null) {
            const {wishItem, posessionItem, user} = match;
            leftItem = posessionItem;
            rightItem = wishItem;
            acc = user;
            req = viewer;
        }
        
        if (exchange !== null) {
            const {reqPosessionItem, accPosessionItem, acceptor, requestor} = exchange;
            leftItem = reqPosessionItem;
            rightItem = accPosessionItem;
            acc = acceptor;
            req = requestor;
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
                    onClick={exchange && this.handleRootClick.bind(this)}
                    focusIndicator={false}
                    direction='row'
                    align='center'
                    justify='between'
                    fill='horizontal'
                >

                    <MatchItem user={req} item={leftItem} />
                    
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
                    <Box
                        direction='row'
                        gap='small'
                        align='center'
                        fill='horizontal'
                    >
                        <TextInput id='foo' size='small' value={`http://localhost:4000/#/exchanges/${exchange.exchangeId}`}></TextInput>
                        <CopyToClipboard 
                            text={`http://localhost:4000/#/exchanges/${exchange.exchangeId}`}
                            onCopy={this.handleCopy.bind(this)}>
                            <Button fill='horizontal' label='복사' />
                        </CopyToClipboard>

                    </Box>
                )}

                {this.state.copied && (
                    <Layer
                        position="top"
                        full='horizontal'
                        modal={false}
                        margin={{ vertical: "medium", horizontal: "small" }}
                        onEsc={this.handleClose.bind(this)}
                        responsive={false}
                        plain
                    >
                        <Box
                            align="center"
                            direction="row"
                            gap="small"
                            justify="between"
                            round="medium"
                            elevation="medium"
                            pad={{ vertical: "xsmall", horizontal: "small" }}
                            background="status-ok"
                        >
                            <Box align="center" direction="row" gap="xsmall">
                                <StatusGood />
                                <Text>링크 복사 완료! 오픈 채팅방에 공유하세요.</Text>
                            </Box>
                            <Button icon={<FormClose />} onClick={this.handleClose.bind(this)} plain />
                        </Box>
                    </Layer>
                )}

                {exchange && (
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
                )}
                <Button 
                    fill='horizontal' 
                    onClick={this.handleClick.bind(this)} 
                    label={this.getButtonLabel.bind(this)()} />
            </Box>  
        );
    }
}

export default createFragmentContainer(MatchCard, {
    viewer: graphql`
        fragment MatchCard_viewer on User {
            id
            userId
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
})
