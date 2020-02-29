import {
    mutationWithClientMutationId,
    toGlobalId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import {
    removeUserItem,
    RelationTypeEnum,
    isUserItemRemovable
} from '../../database/UserItem';
import {
    getUserById,
} from '../../database/User';

export const RemoveWishMutation = mutationWithClientMutationId({
    name: 'RemoveWish',
    inputFields: {
        itemId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        deletedWishId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({userItemId}) => toGlobalId('Wish', userItemId),
        },
    },
    mutateAndGetPayload: ({
        itemId,
    }, {user: {id}}) => {
        return getUserById(id).then(user => {
            const userId = user._id;
            return isUserItemRemovable(userId, itemId, RelationTypeEnum.WISH).then(removable => {
                if (!removable) return null;

                return removeUserItem(userId, itemId, RelationTypeEnum.WISH).then(userItemId => ({userItemId}));
            });
        });
    },
});