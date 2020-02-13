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
    getUserItemsByUserId,
    getUserItemById,
    UserItem,
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
        } else if (type === 'Artist' || type === 'Member') {
            return getArtistById(id);
        } else if (type === 'Event') {
            return getEventById(id);
        } else if (type === 'Goods') {
            return getGoodsById(id);
        } else if (type === 'Item') {
            return getItemById(id);
        } else if (type === 'Collection' || type === 'Posession' || type === 'Wish') {
            return getUserItemById(id);
        } else if (type === 'ItemList') {
            return {goodsId: id};
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
        } else if (obj instanceof UserItem) {
            switch (obj.relationType) {
                case 'Collection':
                    return GraphQLCollection;
                    break;
                case 'Posession':
                    return GraphQLPosession;
                    break;
                case 'Wish':
                    return GraphQLWish;
                    break;
                default:
                    return null;
            }
        } else if (obj.hasOwnProperty('goodsId')) {
            return GraphQLItemList;
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
        img: {
            type: new GraphQLNonNull(GraphQLString),
        },
        description: {
            type: GraphQLString,
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
        goods: {
            type: new GraphQLNonNull(GraphQLGoods),
            resolve: item => getGoodsById(item.goods),
        },
        members: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLMember)),
            resolve: item => {
                return Promise.all(item.artists.map(artistIdOrObj => {
                    return isObjectId(artistIdOrObj) ? getArtistById(artistIdOrObj) : Promise.resolve(artistIdOrObj);
                }));
            },
        },
        img: {
            type: GraphQLString,
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

const GraphQLItemList = new GraphQLObjectType({
    name: 'ItemList',
    fields: {
        id: globalIdField('ItemList', ({goodsId}) => goodsId),
        items: {
            type: ItemConnection,
            args: {
                ...connectionArgs,
            },
            resolve: ({goodsId}, {after, before, first, last}) => {
                return getItemsByGoodsId(goodsId).then(items => {
                    return connectionFromArray([...items], {
                        after, before, first, last, 
                    });
                });
            },
        },
    },
    interfaces: [nodeInterface],
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
            type: GraphQLString,
        },
        date: {
            type: GraphQLString,
            resolve: event => event.date.toDateString(),
        },
        img: {
            type: GraphQLString,
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

const GraphQLCollection = new GraphQLObjectType({
    name: 'Collection',
    fields: {
        id: globalIdField('Collection', collection => collection._id),
        collectionId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: collection => collection._id,
        },
        item: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: collection => {
                return getItemById(collection.item);
            },
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        }
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: CollectionConnection,
    edgeType: GraphQLCollectionEdge,
} = connectionDefinitions({
    name: 'Collection',
    nodeType: GraphQLCollection
});

const GraphQLPosession = new GraphQLObjectType({
    name: 'Posession',
    fields: {
        id: globalIdField('Posession', posession => posession._id),
        posessionId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: posession => posession._id,
        },
        item: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: posession => {
                return getItemById(posession.item);
            },
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        }
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: PosessionConnection,
    edgeType: GraphQLPosessionEdge,
} = connectionDefinitions({
    name: 'Posession',
    nodeType: GraphQLPosession,
});

const GraphQLWish = new GraphQLObjectType({
    name: 'Wish',
    fields: {
        id: globalIdField('Wish', wish => wish._id),
        wishId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: wish => wish._id,
        },
        item: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: wish => {
                return getItemById(wish.item);
            },
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        }
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: WishConnection,
    edgeType: GraphQLWishEdge,
} = connectionDefinitions({
    name: 'Wish',
    nodeType: GraphQLWish,
});

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
        tutorialComplete: {
            type: GraphQLBoolean,
            defaultValue: false,
            resolve: (user, args, {user: {id}}) => {
                return user._id.toString() !== id? null : user.tutorialComplete;
            }
        },
        admin: {
            type: GraphQLBoolean,
            defaultValue: false,
            resolve: (user, args, {user: {id}}) => {
                return user._id.toString() !== id? null : user.admin;
            }
        },
        collects: {
            type: CollectionConnection,
            args: {
                ...connectionArgs,
            },
            resolve: (user, {after, before, first, last}) => {
                return getUserItemsByUserId(user._id, 'Collection').then(collections => {
                    return connectionFromArray([...collections], {
                        after, before, first, last,
                    })
                });
            },
        },
        posesses: {
            type: PosessionConnection,
            args: {
                ...connectionArgs,
            },
            resolve: (user, {after, before, first, last}) => {
                return getUserItemsByUserId(user._id, 'Posession').then(posessions => {
                    return connectionFromArray([...posessions], {
                        after, before, first, last,
                    })
                });
            },
        },
        wishes: {
            type: WishConnection,
            args: {
                ...connectionArgs,
            },
            resolve: (user, {after, before, first, last}) => {
                return getUserItemsByUserId(user._id, 'Wish').then(wishes => {
                    return connectionFromArray([...wishes], {
                        after, before, first, last,
                    })
                });
            },
        },
    },
    interfaces: [nodeInterface],
});

const GraphQLMatch  = new GraphQLObjectType({
    name: 'Match',
    fields: {
        wishItem: {
            type: GraphQLItem,
            resolve: match => getItemById(match.wishItem),
        },
        posessionItem: {
            type: GraphQLItem,
            resolve: match => getItemById(match.posessionItem),
        },
        user: {
            type: GraphQLUser,
            resolve: match => getUserById(match.user),
        },
    },
});

export {
    GraphQLMatch,
    GraphQLMember, GraphQLItem, GraphQLGoods, GraphQLItemList, GraphQLEvent, GraphQLArtist, GraphQLUser, GraphQLCollection, GraphQLPosession, GraphQLWish,
    nodeInterface, nodeField, 
    EventConnection, GraphQLEventEdge, GoodsConnection, GraphQLGoodsEdge, ItemConnection, GraphQLItemEdge, 
    CollectionConnection, GraphQLCollectionEdge, PosessionConnection, GraphQLPosessionEdge, WishConnection, GraphQLWishEdge,
};