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

import moment from 'moment-timezone';
moment.locale('ko')

import {
    isObjectId,
    Match,
    getMatches,
    getMatchesForUser,
} from '../database/database';
import {
    User,
    getUserById,
    isAdmin,
    MethodEnum,
} from '../database/User';
import {
    Artist,
    getArtistById,
    getArtistsBelongsTo,
} from '../database/Artist';
import {
    Event,
    getEventById,
    getEventsByArtistId,
} from '../database/Event';
import {
    Goods,
    getGoodsById,
    getGoodsByEventId,
    getGoodsByArtistId,
    getGoodsByEventArtistId,
    getGoodsByEventArtistName,
} from '../database/Goods';
import {
    Item,
    getItemById,
    getItemsByGoodsId,
} from '../database/Item';
import {
    UserItem,
    getUserItemsByUserId,
    getUserItemById,
    getUserItemsByUserGoodsId,
    getUserItemByIds,
    RelationTypeEnum,
} from '../database/UserItem';
import {
    ExchangeStatusEnum,
    getExchangeById,
    getExchangesByUserId,
    Exchange,
    getRequestedExchangesByUserId,
    getAcceptedExchangesByUserId,
} from '../database/Exchange';
import {
    getNoticeById,
    Notice,
} from '../database/Notice';
import { getRegionById, Region } from '../database/Region';
import { 
    getStates, 
    getCities, 
    getChildCities 
} from '../database/Region';
import { getBannerById, Banner } from '../database/Banner';

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
        } else if (type === 'Notice') {
            return getNoticeById(id);
        } else if (type === 'ItemList') {
            return {goodsId: id};
        } else if (type === 'Exchange') {
            return getExchangeById(id);
        } else if (type === 'Region') {
            return getRegionById(id);
        } else if (type === 'ExchangeList') {
            return new ExchangeList({userId: id});
        } else if (type === 'Banner') {
            return getBannerById(id);
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
            return GraphQLMatchList;
        } else if (obj instanceof Notice) {
            return GraphQLNotice;
        } else if (obj instanceof Region) {
            return GraphQLRegion;
        } else if (obj instanceof Banner) {
            return GraphQLBoolean;
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
        } else if (obj instanceof ExchangeList) {
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
            resolve: event => moment.tz(event.date, 'Asia/Seoul').format('LL'),
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
            resolve: (event, {artistId, artistName, after, before, first, last}, {user:{id: userId}}) => {
                return isAdmin(userId).then(admin => {
                    var goodsPromise;
                    if (artistId !== 'any')
                        goodsPromise = getGoodsByEventArtistId(event._id, artistId, !admin);
                    else if (artistName !== 'any') 
                        goodsPromise = getGoodsByEventArtistName(event._id, artistName, !admin);
                    else
                        goodsPromise = getGoodsByEventId(event._id, !admin);

                    return goodsPromise.then(goods => {
                        return connectionFromArray([...goods], {
                            after, before, first, last,
                        });
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

const GraphQLRegion = new GraphQLObjectType({
    name: 'Region',
    fields: {
        id: globalIdField('Region', region => region._id),
        regionId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: region => region._id,
        },
        stateCode: {
            type: new GraphQLNonNull(GraphQLString),
        },
        stateName: {
            type: new GraphQLNonNull(GraphQLString),
        },
        cityCode: {
            type: GraphQLString,
        },
        cityName: {
            type: GraphQLString,
        },
        parentCityCode: {
            type: GraphQLString,
        },
        parentCityName: {
            type: GraphQLString,
        },
        displayName: {
            type: GraphQLString,
        }
    },
    interfaces: [nodeInterface],
});

const MethodType = new GraphQLEnumType({
    name: 'MethodType',
    values: {
      DIRECT: { value: MethodEnum.DIRECT },
      POST: { value: MethodEnum.POST },
      DONTCARE: { value: MethodEnum.DONTCARE },
    },
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
        regions: {
            type: new GraphQLList(GraphQLRegion),
            resolve: user => {
                if (!user.regions) return Promise.resolve([]);
                return user.regions.map(region => getRegionById(region));
            },
            defaultValue: [],
        }, 
        method: {
            type: new GraphQLNonNull(MethodType),
            defaultValue: MethodEnum.DONTCARE,
        }

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
                filterByRegion: {
                    type: GraphQLBoolean,
                    defaultValue: false,
                },
                method: {
                    type: MethodType,
                    defaultValue: MethodEnum.DONTCARE,
                },
                ...connectionArgs,
            },
            resolve: ({userId}, {filterByRegion, method, after, before, first, last}) => {
                const startOffset = getOffsetWithDefault(after, -1) + 1;
                const limit = typeof first === 'number' ? startOffset + first : -1;

                return getMatches(userId, limit+1, filterByRegion, method).then(matches => {
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

export class ExchangeList {
    constructor({userId}) {
        this.userId = userId;
    }
}

const GraphQLExchangeList = new GraphQLObjectType({
    name: 'ExchangeList',
    fields: {
        id: globalIdField('ExchangeList', ({userId}) => userId),
        numRequested: {
            type: GraphQLInt,
            resolve: ({userId}) => getRequestedExchangesByUserId(userId).then(exchanges => exchanges.length)
        },
        numAccepted: {
            type: GraphQLInt,
            resolve: ({userId}) => getAcceptedExchangesByUserId(userId).then(exchanges => exchanges.length)
        },
        requested: {
            type: ExchangeConnection,
            args: {
                ...connectionArgs,
            },
            resolve: ({userId}, {after, before, first, last}) => {
                return getRequestedExchangesByUserId(userId).then(exchanges => {
                    return connectionFromArray([...exchanges], {
                        after, before, first, last,
                    });
                });
            },
        },
        accepted: {
            type: ExchangeConnection,
            args: {
                ...connectionArgs,
            },
            resolve: ({userId}, {after, before, first, last}) => {
                return getAcceptedExchangesByUserId(userId).then(exchanges => {
                    return connectionFromArray([...exchanges], {
                        after, before, first, last,
                    });
                });
            },
        },
    },
    interfaces: [nodeInterface],
});

const GraphQLNotice = new GraphQLObjectType({
    name: 'Notice',
    fields: {
        id: globalIdField('Notice', notice => notice._id),
        noticeId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: notice => notice._id,
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
        },
        img: {
            type: GraphQLString,
        },
        text: {
            type: GraphQLString,
        },
        link: {
            type: GraphQLString,
            resolve: notice => notice.link && notice.link.url
        },
        linkText: {
            type: GraphQLString,
            resolve: notice => notice.link && notice.link.text
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: notice => moment.tz(notice.createdAt, 'Asia/Seoul').format('LLL'),
        }
    },
    interfaces: [nodeInterface],
});

const GraphQLBanner = new GraphQLObjectType({
    name: 'Banner',
    fields: {
        id: globalIdField('Banner', banner => banner._id),
        bannerId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: banner => banner._id,
        },
        texts: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
        link: {
            type: GraphQLString,
        },
    },
    interfaces: [nodeInterface],
});

const GraphQLAddress = new GraphQLObjectType({
    name: 'Address',
    fields: {
        states: {
            type: new GraphQLList(GraphQLRegion),
            resolve: (root) => getStates(),
        },
        cities: {
            type: new GraphQLList(GraphQLRegion),
            args: {
                stateCode: {
                    type: GraphQLString,
                }
            },
            resolve: (root, {stateCode}) => getCities(stateCode),
        },
        childCities: {
            type: new GraphQLList(GraphQLRegion),
            args: {
                stateCode: {
                    type: GraphQLString,
                },
                cityCode: {
                    type: GraphQLString,
                }
            },
            resolve: (root, {stateCode, cityCode}) => getChildCities(stateCode, cityCode),
        },
    }
})

export {
    GraphQLMatch,
    GraphQLMember, GraphQLItem, GraphQLGoods, GraphQLItemList, GraphQLEvent, GraphQLArtist, GraphQLUser, GraphQLCollection, GraphQLPosession, GraphQLWish, GraphQLExchange, GraphQLExchangeList, GraphQLNotice, GraphQLRegion, GraphQLAddress, GraphQLBanner,
    nodeInterface, nodeField, 
    EventConnection, GraphQLEventEdge, GoodsConnection, GraphQLGoodsEdge, ItemConnection, GraphQLItemEdge, 
    CollectionConnection, GraphQLCollectionEdge, PosessionConnection, GraphQLPosessionEdge, WishConnection, GraphQLWishEdge,
    ExchangeConnection, GraphQLExchangeEdge, GraphQLMatchEdge, MatchConnection, MethodType,
};