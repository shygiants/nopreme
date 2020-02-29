import {
    mutationWithClientMutationId,
    toGlobalId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import {
    isExchangeRejectableBy,
    rejectExchange,
} from '../../database/Exchange';

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