import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemInfo from './ItemInfo';


class ItemApp extends Component {
    render() {
        const {goods, item} = this.props;
        return (
            <ItemInfo goods={goods} item={item} /> 
        );
    }
}

export default createFragmentContainer(ItemApp, {
    item: graphql`
        fragment ItemApp_item on Item {
            id
            ...ItemInfo_item
        }
    `,
    goods: graphql`
        fragment ItemApp_goods on Goods {
            id
            ...ItemInfo_goods
        }
    `,
});