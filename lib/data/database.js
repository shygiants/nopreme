import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {getKakaoUserInfo, intersection} from '../utils';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    openChatLink: {
        type: String,
    },
    kakao: {
        id: {
            type: String,
            index: true,
        },
        accessToken: String,
    },
    tutorialComplete: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        defualt: false,
    },
});

export const User = mongoose.model('User', userSchema);

const artistSchema = new mongoose.Schema({
    name: String,
    aliases: [String],
    description: String,
    isGroup: Boolean,
    birthday: Date,
    belongsTo: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Artist' 
    }],
});

export const Artist = mongoose.model('Artist', artistSchema);

const eventSchema = new mongoose.Schema({
    name: String,
    artists: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Artist',
        index: true,
    }],
    date: {
        type: Date,
    },
    img: String,
    description: String,
});

export const Event = mongoose.model('Event', eventSchema);


const goodsSchema = new mongoose.Schema({
    name: String,
    event: { 
        type: Schema.Types.ObjectId, 
        ref: 'Event',
        index: true,
    },
    artist: { 
        type: Schema.Types.ObjectId, 
        ref: 'Artist',
        index: true,
    },
    description: String,
    img: String,
    invisible: {
        type: Boolean,
        default: true,
    },
});

export const Goods = mongoose.model('Goods', goodsSchema);


const itemSchema = new mongoose.Schema({
    idx: Number,
    description: String,
    artists: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Artist',
        index: true,
    }],
    goods: { 
        type: Schema.Types.ObjectId, 
        ref: 'Goods',
        index: true, 
    },
    img: String,
});

export const Item = mongoose.model('Item', itemSchema);

export const RelationTypeEnum = {
    COLLECTION: 'Collection',
    POSESSION: 'Posession',
    WISH: 'Wish',
}

const userItemSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        index: true,
    },
    num: Number,
    relationType: {
        type: String,
        // TODO: Use enum
        enum: Object.values(RelationTypeEnum),
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    exchange: {
        type: Schema.Types.ObjectId,
        ref: 'Exchange',
        indexZ: true,
    }
});

userItemSchema.index({user: 1, item: 1, relationType: 1})

export const UserItem = mongoose.model('UserItem', userItemSchema);

export const ExchangeStatusEnum = {
    PROGRESSING: 'Progressing',
    REJECTED: 'Rejected',
    COMPLETE: 'Complete',
}

const exchangeSchema = new mongoose.Schema({
    requestor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    acceptor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    reqPosessionItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        index: true,
    },
    accPosessionItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        index: true,
    },
    approvedByRequestor: {
        type: Boolean,
        default: false,
    },
    approvedByAcceptor: {
        type: Boolean,
        default: false,
    },
    num: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(ExchangeStatusEnum),
        index: true,
    },
});

export const Exchange = mongoose.model('Exchange', exchangeSchema);

export class Match {
    constructor({wishItem, posessionItem, user}) {
        this.wishItem = wishItem;
        this.posessionItem = posessionItem;
        this.user = user;
    }
}

export function isObjectId(idOrObj) {
    return idOrObj instanceof mongoose.Types.ObjectId
}


export function getUserById(id) {
    return User.findById(id).exec();
}

export function getUserByKakaoId(kakaoId) {
    return User.findOne({'kakao.id': kakaoId}).exec();
}

export function addUser(name, accessToken) {
    return getKakaoUserInfo(accessToken).then(({id}) => {
        return getUserByKakaoId(id).then(user => {
            if (user !== null) {
                throw new Error('User already exists');
            }

            return new User({name, kakao: {
                accessToken, id,
            }}).save().then(({_id}) => _id);
        });
    });
}

export function modifyUser(id, {name, openChatLink}) {
    const update = {name, openChatLink};

    for (let [k, v] of Object.entries(update)) {
        if (v === undefined || v === null) {
            delete update[k];
        }
    }

    if (name !== undefined && name !== null) {
        return User.findOne({name}).exec().then(user => {
            if (user && user._id.toString() !== id) {
                return null;
            }

            return User.findByIdAndUpdate(id, update, {useFindAndModify: true}).exec().then(({_id}) => _id);
        });
    }

    return User.findByIdAndUpdate(id, update, {useFindAndModify: true}).exec().then(({_id}) => _id);
}

export function isAdmin(id) {
    return getUserById(id).then(user => {
        return user.admin
    });
}

export function nicknameExists(nickname) {
    return User.findOne({name: nickname}).exec().then(user => user !== null);
}

export function getArtistById(id) {
    return Artist.findById(id).exec();
}

export function getArtistByName(name) {
    return Artist.findOne({name}).exec();
}

export function getArtistsBelongsTo(artistId) {
    return Artist.find({belongsTo: artistId}).exec();
}

