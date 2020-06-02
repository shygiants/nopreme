import {
    graphql,
    commitMutation,
} from 'react-relay';

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
                    img
                    members {
                        id
                        memberId
                        name
                    }
                }              
            }
        }
    }
`;


function commit(environment, {
    idx, 
    memberIds, 
    goodsId, 
    itemList,
}, onCompleted=() => {}) {
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
            configs: [{
                type: 'RANGE_ADD',
                parentID: itemList.id,
                connectionInfo: [{
                    key: 'GoodsEditor_items',
                    rangeBehavior: 'append',
                }],
                edgeName: 'itemEdge',
            }],
            onCompleted,
        },
    );
}

export default {commit};