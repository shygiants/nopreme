import {
    graphql,
    commitMutation,
} from 'react-relay';

const mutation = graphql`
    mutation ModifyUserMutation($input: ModifyUserInput!) {
        modifyUser(input: $input) {
            user {
                id
                userId
                name
                openChatLink
            }
        }
    }
`;

function commit(environment, {name, openChatLink, regionCodes, method}) {
    return new Promise((resolve, reject) => {
        return commitMutation(
            environment, 
            {
                mutation,
                variables: {
                    input: {
                        name, 
                        openChatLink,
                        regionCodes,
                        method,
                    },
                },
                onCompleted: resolve,
                onError: reject,
                // updater: store => {
                //     const payload = store.getRootField('modifyUser');
                //     const modifiedUser = payload.getLinkedRecord('user');
                //     const userProxy = store.get(modifiedUser.id);

                //     const newName = modifiedUser.getValue('name');
                //     const newOpenChatLink = modifiedUser.getValue('openChatLink');

                //     userProxy.setValue(newName, 'name')
                //     userProxy.setValue(newOpenChatLink, 'openChatLink')
                // }
            },
        );
    });
}

export default {commit};