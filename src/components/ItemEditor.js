import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemInfo from './ItemInfo';
import ItemInput from './ItemInput';

import ModifyItemMutation from '../mutations/ModifyItemMutation';


class ItemEditor extends Component {
    handleItemSave({img}) {
        const {relay, item} = this.props;
        ModifyItemMutation.commit(
            relay.environment, {
                id: item.itemId,
                img,
            });
    }

    render() {
        const {item} = this.props;
        return (
            <div>
                <ItemInfo item={item} /> 
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
});