import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddCollectionMutation($input: AddCollectionInput!) {
        addCollection(input: $input) {
            collectionEdge {
                __typename
                cursor
                node {
                    id
                    collectionId
                    item {
                        id
                        itemId
                        idx
                    }
                    num
                }              
            }
        }
    }
`;

function sharedUpdater(store, viewer, goodsId, newEdge) {
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'Item_collects', {goodsId});
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
  }

function commit(environment, item, viewer, num=1) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    itemId: item.itemId, num,
                },
            },
            updater: store => {
                const payload = store.getRootField('addCollection');
                const newEdge = payload.getLinkedRecord('collectionEdge');
                sharedUpdater(store, viewer, item.goods.goodsId, newEdge);
            }
        },
    );
}

export default {commit};