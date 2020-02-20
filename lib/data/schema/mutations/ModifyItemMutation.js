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
    GraphQLItemEdge
} from '../nodes';
import {
    getItemsByGoodsId,
    getItemById,
    isAdmin,
    modifyItem,
} from '../../database';

export const ModifyItemMutation = mutationWithClientMutationId({
    name: 'ModifyItem',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        idx: {
            type: GraphQLInt
        },
        memberIds: {
            type: new GraphQLList(GraphQLID)
        },
        goodsId: {
            type: GraphQLID,
        },
        img: {
            type: GraphQLString,
        }
    },
    outputFields: {
        itemEdge: {
            type: new GraphQLNonNull(GraphQLItemEdge),
            resolve: ({itemId, goodsId}) => {
                return Promise.all([getItemsByGoodsId(goodsId), getItemById(itemId)]).then(values => {
                    const items = values[0];
                    const item = values[1];

                    const itemIds = items.map(item => item._id.toString());
                    const itemId = item._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...itemIds], itemId),
                        node: item,
                    };
                });
            },
        },
    },
    mutateAndGetPayload: ({
        id,
        idx,
        memberIds,
        goodsId,
        img,
    }, {user: {id: userId}}) => {
        return isAdmin(userId).then(admin => {
            if (!admin)
                return null;

            return modifyItem(id, {idx, memberIds, goodsId, img}).then(itemId => {
                return getItemById(itemId).then(item => ({
                    itemId, goodsId: item.goods,
                }));
            });
        });
    },
});