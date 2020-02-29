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