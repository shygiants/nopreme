import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RemoveCollectionMutation($input: RemoveCollectionInput!) {
        removeCollection(input: $input) {
            deletedCollectionId
        }
    }
`;

function sharedUpdater(store, viewer, goodsId, deletedCollectionId) {
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'Item_collects', {goodsId});
    ConnectionHandler.deleteNode(conn, deletedCollectionId);
  }

function commit(environment, item, viewer) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    itemId: item.itemId,
                },
            },
            updater: store => {
                const payload = store.getRootField('removeCollection');
                const deletedCollectionId = payload.getValue('deletedCollectionId');
                sharedUpdater(store, viewer, item.goods.goodsId, deletedCollectionId);
            }
        },
    );
}

export default {commit};