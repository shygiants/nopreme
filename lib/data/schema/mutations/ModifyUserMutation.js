import {
    mutationWithClientMutationId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
} from 'graphql';
import {
    GraphQLUser,
    MethodType,
} from '../nodes';
import {
    modifyUser,
    getUserById,
} from '../../database/User';
import { getRegionByCode } from '../../database/Region';

export const ModifyUserMutation = mutationWithClientMutationId({
    name: 'ModifyUser',
    inputFields: {
        name: {
            type: GraphQLString,
        }, 
        openChatLink: {
            type: GraphQLString,
        },
        regionCodes: {
            type: new GraphQLList(GraphQLString),
        },
        method: {
            type: MethodType,
        },
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
        regionCodes,
        method
    }, {user: {id: userId}}) => {
        return Promise.all(regionCodes.map(getRegionByCode)).then(regions => {
            return modifyUser(userId, {name, openChatLink, regions, method}).then(userId => ({userId}));
        });
    },
});