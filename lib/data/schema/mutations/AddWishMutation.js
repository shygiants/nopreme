import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
} from 'graphql';
import {
    GraphQLWishEdge,
} from '../nodes';
import {
    addUserItem,
    getUserItemById,
    getUserItemsByUserGoodsId,
    RelationTypeEnum
} from '../../database/UserItem';
import {
    getUserById,
} from '../../database/User';
import {
    getItemById,
} from '../../database/Item';

export const AddWishMutation = mutationWithClientMutationId({
    name: 'AddWish',
    inputFields: {
        itemId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        num: {
            type: GraphQLInt,
            defaultValue: 1,
        },
    },
    outputFields: {
        wishEdge: {
            type: new GraphQLNonNull(GraphQLWishEdge),
            resolve: ({wishId, userId, goodsId}) => {
                return Promise.all([getUserItemsByUserGoodsId(userId, goodsId, RelationTypeEnum.WISH), getUserItemById(wishId)]).then(values => {
                    const wishs = values[0];
                    const wish = values[1];

                    const wishIds = wishs.map(wis => wis._id.toString());
                    const wishId = wish._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...wishIds], wishId),
                        node: wish,
                    };
                })
                
            },
        },
    },
    mutateAndGetPayload: ({
        itemId,
        num,
    }, {user: {id}}) => {
        return getUserById(id).then(user => {
            const userId = user._id;

            return getItemById(itemId).then(item => {
                return addUserItem(userId, itemId, num, RelationTypeEnum.WISH).then(wishId => ({wishId, userId, goodsId: item.goods}));
            });
        });
    }
});