import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RemovePosessionMutation($input: RemovePosessionInput!) {
        removePosession(input: $input) {
            deletedPosessionId
        }
    }
`;

function sharedUpdater(store, viewer, goodsId, deletedPosessionId) {
    const viewerProxy = store.get(viewer.id);
    const conn = ConnectionHandler.getConnection(viewerProxy, 'Item_posesses', {goodsId});
    ConnectionHandler.deleteNode(conn, deletedPosessionId);
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
                const payload = store.getRootField('removePosession');
                const deletedPosessionId = payload.getValue('deletedPosessionId');
                sharedUpdater(store, viewer, item.goods.goodsId, deletedPosessionId);
            }
        },
    );
}

export default {commit};