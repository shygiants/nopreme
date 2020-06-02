import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} from 'graphql';
import {
    GraphQLEventEdge
} from '../nodes';

import {
    modifyEvent,
    getEventById,
    getEventsByArtistId,
} from '../../database/Event';
import {
    isAdmin,
} from '../../database/User';

export const ModifyEventMutation = mutationWithClientMutationId({
    name: 'ModifyEvent',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        artistId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLString,
        },
        date: {
            type: GraphQLString,
        },
        img: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
    },
    outputFields: {
        eventEdge: {
            type: new GraphQLNonNull(GraphQLEventEdge),
            resolve: ({artistId, eventId}) => {
                return Promise.all([getEventsByArtistId(artistId), getEventById(eventId)]).then(values => {
                    const [events, event] = values;

                    const eventIds = events.map(event => event._id.toString());
                    const eventId = event._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...eventIds], eventId),
                        node: event,
                    };
                });
            },
        },
    },
    mutateAndGetPayload: ({
        id,
        artistId,
        name, 
        date, 
        img,
        description,
    }, {user: {id: userId}}) => {
        return isAdmin(userId).then(admin => {
            if (!admin)
                return null;

            return modifyEvent(id, {name, date, img, description}).then(eventId => {
                return getEventById(eventId).then(event => ({
                    eventId: event._id, 
                    artistId: artistId,
                }));
            });
        });
    },
});