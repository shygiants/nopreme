import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLID,
    GraphQLEnumType,
} from 'graphql';

import {
    nodeDefinitions,
    fromGlobalId,
    globalIdField,
    connectionArgs,
    connectionFromArray,
    connectionDefinitions,
    getOffsetWithDefault,
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
    ExchangeStatusEnum,
    getExchangeById,
    getExchangesByUserId,
    Exchange,
    RelationTypeEnum,
    getUserItemsByUserGoodsId,
    getUserItemByIds,
    Match,
    getMatchesForUser,
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
        } else if (type === 'Match') {
            const [wishItem, posessionItem, user] = id.split('-');
            return new Match({wishItem, posessionItem, user});
        } else if (type === 'MatchList') {
            return new MatchList({userId: id});
        } else if (type === 'ItemList') {
            return {goodsId: id};
        } else if (type === 'Exchange') {
            return getExchangeById(id);
        } else if (type === 'ExchangeList') {
            return {userId: id};
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
        } else if (obj instanceof Exchange) {
            return GraphQLExchange;
        } else if (obj instanceof Match) {
            return GraphQLMatch;
        } else if (obj instanceof MatchList) {
            return GraphQLMatchList
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
        } else if (obj.hasOwnProperty('userId')) {
            return GraphQLExchangeList;
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
        birthday: {
            type: GraphQLString,
            resolve: member => member.birthday.getTime().toString(),
        }
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
        collected: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (item, args, {user: {id}}) => {
                return getUserItemByIds(
                    id, item._id, RelationTypeEnum.COLLECTION).then(userItem => userItem !== null);
            }
        },
        posessed: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (item, args, {user: {id}}) => {
                return getUserItemByIds(
                    id, item._id, RelationTypeEnum.POSESSION).then(userItem => userItem !== null);
            }
        },
        wished: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: (item, args, {user: {id}}) => {
                return getUserItemByIds(
                    id, item._id, RelationTypeEnum.WISH).then(userItem => userItem !== null);
            }
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
        userId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: collection => collection.user,
        },
        item: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: collection => {
                return getItemById(collection.item);
            },
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        isInExchange: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: collection => false,
        },
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
        userId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: collection => collection.user,
        },
        item: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: posession => {
                return getItemById(posession.item);
            },
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        isInExchange: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: posession => posession.exchange !== undefined
        },
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
        userId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: collection => collection.user,
        },
        item: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: wish => {
                return getItemById(wish.item);
            },
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        isInExchange: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: wish => wish.exchange !== undefined
        },
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
        openChatLink: {
            type: GraphQLString,
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
                goodsId: {
                    type: GraphQLID,
                    defaultValue: 'any',
                },
                ...connectionArgs,
            },
            resolve: (user, {goodsId, after, before, first, last}) => {
                if (goodsId !== 'any') {
                    return getUserItemsByUserGoodsId(user._id, goodsId, 'Collection').then(collections => {
                        return connectionFromArray([...collections], {
                            after, before, first, last,
                        });
                    });
                } else {
                    return getUserItemsByUserId(user._id, 'Collection').then(collections => {
                        return connectionFromArray([...collections], {
                            after, before, first, last,
                        });
                    });
                }
            },
        },
        posesses: {
            type: PosessionConnection,
            args: {
                goodsId: {
                    type: GraphQLID,
                    defaultValue: 'any',
                },
                ...connectionArgs,
            },
            resolve: (user, {goodsId, after, before, first, last}) => {
                if (goodsId !== 'any') {
                    return getUserItemsByUserGoodsId(user._id, goodsId, 'Posession').then(posessions => {
                        return connectionFromArray([...posessions], {
                            after, before, first, last,
                        });
                    });
                } else {
                    return getUserItemsByUserId(user._id, 'Posession').then(posessions => {
                        return connectionFromArray([...posessions], {
                            after, before, first, last,
                        });
                    });
                }
            },
        },
        wishes: {
            type: WishConnection,
            args: {
                goodsId: {
                    type: GraphQLID,
                    defaultValue: 'any',
                },
                ...connectionArgs,
            },
            resolve: (user, {goodsId, after, before, first, last}) => {
                if (goodsId !== 'any') {
                    return getUserItemsByUserGoodsId(user._id, goodsId, 'Wish').then(wishes => {
                        return connectionFromArray([...wishes], {
                            after, before, first, last,
                        });
                    });
                } else {
                    return getUserItemsByUserId(user._id, 'Wish').then(wishes => {
                        return connectionFromArray([...wishes], {
                            after, before, first, last,
                        });
                    });
                }
            },
        },
    },
    interfaces: [nodeInterface],
});

