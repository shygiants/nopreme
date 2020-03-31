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
                    img
                    date
                    description
                }              
            }
        }
    }
`;

function commit(
    environment, {
    name, 
    artist, 
    description, 
    date, 
    img
}, onCompleted=() => {}) {
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
            configs: [{
                type: 'RANGE_ADD',
                parentID: artist.id,
                connectionInfo: [{
                    key: 'EventList_events',
                    rangeBehavior: 'append',
                }],
                edgeName: 'eventEdge',
            }],
            onCompleted,
        },
    );
}

export default {commit};