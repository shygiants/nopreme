import React, {Component} from 'react';
import {Box, Text, Button, Menu, Stack} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction, LinkNext, Flag, More} from 'grommet-icons';

import CopyToClipboard from './CopyToClipboard';
import MatchItem from './MatchItem';
import Dialog from './Dialog';
import UserItemCard from './UserItemCard';

class MatchCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resolving: false,
            confirmingReject: false, 
            confirmingCancel: false,
        };

        this.mainButton = this.mainButton.bind(this);
        this.subButton = this.subButton.bind(this);
        this.approvalTryDialog = this.approvalTryDialog.bind(this);
        this.confirmDialog = this.confirmDialog.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    get isExchangeAccepted() {
        const {viewer, exchange} = this.props;

        switch (viewer.userId) {
            case exchange.requestor.userId:
                return false;
            case exchange.acceptor.userId:
                return true;
            default:
                throw new Error('Invalid value');
        }
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

    getApprovalButtonLabel() {
        const {viewer, exchange} = this.props;

        switch (viewer.userId) {
            case exchange.requestor.userId:
                // return '교환 승인';
                if (exchange.approvedByAcceptor)
                    return '교환 승인';
                else if (exchange.approvedByRequestor)
                    return '승인 대기중';
                else
                    return '교환 결과 미리 반영';
            case exchange.acceptor.userId:
                return '교환 승인';
            default:
                throw new Error();
        }
    }

    handleApprovalTry() {
        this.setState({
            resolving: true,
        });
    }

    handleClose() {
        this.setState({
            resolving: false,
            confirmingReject: false, 
            confirmingCancel: false,
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

    mainButton() {
        const {exchange} = this.props;

        if (!exchange) return false;

        let options;

        if (this.isExchangeAccepted) {
            // Accepted
            options = {
                label: '교환 승인',
                onClick: this.handleApprovalTry.bind(this),
            }

        } else {
            // Requested
            options = {
                color: '#f7ce46' // kakao
            }

            if (this.isExchangeRejected) {
                options = {
                    ...options,
                    disabled: true,
                    label: '거절됨',
                };
            } else if (this.isExchangeApprovedByAcceptor) {
                // Resolve exchange
                options = {
                    label: '교환 승인 확인',
                    onClick: this.handleApprovalTry.bind(this),
                };

            } else {
                // This is open chat button
                options = {
                    ...options, 
                    href: exchange.acceptor.openChatLink,
                    target: '_blank',
                    label: (
                        <Box
                            direction='column'
                            fill='horizontal'
                            align='center'
                        >       
                            <Text
                                color='#1f1f1f'
                                textAlign='center'
                            >
                                오픈 채팅으로 연락하기
                            </Text>
                        </Box>
                    )
                };
            }
        }

        return (
            <Button 
                fill='horizontal' 
                primary
                {...options}
            />
        );
    }

    subButton() {
        const {match, exchange, onExchangeRequest, onExchangeCancel, onExchangeReject} = this.props;

        let options;

        if (!exchange) {
            options = {
                label: '교환 신청',
                onClick: () => onExchangeRequest(match),
            };
        } else {
            if (this.isExchangeAccepted) {
                // Accepted
                options = {
                    label: '교환 거절',
                    onClick: () => this.setState({confirmingReject: true}),
                };
            } else {
                // Requested
                options = {
                    onClick: () => this.isExchangeRejected ? onExchangeCancel(exchange) : this.setState({confirmingCancel: true}),
                    label: this.isExchangeRejected ? '확인' : '신청 취소',
                }
            }
        }

        return (
            <Button
                fill='horizontal'
                {...options}
            />
        );
    }

    approvalTryDialog() {
        const {resolving} = this.state;
        const {exchange} = this.props;

        let posessionItem, wishItem;
        if (this.isExchangeAccepted) {
            posessionItem = exchange.accPosessionItem;
            wishItem = exchange.reqPosessionItem;
        } else {
            posessionItem = exchange.reqPosessionItem;
            wishItem = exchange.accPosessionItem;
        }

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
        const {confirmingReject, confirmingCancel} = this.state;
        const {onExchangeReject, onExchangeCancel, exchange} = this.props;

        const confirming = confirmingReject || confirmingCancel;
        let task, onAction; 
        if (confirmingReject) {
            task = '거절';
            onAction = onExchangeReject;
        }
            
        if (confirmingCancel) {
            task = '취소';
            onAction = onExchangeCancel;
        }

        return (
            <Dialog 
                show={confirming}
                title={`교환 신청 ${task}`}
                message={`정말 교환 신청을 ${task}하시겠습니까?`}
                actions={[{
                    name: 'no',
                    label: '아니오',
                }, {
                    name: 'yes',
                    label: '예',
                    primary: true,
                }]}
                onAction={actionName => actionName === 'yes' ? onAction(exchange) : this.handleClose()}
                onClose={this.handleClose}
        />);
    }

    render() {
        const {resolving} = this.state;
        const {viewer, match, exchange, router} = this.props;

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
                        onClick={exchange && router && this.handleRootClick.bind(this)}
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

                    
                    {exchange && !this.isExchangeAccepted && !this.isExchangeRejected && !this.isExchangeApprovedByAcceptor && (
                        <CopyToClipboard value={`http://${process.env.PUBLIC_URL}/#/exchanges/${exchange.exchangeId}`} />
                    )}

                    {this.mainButton()}
                    {this.subButton()}
                    {exchange && this.approvalTryDialog()}
                    {exchange && this.confirmDialog()}

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
            approvedByRequestor
            approvedByAcceptor
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
                ...UserItemCard_item
            }
            accPosessionItem {
                id
                itemId
                goods {
                    id
                    name
                }
                ...MatchItem_item
                ...UserItemCard_item
            }
            status
        }
    `,
})
