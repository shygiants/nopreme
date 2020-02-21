import {
    mutationWithClientMutationId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import {
    GraphQLUser
} from '../nodes';
import {
    modifyUser,
    getUserById,
} from '../../database';

export const ModifyUserMutation = mutationWithClientMutationId({
    name: 'ModifyUser',
    inputFields: {
        name: {
            type: GraphQLString,
        }, 
        openChatLink: {
            type: GraphQLString,
        }
    },
    outputFields: {
        user: {
            type: new GraphQLNonNull(GraphQLUser),
            resolve: ({userId}) => getUserById(userId),
        },
    },
    mutateAndGetPayload: ({
        name,
        openChatLink,
    }, {user: {id: userId}}) => {
        return modifyUser(userId, {name, openChatLink}).then(userId => ({userId}));
    },
});