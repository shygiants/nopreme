import {
    graphql,
    commitMutation,
} from 'react-relay';

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
                    img
                    description
                }              
            }
        }
    }
`;

function commit(environment, {
    name, 
    event, 
    artist,
    img,
    description
}, onCompleted=() => {}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    name, 
                    eventId: event.eventId, 
                    artistId: artist.artistId,
                    img,
                    description,
                },
            },
            configs: [{
                type: 'RANGE_ADD',
                parentID: event.id,
                connectionInfo: [{
                    key: 'EventGoodsList_goodsList',
                    rangeBehavior: 'append',
                    filters: {artistName: artist.name},
                }],
                edgeName: 'goodsEdge',
            }],
            onCompleted,
        },
    );
}

export default {commit};