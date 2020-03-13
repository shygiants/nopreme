import {
    graphql,
    commitMutation,
} from 'react-relay';

const mutation = graphql`
    mutation BlockUserMutation($input: BlockUserInput!) {
        blockUser(input: $input) {
            blockedUserId
        }
    }
`;

function commit(environment, user, onCompleted=() => {}) {
    return commitMutation(
        environment,
        {
            mutation,
            variables: {
                input: {
                    userId: user.userId,
                },
            },
            onCompleted,
        }
    );
}

export default {commit};