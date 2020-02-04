import React, {Component} from 'react';
import {
    graphql, 
    createFragmentContainer,
} from 'react-relay';

import Event from './Event';
import TextInput from './TextInput';

import AddEventMutation from '../mutations/AddEventMutation';

class EventList extends Component {
    handleTextInputSave(eventName) {
        AddEventMutation.commit(this.props.relay.environment, eventName, this.props.artist);
    }

    render() {
        const {editable} = this.props;
        const {events} = this.props.artist;

        const nodes = events.edges.map(edge => edge.node);

        return (
            <div>
                {editable && <TextInput placeholder='이벤트 이름' onSave={this.handleTextInputSave.bind(this)}/>}
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
            artistId
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