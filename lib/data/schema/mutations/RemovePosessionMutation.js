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

            return isUserItemRemovable(userId, itemId, RelationTypeEnum.POSESSION).then(removable => {
                if (!removable) return null;

                return removeUserItem(userId, itemId, RelationTypeEnum.POSESSION).then(userItemId => ({userItemId}));
            });
        });
    },
});
