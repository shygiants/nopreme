import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
} from 'graphql';
import {
    GraphQLPosessionEdge,
} from '../nodes';
import {
    addUserItem,
    getUserItemById,
    getUserItemsByUserGoodsId,
    RelationTypeEnum
} from '../../database/UserItem';
import {
    getUserById,
} from '../../database/User';
import {
    getItemById,
} from '../../database/Item';

export const AddPosessionMutation = mutationWithClientMutationId({
    name: 'AddPosession',
    inputFields: {
        itemId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        num: {
            type: GraphQLInt,
            defaultValue: 1,
        },
    },
    outputFields: {
        posessionEdge: {
            type: new GraphQLNonNull(GraphQLPosessionEdge),
            resolve: ({posessionId, userId, goodsId}) => {
                return Promise.all([getUserItemsByUserGoodsId(userId, goodsId, RelationTypeEnum.POSESSION), getUserItemById(posessionId)]).then(values => {
                    const posessions = values[0];
                    const posession = values[1];

                    const posessionIds = posessions.map(pos => pos._id.toString());
                    const posessionId = posession._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...posessionIds], posessionId),
                        node: posession,
                    };
                })
                
            },
        },
    },
    mutateAndGetPayload: ({
        itemId,
        num,
    }, {user: {id}}) => {
        return getUserById(id).then(user => {
            const userId = user._id;

            return getItemById(itemId).then(item => {
                return addUserItem(userId, itemId, num, RelationTypeEnum.POSESSION).then(posessionId => ({posessionId, userId, goodsId: item.goods}));
            });
        });
    }
});