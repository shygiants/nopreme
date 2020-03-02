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
    const conn = ConnectionHandler.getConnection(exchangeListProxy, 'AcceptedExchangeList_accepted');
    ConnectionHandler.deleteNode(conn, rejectedExchangeId);
  }

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
            updater: store => {
                const payload = store.getRootField('rejectExchange');
                const rejectedExchangeId = payload.getValue('rejectedExchangeId');
                sharedUpdater(store, exchangeList, rejectedExchangeId);
            },
            onCompleted,
        },
    );
}

export default {commit};