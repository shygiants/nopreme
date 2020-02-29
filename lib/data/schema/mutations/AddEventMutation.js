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
} from '../../database/Event';
import {
    isAdmin,
} from '../../database/User';

export const AddEventMutation = mutationWithClientMutationId({
    name: 'AddEvent',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        artistIds: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLID)),
        },
        date: {
            type: new GraphQLNonNull(GraphQLString)
        },
        img: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: GraphQLString,
        }
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
        artistIds,
        date,
        img, 
        description,
    }, {user: {id}}) => {
        return isAdmin(id).then(admin => {
            if (!admin)
                return null;

            return addEvent({
                name, 
                artists: artistIds, 
                date, 
                img, 
                description,
            }).then(eventId => ({eventId, artistIds}));
        });
    }
});