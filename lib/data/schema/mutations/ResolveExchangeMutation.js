import {
    mutationWithClientMutationId,
    toGlobalId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import {
    isExchangeAccessibleTo,
    resolveExchange,
} from '../../database/Exchange';

export const ResolveExchangeMutation = mutationWithClientMutationId({
    name: 'ResolveExchange',
    inputFields: {
        exchangeId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        resolvedExchangeId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({exchangeId}) => toGlobalId('Exchange', exchangeId),
        },
    },
    mutateAndGetPayload: ({
        exchangeId,
    }, {user: {id: userId}}) => {
        return isExchangeAccessibleTo(exchangeId, userId).then(accessible => {
            if (!accessible)
                return null;

            return resolveExchange(
                exchangeId, userId).then(resolvedExchangeId => ({exchangeId: resolvedExchangeId}));
        });
    },
});