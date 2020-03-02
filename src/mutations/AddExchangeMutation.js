import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddExchangeMutation($input: AddExchangeInput!) {
        addExchange(input: $input) {
            exchangeEdge {
                __typename
                cursor
                node {
                    id
                    exchangeId
                    acceptor {
                        id
                        userId
                        openChatLink
                    }
                    requestor {
                        id
                        userId
                    }
                    reqPosessionItem {
                        id
                        itemId
                    }
                    accPosessionItem {
                        id
                        itemId
                    }
                    status
                }
            }
        }
    }
`;

function sharedUpdater(store, exchangeList, newEdge) {
    const eventProxy = store.get(exchangeList.id);
    const conn = ConnectionHandler.getConnection(eventProxy, 'RequestedExchangeList_requested');
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

function commit(environment, match, exchangeList, onCompleted=() => {}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    wishItemId: match.wishItem.itemId,
                    posessionItemId: match.posessionItem.itemId,
                    acceptorId: match.user.userId, 
                },
            },
            updater: store => {
                const payload = store.getRootField('addExchange');
                const newEdge = payload.getLinkedRecord('exchangeEdge');
                sharedUpdater(store, exchangeList, newEdge);
            },
            onCompleted,
        },
    );
}

export default {commit};