import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID,
} from 'graphql';

import {
    nodeDefinitions,
    fromGlobalId,
    globalIdField,
    connectionArgs,
    connectionFromArray,
    connectionDefinitions,
} from 'graphql-relay';

import {
    User,
    Artist,
    Event,
    Goods,
    Item,
    getUserById,
    getArtistById,
    isObjectId,
    getEventById,
    getGoodsById,
    getItemById,
    getItemsByGoodsId,
    getGoodsByEventId,
    getArtistsBelongsTo,
    getEventsByArtistId,
    getGoodsByArtistId,
    getGoodsByEventArtistId,
    getGoodsByEventArtistName,
} from '../database';
// import { get } from 'mongoose';

const {
    nodeInterface,
    nodeField
} = nodeDefinitions(
    (globalId) => {
        const {type, id} = fromGlobalId(globalId);

        if (type === 'User') {
            return getUserById(id);
        } else if (type === 'Artist') {
            return getArtistById(id);
        } else if (type === 'Member') {
            return getArtistById(id);
        } else if (type === 'Event') {
            return getEventById(id);
        } else if (type === 'Goods') {
            return getGoodsById(id);
        } else if (type === 'Item') {
            return getItemById(id);
        }

        return null;
    },
    (obj) => {
        if (obj instanceof User) {
            return GraphQLUser;
        } else if (obj instanceof Artist) {
            return obj.isGroup ? GraphQLArtist : GraphQLMember;
        } else if (obj instanceof Event) {
            return GraphQLEvent;
        } else if (obj instanceof Goods) {
            return GraphQLGoods;
        } else if (obj instanceof Item) {
            return GraphQLItem;
        }

        return null;
    }
);

const GraphQLMember = new GraphQLObjectType({
    name: 'Member',
    fields: {
        id: globalIdField('Member', member => member._id),
        memberId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: member => member._id,
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        aliases: {
            type: new GraphQLList(GraphQLString),
        },
        description: {
            type: GraphQLString,
        },
    },
    interfaces: [nodeInterface],
});

const GraphQLItem = new GraphQLObjectType({
    name: 'Item',
    fields: {
        id: globalIdField('Item', item => item._id),
        itemId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: item => item._id,
        },
        idx: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        members: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLMember)),
            resolve: item => {
                return Promise.all(item.artists.map(artistIdOrObj => {
                    return isObjectId(artistIdOrObj) ? getArtistById(artistIdOrObj) : Promise.resolve(artistIdOrObj);
                }));
            },
        },
    },
    interfaces: [nodeInterface],
});
const {
    connectionType: ItemConnection,
    edgeType: GraphQLItemEdge,
} = connectionDefinitions({
    name: 'Item',
    nodeType: GraphQLItem
});

const GraphQLGoods = new GraphQLObjectType({
    name: 'Goods',
    fields: {
        id: globalIdField('Goods', goods => goods._id),
        goodsId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: goods => goods._id,
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        items: {
            type: ItemConnection,
            args: {
                ...connectionArgs,
            },
            resolve: (goods, {after, before, first, last}) => {
                const goodsId = goods._id;
                return getItemsByGoodsId(goodsId).then(items => {
                    return connectionFromArray([...items], {
                        after, before, first, last, 
                    });
                });
            }
        }
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: GoodsConnection,
    edgeType: GraphQLGoodsEdge,
} = connectionDefinitions({
    name: 'Goods',
    nodeType: GraphQLGoods
});

const GraphQLEvent = new GraphQLObjectType({
    name: 'Event',
    fields: {
        id: globalIdField('Event', event => event._id),
        eventId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: event => event._id,
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString
        },
        goodsList: {
            type: GoodsConnection,
            args: {
                artistId: {
                    type: GraphQLID,
                    defaultValue: 'any',
                },
                artistName: {
                    type: GraphQLString,
                    defaultValue: 'any',
                },
                ...connectionArgs,
            },
            resolve: (event, {artistId, artistName, after, before, first, last}) => {
                var goodsPromise;
                if (artistId !== 'any')
                    goodsPromise = getGoodsByEventArtistId(event._id, artistId);
                else if (artistName !== 'any') 
                    goodsPromise = getGoodsByEventArtistName(event._id, artistName);
                else
                    goodsPromise = getGoodsByEventId(event._id);

                return goodsPromise.then(goods => {
                    return connectionFromArray([...goods], {
                        after, before, first, last,
                    });
                });
            }
        },
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: EventConnection,
    edgeType: GraphQLEventEdge,
} = connectionDefinitions({
    name: 'Event',
    nodeType: GraphQLEvent
});


const GraphQLArtist = new GraphQLObjectType({
    name: 'Artist',
    fields: {
        id: globalIdField('Artist', artist => artist._id),
        artistId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: artistGroup => artistGroup._id,
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        aliases: {
            type: new GraphQLList(GraphQLString),
        },
        description: {
            type: GraphQLString,
        },
        isGroup: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
        members: {
            type: new GraphQLList(GraphQLMember),
            resolve: artist => {
                return getArtistsBelongsTo(artist._id);
            }
        },
        events: {
            type: EventConnection,
            args: {
                ...connectionArgs,
            },
            resolve: (artist, {after, before, first, last}) => {
                return getEventsByArtistId(artist._id).then(events => {
                    return connectionFromArray([...events],{
                        after, before, first, last,
                    });
                });
            }
        },
        // goodsList: {
        //     type: GoodsConnection,
        //     args: {
        //         ...connectionArgs,
        //     },
        //     resolve: (artist, {after, before, first, last}) => {
        //         return getGoodsByArtistId(artist._id).then(goods => {
        //             return connectionFromArray([...goods], {
        //                 after, before, first, last,
        //             });
        //         });
        //     }
        // },
        goodsList: {
            type: new GraphQLList(GraphQLGoods),
            resolve: artist => {
                return getGoodsByArtistId(artist._id);
            }

        }
    },
    interfaces: [nodeInterface],
})


const GraphQLUser = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: globalIdField('User', user => user._id),
        userId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: user => user._id,
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
        },
        admin: {
            type: GraphQLBoolean,
            defaultValue: false,
        }
    },
    interfaces: [nodeInterface],
});


export {
    GraphQLMember, GraphQLItem, GraphQLGoods, GraphQLEvent, GraphQLArtist, GraphQLUser,
    nodeInterface, nodeField, 
    EventConnection, GraphQLEventEdge, GoodsConnection, GraphQLGoodsEdge, ItemConnection, GraphQLItemEdge,
};