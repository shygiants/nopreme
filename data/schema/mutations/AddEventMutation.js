import {
    mutationWithClientMutationId,
    cursorForObjectInConnection,
} from 'graphql-relay';
import {
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from 'graphql';
import {
    GraphQLEventEdge
} from '../nodes';
import {
    getEventById,
    addEvent,
    getEventsByArtistId
} from '../../database';

export const AddEventMutation = mutationWithClientMutationId({
    name: 'AddEvent',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        artistIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLID)),
        },
    },
    outputFields: {
        eventEdge: {
            type: new GraphQLNonNull(GraphQLEventEdge),
            resolve: ({eventId, artistIds}) => {
                const event = getEventById(eventId);
                return Promise.all([getEventsByArtistId(artistIds), event]).then(values => {
                    const events = values[0];
                    const event = values[1];

                    const eventIds = events.map(event => event._id.toString());
                    const eventId = event._id.toString();

                    return {
                        cursor: cursorForObjectInConnection([...eventIds], eventId),
                        node: event,
                    };
                })
                
            },
        },
    },
    mutateAndGetPayload: ({
        name,
        artistIds
    }) => {
        return addEvent(name, artistIds).then(eventId => ({eventId, artistIds}));
    }
});