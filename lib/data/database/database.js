import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {intersection} from '../../utils';

import {
    UserItem,
    getUserItemsNotInExchangeByUserId,
    RelationTypeEnum,
} from '../database/UserItem';
import { getUserById, MethodEnum } from './User';
import { getSearchRegions } from './Region';
import { isExchangeable } from './Goods';
import { getBlockedUsers } from './Block';

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

export async function getMatches(userId, limit=-1, filterByRegion=false, method=MethodEnum.DONTCARE) {
    const [userWishes, userPosessions, user] = await Promise.all([
        getUserItemsNotInExchangeByUserId(userId, RelationTypeEnum.WISH),
        getUserItemsNotInExchangeByUserId(userId, RelationTypeEnum.POSESSION),
        getUserById(userId),
    ]);
    
    const userWishItemIds = userWishes.map(({item}) => item);
    const userPosessionItemIds = userPosessions.map(({item}) => item);

    const commonPipeline = [{
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
    }, {
        $addFields: {
            numUsers: {
                $size: '$users'
            }
        }
    }, {
        $sort: {
            numUsers: -1,
        }
    }];

    const blockedUsers = await getBlockedUsers(userId);

    if (filterByRegion || method !== MethodEnum.DONTCARE || blockedUsers.length > 0) {
        const filters = [];

        if (filterByRegion && user.regions.length > 0) {
            const searchRegions = await getSearchRegions(user.regions)

            filters.push({
                $match: {
                    $or: [{
                        'user.regions': {
                            $in: searchRegions,
                        },
                    }, {
                        'user.regions': {
                            $size: 0
                        },
                    }]
                }
            });
        } 
        if (method !== MethodEnum.DONTCARE) {
            filters.push({
                $match: {
                    'user.method': {
                        $in: [method, MethodEnum.DONTCARE],
                    }
                }
            });
        }

        if (blockedUsers.length > 0) {
            filters.push({
                $match: {
                    'user._id': {
                        $nin: blockedUsers,
                    }
                }
            });
        }
        
        const toAddPipeline = [{
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        }, {
            $unwind: '$user'
        }, ...filters, {
            $addFields: {
                userId: '$user._id'
            }
        }, {
            $group: {
                _id: '$item',
                users: {
                    $addToSet: '$userId',
                },
            },
        }, ];
        commonPipeline.splice(0, 1, ...toAddPipeline);
    }

    const [usersPerWishItems, usersPerPosessionItems] = await Promise.all([
        UserItem.aggregate([{
            $match: {
                item: {
                    $in: userWishItemIds,
                },
                relationType: RelationTypeEnum.POSESSION,
                exchange: {$exists: false},
            }
        }].concat(commonPipeline)).exec(), 
        UserItem.aggregate([{
            $match: {
                item: {
                    $in: userPosessionItemIds,
                },
                relationType: RelationTypeEnum.WISH,
                exchange: {$exists: false},
            }
        }].concat(commonPipeline)).exec(), 
    ]);
    let matches = [];

    for (const usersPerWishItem of usersPerWishItems) {
        for (const usersPerPosessionItem of usersPerPosessionItems) {
            
            if (!await isExchangeable(usersPerWishItem.item.goods, usersPerPosessionItem.item.goods))
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

export async function getMatchesForUser(viewerId, userId, limit=-1) {
    const [viewerWishes, viewerPosessions, viewer] = await Promise.all([
        getUserItemsNotInExchangeByUserId(viewerId, RelationTypeEnum.WISH),
        getUserItemsNotInExchangeByUserId(viewerId, RelationTypeEnum.POSESSION),
        getUserById(userId),
    ]);

    const commonPipeline = [{
        $lookup: {
            from: 'items',
            localField: 'item',
            foreignField: '_id',
            as: 'item',
        },
    }, {
        $unwind: '$item'
    }];

    const [usersPerWishItems, usersPerPosessionItems] = await Promise.all([
        UserItem.aggregate([{
            $match: {
                item: {
                    $in: userWishItemIds,
                },
                user: userId,
                relationType: RelationTypeEnum.POSESSION,
                exchange: {$exists: false},
            }
        }].concat(commonPipeline)).exec(), 
        UserItem.aggregate([{
            $match: {
                item: {
                    $in: userPosessionItemIds,
                },
                user: userId,
                relationType: RelationTypeEnum.WISH,
                exchange: {$exists: false},
            }
        }].concat(commonPipeline)).exec(), 
    ]);
    let matches = [];

    for (const usersPerWishItem of usersPerWishItems) {
        for (const usersPerPosessionItem of usersPerPosessionItems) {
            
            if (!await isExchangeable(usersPerWishItem.item.goods, usersPerPosessionItem.item.goods))
                continue;

            const wishItem = usersPerWishItem._id;
            const posessionItem = usersPerPosessionItem._id;

            matches.push(new Match({
                wishItem,
                posessionItem,
                user: userId,
            }));

            if (limit !== -1 && matches.length >= limit) {
                return matches.slice(0, limit);
            }
        }
    }

    return matches;
}