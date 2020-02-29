import {
    mutationWithClientMutationId,
    toGlobalId,
} from 'graphql-relay';
import {
    GraphQLNonNull,
    GraphQLID,
} from 'graphql';
import {
    getExchangeById,
    removeExchange
} from '../../database/Exchange';
import {
    getUserById,
} from '../../database/User';


export const RemoveExchangeMutation = mutationWithClientMutationId({
    name: 'RemoveExchange',
    inputFields: {
        exchangeId: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    outputFields: {
        deletedExchangeId: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: ({exchangeId}) => toGlobalId('Exchange', exchangeId),
        },
    },
    mutateAndGetPayload: ({
        exchangeId,
    }, {user: {id}}) => {

        return getUserById(id).then(user => {
            const userId = user._id;

            return getExchangeById(exchangeId).then(({requestor}) => {
                if (requestor.toString() !== userId.toString()) {
                    return null;
                }

                return removeExchange(exchangeId).then(exchangeId => ({exchangeId}));
            });            
        });
    },
});