const GraphQLMatch = new GraphQLObjectType({
    name: 'Match',
    fields: {
        id: globalIdField('Match', ({
            wishItem, posessionItem, user}) => [wishItem, posessionItem, user].join('-')),
        wishItem: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: match => getItemById(match.wishItem),
        },
        posessionItem: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: match => getItemById(match.posessionItem),
        },
        user: {
            type: new GraphQLNonNull(GraphQLUser),
            resolve: match => getUserById(match.user),
        },
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: MatchConnection,
    edgeType: GraphQLMatchEdge,
} = connectionDefinitions({
    name: 'Match',
    nodeType: GraphQLMatch,
});

export class MatchList {
    constructor({userId}) {
        this.userId = userId;
    }
}

export const GraphQLMatchList = new GraphQLObjectType({
    name: 'MatchList',
    fields: {
        id: globalIdField('MatchList', ({userId}) => userId),
        matches: {
            type: MatchConnection,
            args: {
                ...connectionArgs,
            },
            resolve: ({userId}, {after, before, first, last}) => {
                const startOffset = getOffsetWithDefault(after, -1) + 1;
                const limit = typeof first === 'number' ? startOffset + first : -1;

                return getMatchesForUser(userId, limit).then(matches => {
                    return connectionFromArray([...matches], {
                        after, before, first, last,
                    });
                })
            }
        }
    }, 
    interfaces: [nodeInterface],
});

const ExchangeStatusType = new GraphQLEnumType({
    name: 'ExchangeStatus',
    values: {
      PROGESSING: { value: ExchangeStatusEnum.PROGRESSING },
      REJECTED: { value: ExchangeStatusEnum.REJECTED },
      COMPLETE: { value: ExchangeStatusEnum.COMPLETE }
    },
});

const GraphQLExchange = new GraphQLObjectType({
    name: 'Exchange',
    fields: {
        id: globalIdField('Exchange', exchange => exchange._id),
        exchangeId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: exchange => exchange._id,
        },
        requestor: {
            type: new GraphQLNonNull(GraphQLUser),
            resolve: exchange => getUserById(exchange.requestor),
        },
        acceptor: {
            type: new GraphQLNonNull(GraphQLUser),
            resolve: exchange => getUserById(exchange.acceptor),
        },
        reqPosessionItem: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: exchange => getItemById(exchange.reqPosessionItem),
        },
        accPosessionItem: {
            type: new GraphQLNonNull(GraphQLItem),
            resolve: exchange => getItemById(exchange.accPosessionItem),
        },
        num: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: exchange => exchange.createdAt.toDateString(),
        },
        approvedByRequestor: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
        approvedByAcceptor: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
        status: {
            type: new GraphQLNonNull(ExchangeStatusType),
        },
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: ExchangeConnection,
    edgeType: GraphQLExchangeEdge,
} = connectionDefinitions({
    name: 'Exchange',
    nodeType: GraphQLExchange,
});

const GraphQLExchangeList = new GraphQLObjectType({
    name: 'ExchangeList',
    fields: {
        id: globalIdField('ExchangeList', ({userId}) => userId),
        exchanges: {
            type: ExchangeConnection,
            args: {
                ...connectionArgs,
            },
            resolve: ({userId}, {after, before, first, last}) => {
                return getExchangesByUserId(userId).then(exchanges => {
                    return connectionFromArray([...exchanges], {
                        after, before, first, last,
                    });
                });
            },
        },
    },
    interfaces: [nodeInterface],
});

export {
    GraphQLMatch,
    GraphQLMember, GraphQLItem, GraphQLGoods, GraphQLItemList, GraphQLEvent, GraphQLArtist, GraphQLUser, GraphQLCollection, GraphQLPosession, GraphQLWish, GraphQLExchange, GraphQLExchangeList,
    nodeInterface, nodeField, 
    EventConnection, GraphQLEventEdge, GoodsConnection, GraphQLGoodsEdge, ItemConnection, GraphQLItemEdge, 
    CollectionConnection, GraphQLCollectionEdge, PosessionConnection, GraphQLPosessionEdge, WishConnection, GraphQLWishEdge,
    ExchangeConnection, GraphQLExchangeEdge, GraphQLMatchEdge, MatchConnection,
};