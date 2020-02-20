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
    GraphQLCollectionEdge,
} from '../nodes';
import {
    getUserById,
    addUserItem,
    getUserItemsByUserId,
    getUserItemById,
    getItemById,
    RelationTypeEnum,
    getUserItemsByUserGoodsId
} from '../../database';

export const AddCollectionMutation = mutationWithClientMutationId({
    name: 'AddCollection',
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
        collectionEdge: {
            type: new GraphQLNonNull(GraphQLCollectionEdge),
            resolve: ({collectionId, userId, goodsId}) => {
                return Promise.all([getUserItemsByUserGoodsId(userId, goodsId, RelationTypeEnum.COLLECTION), getUserItemById(collectionId)]).then(values => {
                    const collections = values[0];
                    const collection = values[1];

                    const collectionIds = collections.map(coll => coll._id.toString());
                    const collectionId = collection._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...collectionIds], collectionId),
                        node: collection,
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
                return addUserItem(userId, itemId, num, RelationTypeEnum.COLLECTION).then(collectionId => ({collectionId, userId, goodsId: item.goods}));
            });
        });
    }
});