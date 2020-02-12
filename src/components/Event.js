import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './Link';

class Event extends Component {
    render() {
        const {event} = this.props;

        const curr = location.hash.slice(1);

        return (
            <Link to={curr + `/events/${event.eventId}`} label={event.name} />
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