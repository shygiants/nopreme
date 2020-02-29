import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {getArtistByName} from './Artist';
import {getGoodsById} from './Goods';

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