import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean,
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
    GraphQLNotice,
    GraphQLRegion,
    GraphQLAddress,
    MethodType,
    GraphQLBanner,
    ExchangeList,
} from './nodes';

import {
    getUserById,
} from '../database/User';
import {
    getArtistByName,
} from '../database/Artist';
import {
    getEventById,
    getEventByGoodsId,
} from '../database/Event';
import {
    getGoodsById,
    getGoodsByArtistName,
} from '../database/Goods';
import {
    getItemById,
} from '../database/Item';
import {
    getExchangeById,
    isExchangeAccessibleTo,
} from '../database/Exchange';
import {
    getLatestHomeNotice,
    getNotices,
} from '../database/Notice';

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
import { getCurrentBanner } from '../database/Banner';
import { BlockUserMutation } from './mutations/BlockUserMutation';


const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: (root, args, {user: {id}}) => getUserById(id),
        },
        homeNotice: {
            type: GraphQLNotice,
            resolve: (root) => getLatestHomeNotice(),
        },
        banner: {
            type: GraphQLBanner,
            resolve: (root) => getCurrentBanner(),
        },
        notices: {
            type: new GraphQLList(GraphQLNotice),
            resolve: (root) => getNotices(),
        },
        address: {
            type: GraphQLAddress,
            resolve: (root) => ({}),
        },
        matchList: {
            type: GraphQLMatchList,
            resolve: (root, args, {user: {id}}) => new MatchList({userId: id}),
        },
        exchangeList: {
            type: GraphQLExchangeList,
            resolve: (root, args, {user: {id}}) => new ExchangeList({userId: id}),
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
        blockUser: BlockUserMutation,
    },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});