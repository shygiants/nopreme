import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
} from 'graphql';

import {
    GraphQLUser,
    nodeField,
    GraphQLEvent,
    GraphQLArtist,
    GraphQLGoods,
    GraphQLEventEdge,
    GraphQLItem,
    GoodsConnection,
    GraphQLMatch,
    GraphQLItemList,
    GraphQLExchangeList,
} from './nodes';

import {
    getUserById,
    getArtistByName,
    getEventById,
    getGoodsById,
    getItemById,
    getGoodsByArtistName,
    getEventByGoodsId,
    getMatchesForUser,
} from '../database';

import { AddGoodsMutation } from './mutations/AddGoodsMutation';
import { AddEventMutation } from './mutations/AddEventMutation';
import { AddItemMutation } from './mutations/AddItemMutation';
import { AddCollectionMutation } from './mutations/AddCollectionMutation';
import { AddPosessionMutation } from './mutations/AddPosessionMutation';
import { AddWishMutation } from './mutations/AddWishMutation';
import { RemoveCollectionMutation } from './mutations/RemoveCollectionMutation';
import { RemovePosessionMutation } from './mutations/RemovePosessionMutation';
import { RemoveWishMutation } from './mutations/RemoveWishMutation';
import { ModifyItemMutation } from './mutations/ModifyItemMutation';
import { GraphQLNonNull } from 'graphql';
import { GraphQLList } from 'graphql';
import { AddExchangeMutation } from './mutations/AddExchangeMutation';
import { RemoveExchangeMutation } from './mutations/RemoveExchangeMutation';

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: (root, args, {user: {id}}) => getUserById(id),
        },
        matches: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLMatch)),
            resolve: (root, args, {user: {id}}) => getMatchesForUser(id),
        },
        exchangeList: {
            type: GraphQLExchangeList,
            resolve: (root, args, {user: {id}}) => ({requestorId: id}),
        },
        user: {
            type: GraphQLUser,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve: (root, {id}) => getUserById(id),
        },
        artist: {
            type: GraphQLArtist,
            args: {
                name: {
                    type: GraphQLString,
                },
            },
            resolve: (root, {name}) => getArtistByName(name),
        },
        event: {
            type: GraphQLEvent,
            args: {
                id: {
                    type: GraphQLID,
                },
                goodsId: {
                    type: GraphQLID,
                }
            },
            resolve: (root, {id, goodsId}) => {
                if (id !== undefined && id !== null)
                    return getEventById(id);
                else 
                    return getEventByGoodsId(goodsId);
            },
        },
        goods: {
            type: GraphQLGoods,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve: (root, {id}) => getGoodsById(id),
        },
        itemList: {
            type: GraphQLItemList,
            args: {
                goodsId: {
                    type: GraphQLID,
                },
            },
            resolve: (root, {goodsId}) => ({goodsId}),
        },
        goodsList: {
            type: GoodsConnection,
            args: {
                artistName: {
                    type: GraphQLString,
                },
            },
            resolve: (root, {artistName}) => getGoodsByArtistName(artistName),
        },
        item: {
            type: GraphQLItem,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve: (root, {id}) => getItemById(id),
        },        
        node: nodeField,
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addGoods: AddGoodsMutation,
        addEvent: AddEventMutation,
        addItem: AddItemMutation,
        addCollection: AddCollectionMutation,
        addPosession: AddPosessionMutation,
        addWish: AddWishMutation,
        removeCollection: RemoveCollectionMutation,
        removeWish: RemoveWishMutation,
        removePosession: RemovePosessionMutation,        
        modifyItem: ModifyItemMutation,
        addExchange: AddExchangeMutation,
        removeExchange: RemoveExchangeMutation,
    },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});