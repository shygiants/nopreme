import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemList from './ItemList';

class GoodsApp extends Component {
    render() {
        const {goods, artist} = this.props;

        return (
            <div>
                <h1>{goods.name}</h1>
                <ItemList goods={goods} artist={artist} />
            </div>
        );
    }
}

export default createFragmentContainer(GoodsApp, {
    goods: graphql`
        fragment GoodsApp_goods on Goods {
            id
            name
            ...ItemList_goods
        }
    `,
});
