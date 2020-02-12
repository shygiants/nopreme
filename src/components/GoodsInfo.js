import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import Link from './Link';

class GoodsInfo extends Component {
    render() {
        const {event, goods} = this.props;
        
        const curr = location.hash.slice(1);

        return (
            <div>
                <h1>{goods.name}</h1>
                <img src={goods.img} />
                <div>
                    <Link to={curr + `/events/${event.eventId}`} label={event.name}/>
                </div>
                
                <p>{goods.description}</p>
            </div>
        );
    }
}

export default createFragmentContainer(GoodsInfo, {
    event: graphql`
        fragment GoodsInfo_event on Event {
            id
            name
            eventId
        }
    `,
    goods: graphql`
        fragment GoodsInfo_goods on Goods {
            id
            name
            img
            description
        }
    `,
});