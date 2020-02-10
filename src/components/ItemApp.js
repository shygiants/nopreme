import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemInfo from './ItemInfo';


class ItemApp extends Component {
    render() {
        const {item} = this.props;
        return (
            <ItemInfo item={item} /> 
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
});