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

export const RemovePosessionMutation = mutationWithClientMutationId({
    name: 'RemovePosession',
    inputFields: {
        itemId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        deletedPosessionId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({userItemId}) => toGlobalId('Posession', userItemId),
        },
    },
    mutateAndGetPayload: ({
        itemId,
    }, {user: {id}}) => {
        return getUserById(id).then(user => {
            const userId = user._id;

            return removeUserItem(userId, itemId, 'Posession').then(userItemId => ({userItemId}));
        });
    },
});