export function getEventsByArtistId(artistId) {
    return Event.find({artists: artistId}).exec();
}

export function getEventsByArtistName(artistName) {
    return getArtistByName(artistName).then(({_id}) => getEventsByArtistId(_id))
}

export function getEventById(id) {
    return Event.findById(id).exec();
}

export function getEventByGoodsId(goodsId) {
    return getGoodsById(goodsId).then(({event}) => getEventById(event));
}

export function addEvent({name, artists, description, date, img}) {
    const event = new Event({name, artists, description, date, img});

    return event.save().then(({_id}) => _id);
}

export function getGoodsById(id) {
    return Goods.findById(id).exec();
}

export function getGoodsByArtistId(artistId, visible=true) {
    const query = {
        artists: artistId
    };

    if (visible) {
        query.$or = [{
            invisible: {
                $exists:false
            }
        }, {
            invisible: false
        }];
    }

    return Goods.find(query).exec();
}

export function getGoodsByEventId(eventId, visible=true) {
    const query = {
        event: eventId
    };

    if (visible) {
        query.$or = [{
            invisible: {
                $exists:false
            }
        }, {
            invisible: false
        }];
    }

    return Goods.find(query).exec();
}

export function getGoodsByEventArtistId(eventId, artistId, visible=true) {
    const query = {
        event: eventId,
        artist: artistId,
    };

    if (visible) {
        query.$or = [{
            invisible: {
                $exists:false
            }
        }, {
            invisible: false
        }];
    }

    return Goods.find(query).exec();
}

export function getGoodsByEventArtistName(eventId, artistName, visible=true) {
    return getArtistByName(artistName).then(artist => {
        return getGoodsByEventArtistId(eventId, artist._id, visible);
    });
}

export function getGoodsByArtistName(artistName, visible=true) {
    return getArtistByName(artistName).then(({_id}) => {
        return getGoodsByArtistId(_id, visible);
    });
}

export function addGoods({name, event, artist, description, img}) {
    const goods = new Goods({name, event, artist, description, img});

    return goods.save().then(({_id}) => _id);
}

export function getItemById(id) {
    return Item.findById(id).exec();
}

export function getItemsByGoodsId(goodsId) {
    return Item.find({goods: goodsId}).exec();
}

export function addItem({idx, artists, goods, img}) {
    const item = new Item({idx, artists, goods, img});

    return item.save().then(({_id}) => _id);
}

export function addItemsByNumber(number, artists, goods) {
    function range(end) {
        return [...Array(end).keys()];
    }

    const promises = range(number).map(idx => new Item({idx, artists, goods}).save().then(({_id}) => _id))

    return Promise.all(promises);
}

export function modifyItem(id, {idx, artists, goods, img}) {
    const update = {idx, artists, goods, img};

    for (let [k, v] of Object.entries(update)) {
        if (v === undefined || v === null) {
            delete update[k];
        }
    }

    return Item.findByIdAndUpdate(id, update, {useFindAndModify: true}).exec().then(({_id}) => _id);
}

export function getUserItemById(id) {
    return UserItem.findById(id).exec();
}

export function getUserItemByIds(userId, itemId, relationType) {
    return UserItem.findOne({user: userId, item: itemId, relationType}).exec();
}

export function getUserItemsByUserId(userId, relationType) {
    return UserItem.find({user: userId, relationType}).exec();
}

export function getUserItemsNotInExchangeByUserId(userId, relationType) {
    return UserItem.find({
        user: userId, 
        relationType,
        exchange: {$exists: false},
    }).exec();
}

export function getUserItemsByUserGoodsId(userId, goodsId, relationType) {
    return getItemsByGoodsId(goodsId).then(items => {
        const itemIds = items.map(item => item._id);

        return UserItem.find({
            user: userId, 
            item: {$in: itemIds},
            relationType
        }).exec();
    });
}

export function getUserItemsByItemIds(itemIds, relationType) {
    return UserItem.find({item: {$in: itemIds}, relationType}).exec();
}

export function getUserItemsByExchangeId(exchangeId) {
    return UserItem.find({exchange: exchangeId}).exec();
}

export function getUserItemsByUserExchangeId(exchangeId, acceptorId) {
    return UserItem.find({exchange: exchangeId, user: acceptorId});
}

export function addUserItem(user, item, num, relationType) {
    const userItem = new UserItem({user, item, num, relationType});

    return userItem.save().then(({_id}) => _id);
}

export function isUserItemRemovable(user, item, relationType) {
    return UserItem.find({user, item, relationType}).exec().then(userItem => {
        return !userItem.hasOwnProperty('exchange');
    });
}

export function removeUserItem(user, item, relationType) {
    return UserItem.findOneAndDelete({
        user, item, relationType,
    }).exec().then(({_id}) => _id);
}

