import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'

import Item from './Item';

class ItemList extends Component {
    render() {
        const {viewer, artist, items} = this.props;

        const sortedItems = items.sort((f, s) => f.idx - s.idx);

        return (
            <div>
                <ul>
                    {sortedItems.map(item => <li key={item.id}><Item viewer={viewer} artist={artist} item={item} /></li>)}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(ItemList, {
    viewer: graphql`
        fragment ItemList_viewer on User {
            ...Item_viewer
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