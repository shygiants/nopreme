import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {getKakaoUserInfo, intersection} from '../../utils';


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