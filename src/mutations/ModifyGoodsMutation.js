import {
    graphql,
    commitMutation,
} from 'react-relay';

const mutation = graphql`
    mutation ModifyGoodsMutation($input: ModifyGoodsInput!) {
        modifyGoods(input: $input) {
            goodsEdge {
                __typename
                cursor
                node {
                    id
                    goodsId
                    name
                    description
                    img
                }              
            }
        }
    }
`;

function commit(environment, {
    id, 
    eventId, 
    name, 
    description, 
    img
}, onCompleted=() => {}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    id,
                    eventId, 
                    name,
                    description,
                    img,
                },
            },
            onCompleted,
        },
    );
}

export default {commit};