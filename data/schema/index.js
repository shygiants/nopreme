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
} from './nodes';

import {
    getUserById,
    getArtistByName,
    getEventById,
    getGoodsById,
} from '../database';

import {AddGoodsMutation} from './mutations/AddGoodsMutation';
import { AddEventMutation } from './mutations/AddEventMutation';
import { AddItemMutation } from './mutations/AddItemMutation';


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
        //     },
        //     resolve: (root, {id}) => getGoodsById(id),
        // },
        // items: {
        //     type: new GraphQLList(GraphQLItem),
        //     args: {
        //         goodsId: {
        //             type: GraphQLString,
        //         }
        //     },
        //     resolve: (root, {goodsId}) => getItemsByGoodsId(goodsId),
        // },
        node: nodeField,
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addGoods: AddGoodsMutation,
        addEvent: AddEventMutation,
        addItem: AddItemMutation,
    },
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});