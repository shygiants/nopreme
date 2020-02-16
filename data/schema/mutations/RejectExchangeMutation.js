import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
    toGlobalId,
} from 'graphql-relay';
import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} from 'graphql';
import {
    GraphQLItemEdge, GraphQLExchangeEdge
} from '../nodes';
import {
    getItemsByGoodsId,
    getItemById,
    isAdmin,
    modifyItem,
    isExchangeRejectableBy,
    rejectExchange,
} from '../../database';

export const RejectExchangeMutation = mutationWithClientMutationId({
    name: 'RejectExchange',
    inputFields: {
        exchangeId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        rejectedExchangeId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({exchangeId}) => toGlobalId('Exchange', exchangeId),
        },
    },
    mutateAndGetPayload: ({
        exchangeId,
    }, {user: {id: userId}}) => {
        return isExchangeRejectableBy(exchangeId, userId).then(rejectable => {
            if (!rejectable) 
                return null;

            return rejectExchange(exchangeId).then(exchangeId => ({exchangeId}));
        });
    },
});