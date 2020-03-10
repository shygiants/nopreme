import React, {Component} from 'react';
import {Box, Text, Button, Menu, Stack} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction, LinkNext, Flag, More, Location} from 'grommet-icons';

import MatchItem from './MatchItem';
import Dialog from './Dialog';
import UserItemCard from './UserItemCard';

const methods = {
    DIRECT: '직거래',
    POST: '준등기',
    DONTCARE: '상관 없음',
}


class AcceptedExchangeCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resolving: false,
            confirming: false, 
        };

        this.approvalTryDialog = this.approvalTryDialog.bind(this);
        this.confirmDialog = this.confirmDialog.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    get isExchangeRejected() {
        const {exchange} = this.props;

        return exchange.status === 'REJECTED';
    }

    get isExchangeApprovedByAcceptor() {
        const {exchange} = this.props;

        return exchange.approvedByAcceptor;
    }

    handleReport() {
        // TODO: Report

    }

    handleRootClick() {
        const {exchange, router} = this.props;

        router.push(`/exchanges/${exchange.exchangeId}`);
    }

    handleApprovalTry() {
        this.setState({
            resolving: true,
        });
    }

    handleClose() {
        this.setState({
            resolving: false,
            confirming: false, 
        });
    }

    handleApproval(actionName) {
        const {exchange, onExchangeApproval} = this.props;

        switch (actionName) {
            case 'cancel':
                break;
            case 'approve':
                onExchangeApproval(exchange);
                break;
            default: 
                throw new Error();
        }

        this.handleClose();
    }

    approvalTryDialog() {
        const {resolving} = this.state;
        const {exchange} = this.props;

        const posessionItem = exchange.accPosessionItem;
        const wishItem = exchange.reqPosessionItem;

        return (
            <Dialog 
                show={resolving}
                title='교환 승인'
                message={(
                    <Box
                        direction='column'
                        align='center'
                        gap='xsmall'
                    > 
                        <Box
                            direction='row'
                            align='center'
                            gap='small'
                        >
                            <UserItemCard
                                item={posessionItem}
                                relationType='보유'
                            />
                            <UserItemCard
                                item={wishItem}
                                relationType='희망'
                            />

                            <LinkNext />

                            <UserItemCard
                                item={wishItem}
                                relationType='수집'
                            />
                        </Box>
                        <Text>위의 사항을 반영합니다.</Text>
                    </Box>
                )}
                actions={[{
                    name: 'cancel',
                    label: '취소',
                }, {
                    name: 'approve',
                    label: '확인',
                    primary: true,
                }]}
                onAction={this.handleApproval.bind(this)}
                onClose={this.handleClose}
        />);
    }

    confirmDialog() {
        const {confirming} = this.state;
        const {onExchangeReject, exchange} = this.props;    
        
        return (
            <Dialog 
                show={confirming}
                title='교환 신청 거절'
                message='정말 교환 신청을 거절하시겠습니까?'
                actions={[{
                    name: 'no',
                    label: '아니오',
                }, {
                    name: 'yes',
                    label: '예',
                    primary: true,
                }]}
                onAction={actionName => actionName === 'yes' ? onExchangeReject(exchange) : this.handleClose()}
                onClose={this.handleClose}
        />);
    }

    render() {
        const {exchange, router} = this.props;
        
        const {reqPosessionItem, accPosessionItem, acceptor, requestor} = exchange;
        
        return (
            <Stack 
                anchor="top-right"
                fill
            >
                <Box
                    direction='column'
                    round='medium'
                    background='#FFFFFF'
                    align='center'
                    pad='medium'
                    gap='small'
                >
                    <Box 
                        direction='row'
                        align='center'
                        gap='xsmall'
                    >
                        <Location size='small' />
                        <Text 
                            size='xsmall' 
                            color='dark-3'
                            truncate
                        >
                            {requestor.regions.length === 0 ? '전체 지역' : requestor.regions[0].displayName}
                        </Text>
                        <Transaction size='small' />
                        <Text 
                            size='xsmall' 
                            color='dark-3'
                            truncate
                        >
                            {methods[requestor.method]}
                        </Text>
                    </Box>

                    <Box
                        onClick={router && this.handleRootClick.bind(this)}
                        focusIndicator={false}
                        direction='row'
                        align='center'
                        justify='between'
                        fill='horizontal'
                        margin={{bottom: 'small'}}
                    >

                        <MatchItem user={acceptor} item={accPosessionItem} />
                        
                        <Transaction />

                        <MatchItem user={requestor} item={reqPosessionItem} />

                    </Box>

                    <Button 
                        fill='horizontal' 
                        primary
                        label='교환 승인'
                        onClick={this.handleApprovalTry.bind(this)}
                    />
                    <Button
                        fill='horizontal'
                        label='교환 거절'
                        onClick={() => this.setState({confirming: true})}
                    />
                    
                    {this.approvalTryDialog()}
                    {this.confirmDialog()}

                </Box>  

                <Menu
                    dropAlign={{right: 'right', top: 'bottom'}}
                    size='small'
                    label={<Box pad='xsmall'><More size='18px'/></Box>}
                    icon={false}
                    items={[{
                        label: '신고하기', 
                        onClick: this.handleReport.bind(this), 
                        icon: (
                            <Box pad='small' align='center'><Flag size='small'/></Box>
                        )
                    }]}
                />
            </Stack>
            
        );
    }
}

export default createFragmentContainer(AcceptedExchangeCard, {
    exchange: graphql`
        fragment AcceptedExchangeCard_exchange on Exchange {
            id
            exchangeId
            approvedByAcceptor
            acceptor {
                id
                ...MatchItem_user                
            }
            requestor {
                id
                regions {
                    id
                    regionId
                    stateCode
                    stateName
                    cityCode
                    cityName
                    parentCityCode
                    parentCityName
                    displayName
                }
                method
                ...MatchItem_user                
            }
            reqPosessionItem {
                id
                ...MatchItem_item
                ...UserItemCard_item
            }
            accPosessionItem {
                id
                ...MatchItem_item
                ...UserItemCard_item
            }
            status
        }
    `,
})
