import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RemoveWishMutation($input: RemoveWishInput!) {
        removeWish(input: $input) {
            deletedWishId
        }
    }
`;

function sharedUpdater(store, viewer, goodsId, deletedWishId) {
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'Item_wishes', {goodsId});
    ConnectionHandler.deleteNode(conn, deletedWishId);
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
                const payload = store.getRootField('removeWish');
                const deletedWishId = payload.getValue('deletedWishId');
                sharedUpdater(store, viewer, item.goods.goodsId, deletedWishId);
            }
        },
    );
}

export default {commit};