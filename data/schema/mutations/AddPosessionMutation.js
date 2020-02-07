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
    getUserById,
    addUserItem,
    getUserItemsByUserId,
    getUserItemById
} from '../../database';

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
            resolve: ({posessionId, userId}) => {
                return Promise.all([getUserItemsByUserId(userId, 'Posession'), getUserItemById(posessionId)]).then(values => {
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

            return addUserItem(userId, itemId, num, 'Posession').then(posessionId => ({posessionId, userId}));
        });
    }
});