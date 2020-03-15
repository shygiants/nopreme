import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation ResolveExchangeMutation($input: ResolveExchangeInput!) {
        resolveExchange(input: $input) {
            resolvedExchangeId
        }
    }
`;

function commit(environment, exchange, exchangeList, fromRequested, onCompleted=() => {}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    exchangeId: exchange.exchangeId,
                },
            },
            configs: [{
                type: 'RANGE_DELETE',
                parentID: exchangeList && exchangeList.id,
                connectionKeys: [{
                    key: fromRequested? 'RequestedExchangeList_requested' : 'AcceptedExchangeList_accepted',
                }],
                pathToConnection: ['exchangeList', fromRequested? 'requested' : 'accepted'],
                deletedIDFieldName: 'resolvedExchangeId'
            }],
            onCompleted,
        },
    );
}

export default {commit};