import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemList from './ItemList';
import GoodsInfo from './GoodsInfo';

import {classify} from '../utils';
import { Box, Accordion, AccordionPanel } from 'grommet';

class GoodsApp extends Component {
    render() {
        const {viewer, artist, event, goods, itemList} = this.props;
        const {items} = itemList;

        const nodes = items.edges.map(edge => edge.node);
        
        const classified = classify(nodes, 'members.name');
        const memberCombs = [...classified.keys()];

        function displayMemberComb(memberComb) {
            const memberNames = memberComb.split(',');

            return memberNames.length === artist.members.length ? '단체' : memberComb;
        }

        return (
            <Box>
                <GoodsInfo event={event} goods={goods}/> 
                <Accordion multiple pad={{horizontal: 'medium'}}>
                    {memberCombs.map(memberComb => (
                        <AccordionPanel key={memberComb} label={displayMemberComb(memberComb)}>
                            <Box direction='column' align='center'>
                                <ItemList viewer={viewer} artist={artist} items={classified.get(memberComb)} />
                            </Box>
                        </AccordionPanel>
                    ))}
                </Accordion>
            </Box>
        );
    }
}

export default createFragmentContainer(GoodsApp, {
    viewer: graphql`
        fragment GoodsApp_viewer on User @argumentDefinitions(
            goodsId: {type: "ID"},
        ) {
            ...ItemList_viewer @arguments(goodsId: $goodsId)
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
            ...GoodsInfo_goods
        }
    `,
    itemList: graphql`
        fragment GoodsApp_itemList on ItemList {
            id
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
