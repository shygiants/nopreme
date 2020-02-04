import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'

import Item from './Item';
import SelectionInput from './SelectionInput';
import TextsInput from './TextsInput';

import AddItemMutation from '../mutations/AddItemMutation';

import {range} from '../utils';


class ItemList extends Component {
    handleTextsInputSave({numPerMembers, numPerGroup}) {
        const {relay, goods, artist} = this.props;

        numPerMembers = Number(numPerMembers);
        numPerGroup = Number(numPerGroup);

        if (numPerMembers > 0) {
            artist.members.forEach(member => {
                range(numPerMembers).forEach(idx => {
                    AddItemMutation.commit(relay.environment, idx, [member.memberId], goods);
                });
            });
        }

        if (numPerGroup > 0) {
            range(numPerGroup).forEach(idx => {
                AddItemMutation.commit(relay.environment, idx, artist.members.map(member => member.memberId), goods);
            });
        }
    }

    render() {
        const {items} = this.props.goods;

        const nodes = items.edges.map(edge => edge.node);


        function strcmp(f, s) {
            return f.localeCompare(s);
        }

        function itemToString(item) {
            return `${item.members[0].name} ${item.idx}`
        }

        const sortedItems = nodes.sort((f, s) => strcmp(itemToString(f), itemToString(s)));

        // const memberNames = this.props.artist.members.map(member => member.name);

        const texts = [{
            name: 'numPerMembers',
            display: '멤버 당 수',
        }, {
            name: 'numPerGroup',
            display: '그룹 당 수',
        }]

        return (
            <div>
                {/* <SelectionInput options={memberNames} /> */}
                {this.props.editable && <TextsInput texts={texts} onSave={this.handleTextsInputSave.bind(this)} />}
                <ul>
                    {sortedItems.map(item => <li key={item.id}><Item item={item} artist={this.props.artist} /></li>)}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(ItemList, {
    goods: graphql`
        fragment ItemList_goods on Goods {
            id
            goodsId
            items(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "ItemList_items") {
                edges {
                    node {
                        id
                        idx
                        members {
                            id
                            name
                        }
                        ...Item_item
                    }
                }
            }
        }
    `,
    artist: graphql`
        fragment ItemList_artist on Artist {
            id
            members {
                id
                memberId
                name
            }
            ...Item_artist
        }
    `,
});