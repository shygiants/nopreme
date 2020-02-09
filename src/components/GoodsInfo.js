import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

class GoodsInfo extends Component {
    render() {
        const {event, goods} = this.props;

        return (
            <div>
                <h1>{goods.name}</h1>
                <img src={goods.img} />
                <h2>{event.name}</h2>
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