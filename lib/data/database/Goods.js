import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {getArtistByName} from './Artist';


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
    exchangeables: {
        type: [Schema.Types.ObjectId], 
        ref: 'Goods',
        default: [],
    },
});

export const Goods = mongoose.model('Goods', goodsSchema);

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

async function interGoodsExchangeable(a, b) {
    const goods = await getGoodsById(a);

    const bStringId = b.toString();
    return goods.exchangeables && goods.exchangeables.some(exchangeable => exchangeable.toString() === bStringId);
}

export async function isExchangeable(a, b) {
    
    return a.toString() === b.toString() || await interGoodsExchangeable(a, b);
}

export async function modifyGoods(id, {name, img, description}) {
    const update = {name, img, description};

    for (let [k, v] of Object.entries(update)) {
        if (v === undefined || v === null) {
            delete update[k];
        }
    }

    const updated = await Goods.findByIdAndUpdate(id, update, {useFindAndModify: true}).exec();

    return updated._id;
}