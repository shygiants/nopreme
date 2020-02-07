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
} from './nodes';

import {
    getUserById,
    getArtistByName,
    getEventById,
    getGoodsById,
    getItemById,
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


const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: (root, args, {user: {id}}) => getUserById(id),
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
            },
            resolve: (root, {id}) => getEventById(id),
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
    },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});