import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
    toGlobalId,
} from 'graphql-relay';
import { GraphQLNonNull, GraphQLID } from 'graphql';
import { getUserById } from '../../database/User';
import { addBlock } from '../../database/Block';


export const BlockUserMutation = mutationWithClientMutationId({
    name: 'BlockUser',
    inputFields: {
        userId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    }, 
    outputFields: {
        blockedUserId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({userId}) => toGlobalId('User', userId),
        },
    },
    mutateAndGetPayload: ({
        userId,
    }, {user: {id}}) => {
        return Promise.all([id, userId].map(getUserById)).then(([
            viewer, user,
        ]) => {
            if ([viewer, user].some(u => u === null)) return null;

            return addBlock(viewer._id, user._id).then(blockId => ({userId}));
        });
    }
});