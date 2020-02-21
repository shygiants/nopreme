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
    GraphQLItem,
    GoodsConnection,
    GraphQLItemList,
    GraphQLExchangeList,
    GraphQLExchange,
    GraphQLMatchList,
    MatchList,
} from './nodes';

import {
    getUserById,
    getArtistByName,
    getEventById,
    getGoodsById,
    getItemById,
    getGoodsByArtistName,
    getEventByGoodsId,
    getExchangeById,
    isExchangeAccessibleTo,
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
import { AddExchangeMutation } from './mutations/AddExchangeMutation';
import { RemoveExchangeMutation } from './mutations/RemoveExchangeMutation';
import { RejectExchangeMutation } from './mutations/RejectExchangeMutation';
import { ResolveExchangeMutation } from './mutations/ResolveExchangeMutation';
import { ModifyUserMutation } from './mutations/ModifyUserMutation';

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: (root, args, {user: {id}}) => getUserById(id),
        },
        matchList: {
            type: GraphQLMatchList,
            resolve: (root, args, {user: {id}}) => new MatchList({userId: id}),
        },
        exchangeList: {
            type: GraphQLExchangeList,
            resolve: (root, args, {user: {id}}) => ({userId: id}),
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
        exchange: {
            type: GraphQLExchange,
            args: {
                id: {
                    type: GraphQLID,
                },
            },
            resolve: (root, {id}, {user}) => {
                return isExchangeAccessibleTo(id, user.id).then(isAccessible => {
                    if (!isAccessible)
                        return null;

                    return getExchangeById(id);
                });
            },
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
        rejectExchange: RejectExchangeMutation,
        resolveExchange: ResolveExchangeMutation,
        modifyUser: ModifyUserMutation,
    },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});