import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemList from './ItemList';
import ToggleSwitch from './ToggleSwitch';

import TextsInput from './TextsInput';
import AddItemMutation from '../mutations/AddItemMutation';

import {range, classify} from '../utils';

class GoodsApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editable: false,
        };
    }

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

    handleToggle() {
        this.setState(state => ({
            editable: !state.editable,
        }));
    }

    render() {
        const {editable} = this.state;

        const {viewer, artist, event, goods} = this.props;
        const {items} = goods;

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
                <h1>{goods.name}</h1>
                <h2>{event.name}</h2>
                <ToggleSwitch on={editable} onChange={this.handleToggle.bind(this)} label='Admin' />
                {/* <SelectionInput options={memberNames} /> */}
                {editable && <TextsInput texts={texts} onSave={this.handleTextsInputSave.bind(this)} />}

                {memberCombs.map(memberComb => (
                    <div key={memberComb}>
                        <h3>{displayMemberComb(memberComb)}</h3>
                        <ItemList viewer={viewer} artist={artist} items={classified.get(memberComb)} />
                    </div>
                ))}
            </div>
        );
    }
}

export default createFragmentContainer(GoodsApp, {
    viewer: graphql`
        fragment GoodsApp_viewer on User {
            ...ItemList_viewer
        }
    `,
    artist: graphql`
        fragment GoodsApp_artist on Artist {
            id
            members {
                id
                memberId
                name
            }
            ...ItemList_artist
        }
    `,
    event: graphql`
        fragment GoodsApp_event on Event {
            id
            name
        }
    `,
    goods: graphql`
        fragment GoodsApp_goods on Goods {
            id
            goodsId
            name
            items(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "GoodsApp_items") {
                edges {
                    node {
                        id
                        members {
                            id
                            name
                        }
                        ...ItemList_items
                    }
                }
            }
        }
    `,
});
