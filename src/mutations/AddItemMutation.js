import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddItemMutation($input: AddItemInput!) {
        addItem(input: $input) {
            itemEdge {
                __typename
                cursor
                node {
                    id
                    itemId
                    idx
                }              
            }
        }
    }
`;

function sharedUpdater(store, goods, newEdge) {
    const goodsProxy = store.get(goods.id);
    const conn = ConnectionHandler.getConnection(goodsProxy, 'ItemList_items');
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
  }

function commit(environment, idx, memberIds, goods) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    idx, 
                    memberIds,
                    goodsId: goods.goodsId,
                },
            },
            updater: store => {
                const payload = store.getRootField('addItem');
                const newEdge = payload.getLinkedRecord('itemEdge');
                sharedUpdater(store, goods, newEdge);
            }
        },
    );
}

export default {commit};