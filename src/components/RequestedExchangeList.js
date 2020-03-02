import React, {
    Component
} from 'react';
import {graphql, createRefetchContainer} from 'react-relay';
import {Box, Text} from 'grommet';

import RequestedExchangeCard from './RequestedExchangeCard'

import RemoveExchangeMutation from '../mutations/RemoveExchangeMutation';
import ResolveExchangeMutation from '../mutations/ResolveExchangeMutation';

import {getNodesFromConnection} from '../utils';

class RequestedExchangeList extends Component {
    componentDidMount() {
        const {exchangeList, onChange} = this.props;

        onChange(exchangeList.requested.edges.length);
    }

    componentDidUpdate(prevProps) {
        const {exchangeList, onChange} = this.props;

        if (prevProps.exchangeList.requested.edges.length !== exchangeList.requested.edges.length)
            onChange(exchangeList.requested.edges.length);
    }

    handleExchangeCancel(exchange) {
        const {relay, exchangeList} = this.props;
        RemoveExchangeMutation.commit(relay.environment, exchange, exchangeList);
    }

    handleExchangeApproval(exchange) {
        const {relay, exchangeList} = this.props;
        ResolveExchangeMutation.commit(relay.environment, exchange, exchangeList, true);
    }

    render() {
        const {router, exchangeList} = this.props;

        const exchanges =  getNodesFromConnection(exchangeList.requested);

        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
                align='center'
                gap='medium'
            >
                {exchanges.map(exchange => (
                    <RequestedExchangeCard 
                        key={exchange.id} 
                        router={router}
                        exchange={exchange}
                        onExchangeCancel={this.handleExchangeCancel.bind(this)}
                        onExchangeApproval={this.handleExchangeApproval.bind(this)}
                    />                            
                ))}
                {exchanges.length === 0 && (
                    <Box
                        margin='large'
                    >
                        <Text>보낸 교환 신청이 없습니다</Text>
                    </Box>
                )}
            </Box>
        );
    }
}

export default createRefetchContainer(RequestedExchangeList, {
    exchangeList: graphql`
        fragment RequestedExchangeList_exchangeList on ExchangeList {
            id
            requested(
                # TODO: Pagination
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "RequestedExchangeList_requested") {
                edges {
                    node {
                        id
                        ...RequestedExchangeCard_exchange
                    }
                }
            }
        }
    `,
}, graphql`
    query RequestedExchangeListRefetchQuery {
        viewer {
            ...Feed_viewer
        }
        matchList {
            ...Feed_matchList
        }
        exchangeList {
            ...Feed_exchangeList
        }
    }
`)