import React, {
    Component
} from 'react';
import {graphql, createRefetchContainer} from 'react-relay';
import {Box, Text} from 'grommet';

import AcceptedExchangeCard from './AcceptedExchangeCard'

import ResolveExchangeMutation from '../mutations/ResolveExchangeMutation';
import RejectExchangeMutation from '../mutations/RejectExchangeMutation';

import {getNodesFromConnection} from '../utils';

class AcceptedExchangeList extends Component {
    componentDidMount() {
        const {exchangeList, onChange} = this.props;

        onChange(exchangeList.accepted.edges.length);
    }

    componentDidUpdate(prevProps) {
        const {exchangeList, onChange} = this.props;

        if (prevProps.exchangeList.accepted.edges.length !== exchangeList.accepted.edges.length)
            onChange(exchangeList.accepted.edges.length);
    }

    handleExchangeReject(exchange) {
        const {relay, exchangeList} = this.props;
        RejectExchangeMutation.commit(relay.environment, exchange, exchangeList);
    }

    handleExchangeApproval(exchange) {
        const {relay, exchangeList} = this.props;
        ResolveExchangeMutation.commit(relay.environment, exchange, exchangeList, false);
    }

    render() {
        const {router, exchangeList} = this.props;

        const exchanges = getNodesFromConnection(exchangeList.accepted);

        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
                align='center'
                gap='medium'
            >
                {exchanges.map(exchange => (
                    <AcceptedExchangeCard 
                        key={exchange.id} 
                        router={router}
                        exchange={exchange}
                        onExchangeReject={this.handleExchangeReject.bind(this)}
                        onExchangeApproval={this.handleExchangeApproval.bind(this)}
                    />                            
                ))}
                {exchanges.length === 0 && (
                    <Box
                        margin='large'
                    >
                        <Text>받은 교환 신청이 없습니다</Text>
                    </Box>
                )}
            </Box>
        );
    }
}

export default createRefetchContainer(AcceptedExchangeList, {
    exchangeList: graphql`
        fragment AcceptedExchangeList_exchangeList on ExchangeList {
            id
            accepted(
                # TODO: Pagination
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "AcceptedExchangeList_accepted") {
                edges {
                    node {
                        id
                        ...AcceptedExchangeCard_exchange
                    }
                }
            }
        }
`,
}, graphql`
    query AcceptedExchangeListRefetchQuery {
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