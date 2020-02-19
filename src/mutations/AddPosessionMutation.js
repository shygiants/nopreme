import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddPosessionMutation($input: AddPosessionInput!) {
        addPosession(input: $input) {
            posessionEdge {
                __typename
                cursor
                node {
                    id
                    posessionId
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
    const conn = ConnectionHandler.getConnection(viewerProxy, 'Item_posesses', {goodsId});
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
                const payload = store.getRootField('addPosession');
                const newEdge = payload.getLinkedRecord('posessionEdge');
                sharedUpdater(store, viewer, item.goods.goodsId, newEdge);
            }
        },
    );
}

export default {commit};