export function getMatchesForUser(userId, limit=-1) {
    return Promise.all([
        getUserItemsNotInExchangeByUserId(userId, RelationTypeEnum.WISH),
        getUserItemsNotInExchangeByUserId(userId, RelationTypeEnum.POSESSION),
    ]).then(([userWishes, userPosessions]) => {
        const userWishItemIds = userWishes.map(({item}) => item);
        const userPosessionItemIds = userPosessions.map(({item}) => item);

        return Promise.all([
            UserItem.aggregate([{
                $match: {
                    item: {
                        $in: userWishItemIds,
                    },
                    relationType: RelationTypeEnum.POSESSION,
                    exchange: {$exists: false},
                },
            }, {
                $group: {
                    _id: '$item',
                    users: {
                        $push: '$user',
                    },
                },
            }, {
                $lookup: {
                    from: 'items',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'item',
                },
            }, {
                $unwind: '$item'

            }, ]).exec(), 
            UserItem.aggregate([{
                $match: {
                    item: {
                        $in: userPosessionItemIds,
                    },
                    relationType: RelationTypeEnum.WISH,
                    exchange: {$exists: false},
                }
            }, {
                $group: {
                    _id: '$item',
                    users: {
                        $push: '$user',
                    },
                }
            }, {
                $lookup: {
                    from: 'items',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'item',
                },
            }, {
                $unwind: '$item'

            },]).exec(), 
        ]).then(([usersPerWishItems, usersPerPosessionItems]) => {
            let matches = [];

            for (const usersPerWishItem of usersPerWishItems) {
                for (const usersPerPosessionItem of usersPerPosessionItems) {
                    if (usersPerWishItem.item.goods.toString() !== usersPerPosessionItem.item.goods.toString())
                        continue;

                    const wishItem = usersPerWishItem._id;
                    const posessionItem = usersPerPosessionItem._id;

                    const usersPosesses = usersPerWishItem.users.map(objId => objId.toString());
                    const usersWishes = usersPerPosessionItem.users.map(objId => objId.toString());

                    const commonUsers = intersection(usersPosesses, usersWishes);

                    matches = matches.concat(commonUsers.map(user => (new Match({
                        wishItem,
                        posessionItem,
                        user,
                    }))));

                    if (limit !== -1 && matches.length >= limit) {
                        return matches.slice(0, limit);
                    }
                }
            }

            return matches;
        });
    });
}

export function addExchange({requestor, acceptor, reqPosessionItem, accPosessionItem, num=1}) {
    return new Exchange({
        requestor, 
        acceptor,
        reqPosessionItem, 
        accPosessionItem, 
        num,
        status: ExchangeStatusEnum.PROGRESSING
    }).save().then(exchange => {
        const exchangeId = exchange._id;

        return Promise.all([
            getUserItemByIds(requestor, reqPosessionItem, RelationTypeEnum.POSESSION),
            getUserItemByIds(requestor, accPosessionItem, RelationTypeEnum.WISH),
            getUserItemByIds(acceptor, accPosessionItem, RelationTypeEnum.POSESSION),
            getUserItemByIds(acceptor, reqPosessionItem, RelationTypeEnum.WISH),
        ]).then(userItems => {
            return Promise.all(userItems.map(userItem => {
                userItem.exchange = exchangeId;
                return userItem.save();
            })).then(() => exchangeId);
        });
    });
}

export function getExchangeById(id) {
    return Exchange.findById(id).exec();
}

export function getExchangesByRequestorId(requestorId) {
    return Exchange.find({requestor: requestorId}).exec();
}

export function getExchangesByUserId(
    userId, 
    reqStatus=[ExchangeStatusEnum.PROGRESSING, ExchangeStatusEnum.REJECTED], 
    accStatus=ExchangeStatusEnum.PROGRESSING) {
    return Exchange.find({$or: [{
        requestor: userId,
        status: reqStatus instanceof Array ? {$in: reqStatus} : reqStatus
    }, {
        acceptor: userId,
        approvedByAcceptor: false,
        status: accStatus
    }]}).exec();
}

export function removeExchange(id) {
    return getUserItemsByExchangeId(id).then(userItems => {
        return Promise.all(userItems.map(userItem => {
            userItem.exchange = undefined;
            return userItem.save();
        })).then(userItems => {
            return Exchange.findByIdAndDelete(id).exec().then(({_id}) => _id);
        });
    });
}

export function rejectExchange(id) {
    return getExchangeById(id).then(exchange => {
        return getUserItemsByUserExchangeId(id, exchange.acceptor).then(userItems => {
            return Promise.all(userItems.map(userItem => {
                userItem.exchange = undefined;
                return userItem.save();
            })).then(userItems => {
                return Exchange.findByIdAndUpdate(id, {
                    status: ExchangeStatusEnum.REJECTED
                }, {useFindAndModify: true}).exec().then(({_id}) => _id);
            })
        });
    });
}

