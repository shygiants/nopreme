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

function sharedUpdater(store, exchangeList, resolvedExchangeId, fromRequested) {
    if (exchangeList === undefined) return;
    const exchangeListProxy = store.get(exchangeList.id);
    const conn = ConnectionHandler.getConnection(exchangeListProxy, fromRequested? 'RequestedExchangeList_requested' : 'AcceptedExchangeList_accepted');
    ConnectionHandler.deleteNode(conn, resolvedExchangeId);
  }

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
            updater: store => {
                const payload = store.getRootField('resolveExchange');
                const resolvedExchangeId = payload.getValue('resolvedExchangeId');
                sharedUpdater(store, exchangeList, resolvedExchangeId, fromRequested);
            },
            onCompleted,
        },
    );
}

export default {commit};