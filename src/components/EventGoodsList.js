import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'

import Goods from './Goods';
import {getNodesFromConnection} from '../utils';


class EventGoodsList extends Component {
    

    render() {
        const {event} = this.props;
        const {goodsList} = event;

        const nodes = getNodesFromConnection(goodsList);

        return (
            <div>
                
                <ul>
                    {nodes.map(goods => <li key={goods.id}><Goods goods={goods} /></li>)}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(EventGoodsList, {
    event: graphql`
        fragment EventGoodsList_event on Event @argumentDefinitions(
            artistName: {type: "String"}
        ) {
            id
            eventId
            name
            goodsList(
                artistName: $artistName
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "EventGoodsList_goodsList", filters: ["artistName"]) {
                edges {
                    node {
                        id
                        ...Goods_goods
                    }
                }
            }
        }
    `,
});