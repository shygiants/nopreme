import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {
    getItemsByGoodsId
} from './Item';

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

userItemSchema.index({user: 1, item: 1, relationType: 1});

export const UserItem = mongoose.model('UserItem', userItemSchema);

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