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
    removeUserItem,
    isUserItemRemovable,
    RelationTypeEnum
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

            return isUserItemRemovable(userId, itemId, RelationTypeEnum.COLLECTION).then(removable => {
                if (!removable) return null;

                return removeUserItem(userId, itemId, RelationTypeEnum.COLLECTION).then(userItemId => ({userItemId}));
            });
        });
    },
});