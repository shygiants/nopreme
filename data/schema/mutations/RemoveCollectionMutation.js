import {
    mutationWithClientMutationId,
    toGlobalId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import {
    getUserById,
    removeUserItem
} from '../../database';

export const RemoveCollectionMutation = mutationWithClientMutationId({
    name: 'RemoveCollection',
    inputFields: {
        itemId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        deletedCollectionId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({userItemId}) => toGlobalId('Collection', userItemId),
        },
    },
    mutateAndGetPayload: ({
        itemId,
    }, {user: {id}}) => {
        return getUserById(id).then(user => {
            const userId = user._id;

            return removeUserItem(userId, itemId, 'Collection').then(userItemId => ({userItemId}));
        });
    },
});