import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Text, Button} from 'grommet';

import RemoveExchangeMutation from '../mutations/RemoveExchangeMutation';
import RejectExchangeMutation from '../mutations/RejectExchangeMutation';
import ResolveExchangeMutation from '../mutations/ResolveExchangeMutation';

import RequestedExchangeCard from './RequestedExchangeCard';
import AcceptedExchangeCard from './AcceptedExchangeCard';

class ExchangeApp extends Component {
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

    get isExchangeComplete() {
        const {exchange} = this.props;

        return exchange.status === 'COMPLETE';
    }

    get isExchangeApprovedByAcceptor() {
        const {exchange} = this.props;

        return exchange.approvedByAcceptor;
    }

    handleExchangeCancel(exchange) {
        const {relay} = this.props;
        RemoveExchangeMutation.commit(relay.environment, exchange, null, this.moveToHome);
    }

    handleExchangeReject(exchange) {
        const {relay} = this.props;
        RejectExchangeMutation.commit(relay.environment, exchange, null, this.moveToHome);
    }

    handleExchangeApproval(exchange) {
        const {relay} = this.props;
        ResolveExchangeMutation.commit(relay.environment, exchange, null, this.moveToHome);
    }

    moveToHome() {
        window.location = '/';
    }

    render() {
        const {viewer, exchange} = this.props;

        const completeComp = (
            <Box pad='large'>
                <Text>이미 완료된 교환입니다.</Text>
                <Button onClick={this.moveToHome.bind(this)} label='홈으로' />
            </Box>
        );

        if (this.isExchangeComplete) {
            return completeComp;
        }

        if (this.isExchangeAccepted) {
            // Accepted
            if (this.isExchangeApprovedByAcceptor || this.isExchangeRejected) {
                return completeComp;
            }
        }

        if (this.isExchangeAccepted) {
            return (
                <AcceptedExchangeCard
                    exchange={exchange}
                    onExchangeReject={this.handleExchangeReject.bind(this)}
                    onExchangeApproval={this.handleExchangeApproval.bind(this)}
                />
            );
            
        } else {
            return (
                <RequestedExchangeCard
                    exchange={exchange}
                    onExchangeCancel={this.handleExchangeCancel.bind(this)}
                    onExchangeApproval={this.handleExchangeApproval.bind(this)}
                />
            );
        }
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
            ...RequestedExchangeCard_exchange
            ...AcceptedExchangeCard_exchange
            requestor {
                id
                userId
            }
            acceptor {
                id
                userId
            }
            approvedByAcceptor
            status
        }
    `,
});