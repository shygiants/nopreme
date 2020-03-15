import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddExchangeMutation($input: AddExchangeInput!) {
        addExchange(input: $input) {
            exchangeEdge {
                __typename
                cursor
                node {
                    id
                    exchangeId
                    acceptor {
                        id
                        userId
                        openChatLink
                    }
                    requestor {
                        id
                        userId
                    }
                    reqPosessionItem {
                        id
                        itemId
                    }
                    accPosessionItem {
                        id
                        itemId
                    }
                    status
                }
            }
        }
    }
`;

function commit(environment, match, exchangeList, onCompleted=() => {}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    wishItemId: match.wishItem.itemId,
                    posessionItemId: match.posessionItem.itemId,
                    acceptorId: match.user.userId, 
                },
            },
            configs: [{
                type: 'RANGE_ADD',
                parentID: exchangeList.id,
                connectionInfo: [{
                    key: 'RequestedExchangeList_requested',
                    rangeBehavior: 'prepend'
                }],
                edgeName: 'exchangeEdge',
            }],
            onCompleted,
        },
    );
}

export default {commit};