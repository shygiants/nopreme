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
    GraphQLGoodsEdge,
} from '../nodes';

import {
    modifyGoods, 
    getGoodsById,
    getGoodsByEventId, 
} from '../../database/Goods';
import {
    isAdmin,
} from '../../database/User';

export const ModifyGoodsMutation = mutationWithClientMutationId({
    name: 'ModifyGoods',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        eventId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLString,
        },
        img: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
    },
    outputFields: {
        goodsEdge: {
            type: new GraphQLNonNull(GraphQLGoodsEdge),
            resolve: ({goodsId, eventId}) => {
                return Promise.all([getGoodsByEventId(eventId, false), getGoodsById(goodsId)]).then(values => {
                    const [goodsList, goods] = values;

                    const goodsIds = goodsList.map(goods => goods._id.toString());
                    const goodsId = goods._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...goodsIds], goodsId),
                        node: goods,
                    };
                });
            },
        },
    },
    mutateAndGetPayload: ({
        id,
        eventId,
        name, 
        img,
        description,
    }, {user: {id: userId}}) => {
        return isAdmin(userId).then(admin => {
            if (!admin)
                return null;

            return modifyGoods(id, {name, img, description}).then(goodsId => {
                return getGoodsById(goodsId).then(goods => ({
                    goodsId: goods._id,
                    eventId,
                }));
            });
        });
    },
});