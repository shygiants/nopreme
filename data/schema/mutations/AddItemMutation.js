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
    addItem,
    getItemsByGoodsId,
    getItemById
} from '../../database';

export const AddItemMutation = mutationWithClientMutationId({
    name: 'AddItem',
    inputFields: {
        idx: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        memberIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLID))
        },
        goodsId: {
            type: new GraphQLNonNull(GraphQLID),
        },
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
        idx,
        memberIds,
        goodsId,
    }) => {
        return addItem(idx, memberIds, goodsId).then(itemId => ({
            itemId, goodsId,
        }));
    },
});