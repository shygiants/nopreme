import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'

import Item from './Item';
import { Box } from 'grommet';

class ItemList extends Component {
    render() {
        const {viewer, artist, items} = this.props;

        const sortedItems = items.sort((f, s) => f.idx - s.idx);

        return (
            <Box
                align='start'
                direction='row'
                wrap
                justify='start'
                gap='small'
                pad={{vertical: 'small'}}
            >
                {sortedItems.map((item) =>(
                    <Item key={item.id} viewer={viewer} artist={artist} item={item} />
                ))}
            </Box>
        );
    }
}

export default createFragmentContainer(ItemList, {
    viewer: graphql`
        fragment ItemList_viewer on User @argumentDefinitions(
            goodsId: {type: "ID"}
        ) {
            ...Item_viewer @arguments(goodsId: $goodsId)
        }
    `,
    artist: graphql`
        fragment ItemList_artist on Artist {
            id
            ...Item_artist
        }
    `,
    items: graphql`
        fragment ItemList_items on Item @relay(plural: true) {
            id
            idx
            ...Item_item
        }
    `,
});