import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
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
    getGoodsByEventArtistId,
    isAdmin,
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
        img: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
        }
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
        description,
        img
    }, {user: {id}}) => {
        return isAdmin(id).then(admin => {
            if (!admin)
                return null;

            return addGoods({
                name, 
                event: eventId, 
                artist: artistId,
                description,
                img,
            }).then(goodsId => ({
                goodsId, eventId, artistId,
            }));
        });
    }
});