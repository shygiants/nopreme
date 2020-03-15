import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RejectExchangeMutation($input: RejectExchangeInput!) {
        rejectExchange(input: $input) {
            rejectedExchangeId
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
                    key: 'AcceptedExchangeList_accepted'
                }],
                pathToConnection: ['exchangeList', 'accepted'],
                deletedIDFieldName: 'rejectedExchangeId',
            }],
            onCompleted,
        },
    );
}

export default {commit};