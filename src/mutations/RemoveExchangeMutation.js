import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RemoveExchangeMutation($input: RemoveExchangeInput!) {
        removeExchange(input: $input) {
            deletedExchangeId
        }
    }
`;

function commit(environment, exchange, exchangeList, onCompleted=() => {}) {
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
                    key: 'RequestedExchangeList_requested'
                }],
                pathToConnection: ['exchangeList', 'requested'],
                deletedIDFieldName: 'deletedExchangeId',
            }],
            onCompleted,
        },
    );
}

export default {commit};