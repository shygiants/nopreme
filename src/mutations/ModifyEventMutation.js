import {
    graphql,
    commitMutation,
} from 'react-relay';

const mutation = graphql`
    mutation ModifyEventMutation($input: ModifyEventInput!) {
        modifyEvent(input: $input) {
            eventEdge {
                __typename
                cursor
                node {
                    id
                    eventId
                    name
                    description
                    date
                    img
                }              
            }
        }
    }
`;

function commit(environment, {id, artistId, name, date, description, img}, onCompleted=() => {}) {
    return commitMutation(
        environment, 
        {
            mutation,
            variables: {
                input: {
                    id,
                    artistId, 
                    name,
                    date,
                    description,
                    img,
                },
            },
            onCompleted,
        },
    );
}

export default {commit};