import {
    graphql,
    commitMutation,
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation AddEventMutation($input: AddEventInput!) {
        addEvent(input: $input) {
            eventEdge {
                __typename
                cursor
                node {
                    id
                    eventId
                    name

                }              
            }
        }
    }
`;

function sharedUpdater(store, artist, newEdge) {
    const artistProxy = store.get(artist.id);
    const conn = ConnectionHandler.getConnection(artistProxy, 'EventList_events');
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
  }

function commit(
    environment, {
    name, 
    artist, 
    description, 
    date, 
    img
}) {

    console.log(mutation);
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    name, 
                    artistIds: [artist.artistId],
                    description,
                    date,
                    img,
                },
            },
            updater: store => {
                const payload = store.getRootField('addEvent');
                const newEdge = payload.getLinkedRecord('eventEdge');
                sharedUpdater(store, artist, newEdge);
            }
        },
    );
}

export default {commit};