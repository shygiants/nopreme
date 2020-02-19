import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddWishMutation($input: AddWishInput!) {
        addWish(input: $input) {
            wishEdge {
                __typename
                cursor
                node {
                    id
                    wishId
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
    const conn = ConnectionHandler.getConnection(viewerProxy, 'Item_wishes', {goodsId});
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
                const payload = store.getRootField('addWish');
                const newEdge = payload.getLinkedRecord('wishEdge');
                sharedUpdater(store, viewer, item.goods.goodsId, newEdge);
            }
        },
    );
}

export default {commit};