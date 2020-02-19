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

function sharedUpdater(store, exchangeList, deletedExchangeId) {
    if (exchangeList === undefined) return;
    const exchangeListProxy = store.get(exchangeList.id);
    const conn = ConnectionHandler.getConnection(exchangeListProxy, 'Feed_exchanges');
    ConnectionHandler.deleteNode(conn, deletedExchangeId);
  }

function commit(environment, exchange, exchangeList) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    exchangeId: exchange.exchangeId,
                },
            },
            updater: store => {
                const payload = store.getRootField('removeExchange');
                const deletedExchangeId = payload.getValue('deletedExchangeId');
                sharedUpdater(store, exchangeList, deletedExchangeId);
            }
        },
    );
}

export default {commit};