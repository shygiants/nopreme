import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {getKakaoUserInfo} from '../src/utils';


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
    posesses: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Item' 
    }],
    wishes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Item' 
    }],
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
});

export const Item = mongoose.model('Item', itemSchema);


export function isObjectId(idOrObj) {
    return idOrObj instanceof mongoose.Types.ObjectId
}


export function getUserById(id) {
    return User.findById(id).exec();
}

export function getUserByKakaoId(kakaoId) {
    return User.findOne({'kakao.id': kakaoId}).exec();
}

export function addUser(name, openChatLink, accessToken) {
    return getKakaoUserInfo(accessToken).then(({id}) => {
        return getUserByKakaoId(id).then(user => {
            if (user !== null) {
                throw new Error('User already exists');
            }

            return new User({name, openChatLink, kakao: {
                accessToken, id
            }}).save().then(({_id}) => _id);
        });
    });
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

export function addEvent(name, artists) {
    const event = new Event({name, artists});

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

export function addGoods(name, event, artist) {
    const goods = new Goods({name, event, artist});

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

export function addItem(idx, artists, goods) {
    const item = new Item({idx, artists, goods});

    return item.save().then(({_id}) => _id);
}

export function addItemsByNumber(number, artists, goods) {
    function range(end) {
        return [...Array(end).keys()];
    }

    const promises = range(number).map(idx => new Item({idx, artists, goods}).save().then(({_id}) => _id))

    return Promise.all(promises);
}