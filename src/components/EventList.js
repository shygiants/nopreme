import React, {Component} from 'react';
import {
    graphql, 
    createFragmentContainer,
} from 'react-relay';

import Event from './Event';
import {getNodesFromConnection} from '../utils';

class EventList extends Component {
    render() {
        const {events} = this.props.artist;

        const nodes = getNodesFromConnection(events);

        return (
            <div>
                
                <ul>
                    {nodes.map(event => <li key={event.id}><Event event={event} /></li>)}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(EventList, {
    artist: graphql`
        fragment EventList_artist on Artist {
            id
            events(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "EventList_events") {
                edges {
                    node {
                        id
                        ...Event_event
                    }
                }
            }
        }
    `,

});