export function resolveExchange(id, user) {
    return getExchangeById(id).then(exchange => {
        const {requestor, acceptor, reqPosessionItem, accPosessionItem, num} = exchange;

        let toAddUser, toAddItem, toRemoveItem;
        switch (user.toString()) {
            case requestor.toString():
                toAddUser = requestor;
                toAddItem = accPosessionItem;
                toRemoveItem = reqPosessionItem;
                exchange.approvedByRequestor = true;
                break;
            case acceptor.toString():
                toAddUser = acceptor;
                toAddItem = reqPosessionItem;
                toRemoveItem = accPosessionItem;
                exchange.approvedByAcceptor = true;
                break;
            default:
                throw new Error('Either requestor or acceptor can resolve the exchange');
        }

        if (exchange.approvedByAcceptor && exchange.approvedByRequestor) {
            exchange.status = ExchangeStatusEnum.COMPLETE;
        }

        return exchange.save().then(savedExchange => {
            const resolvedExchangeId = savedExchange._id;

            return getUserItemByIds(toAddUser, toAddItem, RelationTypeEnum.WISH).then(wish => {
                wish.relationType = RelationTypeEnum.COLLECTION;
                return wish.save().then(collection => {
                    return removeUserItem(toAddUser, toRemoveItem, RelationTypeEnum.POSESSION).then(posession => resolvedExchangeId);
                });
            });
        });
    });
}


export function isExchangeRejectableBy(exchangeId, userId) {
    return getExchangeById(exchangeId).then(exchange => {
        const {acceptor} = exchange;

        return acceptor._id.toString() === userId.toString();
    });
}

export function isExchangeAccessibleTo(exchangeId, userId) {
    return getExchangeById(exchangeId).then(exchange => {
        const {requestor, acceptor} = exchange;

        return [requestor, acceptor].some(id => id.toString() === userId.toString());
    });
}



// export function getMatches() {
//     return UserItem.aggregate([{
//         $group: {
//             _id: {item: '$item', relationType: '$relationType'},
//             users: {
//                 $push: '$user'
//             }
//         }
//     }, {
//         $facet: {
//             wishItems: [{
//                 $match: {
//                     '_id.relationType': 'Wish'
//                 }
//             }],
//             posessionItems: [{
//                 $match: {
//                     '_id.relationType': 'Posession'
//                 }
//             }],
//         }
//     }, {
//         $unwind: '$wishItems'
//     }, {
//         $unwind: '$posessionItems'
//     }, {
//         $addFields: {
//             'wishItemId': {
//                 $toString: '$wishItems._id.item'
//             },
//             'posessionItemId': {
//                 $toString: '$posessionItems._id.item'
//             }
//         }
//     }, {
//         $match: {
//             $expr: {
//                 $eq: ['$wishItemId', '$posessionItemId']
//             }
//         }
//     }, {
//         $project: {
//             itemId: '$wishItems._id.item',
//             wishUsers: '$wishItems.users',
//             posessionUsers: '$posessionItems.users'
//         }
//     }, {
//         $lookup: {
//             from: 'items',
//             localField: 'itemId',
//             foreignField: '_id',
//             as: 'item',
//         }
//     }, {
//         $unwind: '$item'
//     }, {
//         $facet: {
//             req: [{
//                 $addFields: {
//                     goodsId: {
//                         $toString: '$item.goods'
//                     }
//                 }
//             }],
//             acc: [{
//                 $addFields: {
//                     goodsId: {
//                         $toString: '$item.goods'
//                     }
//                 }
//             }]
//         }
//     }, {
//         $unwind: '$req'
//     }, {
//         $unwind: '$acc'
//     }, {
//         $match: {
//             $expr: {
//                 $eq: ['$req.goodsId', '$acc.goodsId']
//             }
//         }
//     }, {
//         $addFields: {
//             reqUsers: {
//                 $setIntersection: ['$req.posessionUsers', '$acc.wishUsers']
//             },
//             accUsers: {
//                 $setIntersection: ['$acc.posessionUsers', '$req.wishUsers']
//             }
//         }
//     }, {
//         $match: {
//             $nor: [{
//                 reqUsers: {
//                     $size: 0
//                 }, 
//                 accUsers: {
//                     $size: 0
//                 }
//             }]
//         }
//     }, {
//         $unwind: '$reqUsers'
//     }, {
//         $unwind: '$accUsers'
//     }, {
//         $project: {
//             requestor: '$reqUsers',
//             acceptor: '$accUsers',
//             reqPosessionItem: '$req.itemId',
//             accPosessionItem: '$acc.itemId'
//         }
//     }]).exec();
// }

// getMatches().then(console.log).catch(console.error);