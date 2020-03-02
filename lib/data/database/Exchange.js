import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {
    getUserItemByIds,
    RelationTypeEnum,
    getUserItemsByExchangeId,
    getUserItemsByUserExchangeId,
    removeUserItem,
} from './UserItem';

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
    }]}).sort({createdAt: -1}).exec();
}

export function getRequestedExchangesByUserId(
    userId,
    status=[ExchangeStatusEnum.PROGRESSING, ExchangeStatusEnum.REJECTED]
) {
    return Exchange.find({
        requestor: userId,
        status: status instanceof Array ? {$in: status} : status,
    }).sort({createdAt: -1}).exec();
}

export function getAcceptedExchangesByUserId(
    userId,
    status=ExchangeStatusEnum.PROGRESSING,
) {
    return Exchange.find({
        acceptor: userId,
        approvedByAcceptor: false,
        status,
    }).sort({createdAt: -1}).exec();
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
