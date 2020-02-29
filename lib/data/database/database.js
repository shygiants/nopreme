import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {getKakaoUserInfo, intersection} from '../../utils';

import {
    UserItem,
    getUserItemsNotInExchangeByUserId,
    RelationTypeEnum,
} from '../database/UserItem';

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
                        $addToSet: '$user',
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
                        $addToSet: '$user',
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