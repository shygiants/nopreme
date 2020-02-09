import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemInfo from './ItemInfo';
import ItemInput from './ItemInput';

import ModifyItemMutation from '../mutations/ModifyItemMutation';


class ItemEditor extends Component {
    handleItemSave({img}) {
        const {relay, item, goods} = this.props;
        ModifyItemMutation.commit(
            relay.environment, {
                id: item.itemId,
                goods,
                img,
            });
    }

    render() {
        const {goods, item} = this.props;
        return (
            <div>
                <ItemInfo goods={goods} item={item} /> 
                <ItemInput onSubmit={this.handleItemSave.bind(this)} />
            </div>
        );
    }
}

export default createFragmentContainer(ItemEditor, {
    item: graphql`
        fragment ItemEditor_item on Item {
            id
            itemId
            ...ItemInfo_item
        }
    `,
    goods: graphql`
        fragment ItemEditor_goods on Goods {
            id
            goodsId
            ...ItemInfo_goods
        }
    `,
});