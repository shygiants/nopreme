import {
    graphql,
    commitMutation,
} from 'react-relay';

const mutation = graphql`
    mutation ModifyItemMutation($input: ModifyItemInput!) {
        modifyItem(input: $input) {
            itemEdge {
                __typename
                cursor
                node {
                    id
                    itemId
                    idx
                    img
                }              
            }
        }
    }
`;

function commit(environment, {id, idx, memberIds, goods, img}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    id,
                    idx, 
                    memberIds,
                    goodsId: goods && goods.goodsId,
                    img,
                },
            },
        },
    );
}

export default {commit};