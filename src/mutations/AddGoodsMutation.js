import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddGoodsMutation($input: AddGoodsInput!) {
        addGoods(input: $input) {
            goodsEdge {
                __typename
                cursor
                node {
                    id
                    goodsId
                    name
                }              
            }
        }
    }
`;

function sharedUpdater(store, event, artistName, newEdge) {
    const eventProxy = store.get(event.id);
    const conn = ConnectionHandler.getConnection(eventProxy, 'GoodsList_goodsList', {artistName});
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
  }

function commit(environment, name, event, artist) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    name, 
                    eventId: event.eventId, 
                    artistId: artist.artistId,
                },
            },
            updater: store => {
                const payload = store.getRootField('addGoods');
                const newEdge = payload.getLinkedRecord('goodsEdge');
                sharedUpdater(store, event, artist.name, newEdge);
            }
        },
    );
}

export default {commit};