import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemList from './ItemList';
import GoodsInfo from './GoodsInfo';

import {classify} from '../utils';

class GoodsApp extends Component {
    render() {
        const {viewer, artist, event, goods} = this.props;
        const {items} = goods;

        const nodes = items.edges.map(edge => edge.node);
        
        const classified = classify(nodes, 'members.name');
        const memberCombs = [...classified.keys()];

        function displayMemberComb(memberComb) {
            const memberNames = memberComb.split(',');

            return memberNames.length === artist.members.length ? '단체' : memberComb;
        }

        return (
            <div>
                <GoodsInfo event={event} goods={goods}/> 

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
            ...GoodsInfo_event
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
            ...GoodsInfo_goods
        }
    `,
});
