import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemLinkList from './ItemLinkList';
import GoodsInfo from './GoodsInfo';

import TextsInput from './TextsInput';
import AddItemMutation from '../mutations/AddItemMutation';

import {range, classify} from '../utils';

class GoodsEditor extends Component {

    handleItemsSave({numPerMembers, numPerGroup}) {
        const {relay, goods, artist, itemList} = this.props;

        numPerMembers = Number(numPerMembers);
        numPerGroup = Number(numPerGroup);

        if (numPerMembers > 0) {
            artist.members.forEach(member => {
                range(numPerMembers).forEach(idx => {
                    AddItemMutation.commit(relay.environment, idx, [member.memberId], goods.goodsId, itemList);
                });
            });
        }

        if (numPerGroup > 0) {
            range(numPerGroup).forEach(idx => {
                AddItemMutation.commit(relay.environment, idx, artist.members.map(member => member.memberId), goods.goodsId, itemList);
            });
        }
    }

    render() {
        const {artist, event, goods, itemList} = this.props;
        const {items} = itemList;

        const nodes = items.edges.map(edge => edge.node);
        
        const texts = [{
            name: 'numPerMembers',
            display: '멤버 당 수',
        }, {
            name: 'numPerGroup',
            display: '그룹 당 수',
        }];

        const classified = classify(nodes, 'members.name');
        const memberCombs = [...classified.keys()];

        // const memberNames = this.props.artist.members.map(member => member.name);

        function displayMemberComb(memberComb) {
            const memberNames = memberComb.split(',');

            return memberNames.length === artist.members.length ? '단체' : memberComb;
        }

        return (
            <div>
                <GoodsInfo event={event} goods={goods} />
                <TextsInput texts={texts} onSave={this.handleItemsSave.bind(this)} />

                {memberCombs.map(memberComb => (
                    <div key={memberComb}>
                        <h3>{displayMemberComb(memberComb)}</h3>
                        <ItemLinkList artist={artist} items={classified.get(memberComb)} />
                    </div>
                ))}
            </div>
        );
    }
}

export default createFragmentContainer(GoodsEditor, {
    artist: graphql`
        fragment GoodsEditor_artist on Artist {
            id
            members {
                id
                memberId
                name
            }
            ...ItemLinkList_artist
        }
    `,
    event: graphql`
        fragment GoodsEditor_event on Event {
            id
            name
            ...GoodsInfo_event
        }
    `,
    goods: graphql`
        fragment GoodsEditor_goods on Goods {
            id
            goodsId
            name
            ...GoodsInfo_goods
        }
    `,
    itemList: graphql`
        fragment GoodsEditor_itemList on ItemList {
            id
            items(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "GoodsEditor_items") {
                edges {
                    node {
                        id
                        members {
                            id
                            name
                        }
                        ...ItemLinkList_items
                    }
                }
            }
        }
    `,
});
