import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import {
    GraphQLGoodsEdge
} from '../nodes';
import {
    addGoods,
    getGoodsById,
    getGoodsByEventId,
    getGoodsByEventArtistId
} from '../../database';

export const AddGoodsMutation = mutationWithClientMutationId({
    name: 'AddGoods',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        eventId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        artistId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        goodsEdge: {
            type: new GraphQLNonNull(GraphQLGoodsEdge),
            resolve: ({goodsId, eventId, artistId}) => {
                return Promise.all([getGoodsByEventArtistId(eventId, artistId), getGoodsById(goodsId)]).then(values => {
                    const goodsList = values[0];
                    const goods = values[1];

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
        name,
        eventId,
        artistId,
    }) => {
        return addGoods(name, eventId, artistId).then(goodsId => ({
            goodsId, eventId, artistId,
        }));
    }
});