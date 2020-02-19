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

function sharedUpdater(store, exchangeList, rejectedExchangeId) {
    if (exchangeList === undefined) return;
    const exchangeListProxy = store.get(exchangeList.id);
    const conn = ConnectionHandler.getConnection(exchangeListProxy, 'Feed_exchanges');
    ConnectionHandler.deleteNode(conn, rejectedExchangeId);
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
                const payload = store.getRootField('rejectExchange');
                const rejectedExchangeId = payload.getValue('rejectedExchangeId');
                sharedUpdater(store, exchangeList, rejectedExchangeId);
            }
        },
    );
}

export default {commit};