import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} from 'graphql';
import {
    GraphQLItemEdge, GraphQLUser
} from '../nodes';
import {
    getItemsByGoodsId,
    getItemById,
    isAdmin,
    modifyItem,
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