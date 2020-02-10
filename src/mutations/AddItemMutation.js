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

function sharedUpdater(store, itemList, newEdge) {
    const itemListProxy = store.get(itemList.id);
    const conn = ConnectionHandler.getConnection(itemListProxy, 'GoodsApp_items');
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
  }

function commit(environment, idx, memberIds, goodsId, itemList) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    idx, 
                    memberIds,
                    goodsId: goodsId,
                },
            },
            updater: store => {
                const payload = store.getRootField('addItem');
                const newEdge = payload.getLinkedRecord('itemEdge');
                sharedUpdater(store, itemList, newEdge);
            }
        },
    );
}

export default {commit};