import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {getKakaoUserInfo, intersection} from '../src/utils';


const userSchema = new mongoose.Schema({
    name: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    openChatLink: {
        type: String,
    },
    kakao: {
        id: String,
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
        ref: 'Artist' 
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
        ref: 'Event' 
    },
    artist: { 
        type: Schema.Types.ObjectId, 
        ref: 'Artist' 
    },
    description: String,
    img: String,
});

export const Goods = mongoose.model('Goods', goodsSchema);


const itemSchema = new mongoose.Schema({
    idx: Number,
    description: String,
    artists: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Artist' 
    }],
    goods: { 
        type: Schema.Types.ObjectId, 
        ref: 'Goods' 
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
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
    },
    num: Number,
    relationType: {
        type: String,
        // TODO: Use enum
        enum: Object.values(RelationTypeEnum),
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

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
    },
    acceptor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reqPosessionItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
    },
    accPosessionItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
    },
    num: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(ExchangeStatusEnum),
    },
});

export const Exchange = mongoose.model('Exchange', exchangeSchema);

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

export function getGoodsByArtistId(artistId) {
    return Goods.find({artists: artistId}).exec();
}

export function getGoodsByEventId(eventId) {
    return Goods.find({event: eventId}).exec();
}

export function getGoodsByEventArtistId(eventId, artistId) {
    return Goods.find({event: eventId, artist: artistId}).exec();
}

export function getGoodsByEventArtistName(eventId, artistName) {
    return getArtistByName(artistName).then(artist => {
        return getGoodsByEventArtistId(eventId, artist._id);
    });
}

export function getGoodsByArtistName(artistName) {
    return getArtistByName(artistName).then(({_id}) => {
        return getGoodsByArtistId(_id);
    });
}

export function addGoods({name, event, artist, description, img}) {
    const goods = new Goods({name, event, artist, description, img});

    return goods.save().then(({_id}) => _id);
}

export function getItemById(id) {
    return Item.findById(id).exec();
}

export function getItemsByArtistGoods(artistName) {
    return getGoodsByArtistName(artistName).then(goodsList => {
        const goodsIdList = goodsList.map(goods => goods._id);

        return Item.find({goods: {$in: goodsIdList}}).exec();
    });
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

export function getUserItemsByItemIds(itemIds, relationType) {
    return UserItem.find({item: {$in: itemIds}, relationType}).exec();
}

export function addUserItem(user, item, num, relationType) {
    const userItem = new UserItem({user, item, num, relationType});

    return userItem.save().then(({_id}) => _id);
}

export function removeUserItem(user, item, relationType) {
    return UserItem.findOneAndDelete({user, item, relationType}).exec().then(({_id}) => _id);
}

export function getMatchesForUser(userId) {
    return Promise.all([
        getUserItemsByUserId(userId, RelationTypeEnum.WISH),
        getUserItemsByUserId(userId, RelationTypeEnum.POSESSION),
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
                        break;

                    const wishItem = usersPerWishItem._id;
                    const posessionItem = usersPerPosessionItem._id;

                    const usersPosesses = usersPerWishItem.users.map(objId => objId.toString());
                    const usersWishes = usersPerPosessionItem.users.map(objId => objId.toString());

                    const commonUsers = intersection(usersPosesses, usersWishes);

                    matches = matches.concat(commonUsers.map(user => ({
                        wishItem,
                        posessionItem,
                        user,
                    })));
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
    }).save().then(({_id}) => _id);
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
        status: accStatus
    }]}).exec();
}

export function removeExchange(id) {
    return Exchange.findByIdAndDelete(id).exec().then(({_id}) => _id);
}

export function rejectExchange(id) {
    return Exchange.findByIdAndUpdate(id, {
        status: ExchangeStatusEnum.REJECTED
    }, {useFindAndModify: true}).exec().then(({_id}) => _id);
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


