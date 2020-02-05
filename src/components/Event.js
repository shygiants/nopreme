import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Link} from 'found';

class Event extends Component {
    render() {
        const {event} = this.props;

        const curr = location.hash.slice(1);

        return (
            <Link to={curr + `/events/${event.eventId}`} >{event.name}</Link>
        );
    }
}

export default createFragmentContainer(Event, {
    event: graphql`
        fragment Event_event on Event {
            id
            eventId
            name
        }
    `,
})