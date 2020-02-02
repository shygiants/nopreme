import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'

import Goods from './Goods';
import AddGoodsMutation from '../mutations/AddGoodsMutation';
import TextInput from './TextInput';

class GoodsList extends Component {
    handleTextInputSave(goodsName) {
        const {relay, event, artist} = this.props;
        AddGoodsMutation.commit(
            relay.environment, 
            goodsName, 
            event, 
            artist);
    }

    render() {
        const {event, artist} = this.props;
        const {goodsList} = event;

        const nodes = goodsList.edges.map(edge => edge.node);

        return (
            <div>
                <TextInput placeholder='굿즈 이름' onSave={this.handleTextInputSave.bind(this)} />
                <ul>
                    {nodes.map(goods => <li key={goods.id}><Goods goods={goods} /></li>)}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(GoodsList, {
    event: graphql`
        fragment GoodsList_event on Event @argumentDefinitions(
            artistName: {type: "String"}
        ) {
            id
            eventId
            name
            goodsList(
                artistName: $artistName
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "GoodsList_goodsList", filters: ["artistName"]) {
                edges {
                    node {
                        id
                        ...Goods_goods
                    }
                }
            }
        }
    `,
    artist: graphql`
        fragment GoodsList_artist on Artist {
            id
            artistId
            name
        }
    `,
});