import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import { GraphQLNonNull, GraphQLID, GraphQLInt } from 'graphql';

import { GraphQLExchangeEdge } from '../nodes';
import { 
    RelationTypeEnum, 
    getUserItemByIds, 
} from '../../database/UserItem';
import {
    addExchange, 
    getExchangesByRequestorId,
    getExchangeById,
} from '../../database/Exchange';


export const AddExchangeMutation = mutationWithClientMutationId({
    name: 'AddExchange',
    inputFields: {
        wishItemId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        posessionItemId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        acceptorId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        num: {
            type: GraphQLInt,
            defaultValue: 1,
        },
    },
    outputFields: {
        exchangeEdge: {
            type: new GraphQLNonNull(GraphQLExchangeEdge),
            resolve: ({exchangeId, requestorId}) => {
                return Promise.all([
                    getExchangesByRequestorId(requestorId),
                    getExchangeById(exchangeId),
                ]).then(([exchanges, exchange]) => {
                    const exchangeIds = exchanges.map(exchange => exchange._id.toString());
                    const exchangeId = exchange._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...exchangeIds], exchangeId),
                        node: exchange,
                    };
                });
            }
        }

    },
    mutateAndGetPayload: ({
        wishItemId,
        posessionItemId,
        acceptorId,
        num,
    }, {user: {id}}) => {
        return Promise.all([
            getUserItemByIds(id, wishItemId, RelationTypeEnum.WISH),
            getUserItemByIds(id, posessionItemId, RelationTypeEnum.POSESSION),
            getUserItemByIds(acceptorId, posessionItemId, RelationTypeEnum.WISH),
            getUserItemByIds(acceptorId, wishItemId, RelationTypeEnum.POSESSION),
        ]).then(results => {
            if (results.some(result => result === null))
                return null;

            return addExchange({
                requestor: id, 
                acceptor: acceptorId, 
                reqPosessionItem: posessionItemId, 
                accPosessionItem: wishItemId,
                num
            }).then(exchangeId => ({
                exchangeId,
                requestorId: id,
            }));
        });
    },
});