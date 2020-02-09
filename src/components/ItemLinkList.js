import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'

import ItemLink from './ItemLink';

class ItemLinkList extends Component {
    render() {
        const {artist, items} = this.props;

        const sortedItems = items.sort((f, s) => f.idx - s.idx);

        return (
            <div>
                <ul>
                    {sortedItems.map(item => (
                        <li key={item.id}>
                            <ItemLink artist={artist} item={item} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default createFragmentContainer(ItemLinkList, {
    artist: graphql`
        fragment ItemLinkList_artist on Artist {
            id
            ...ItemLink_artist
        }
    `,
    items: graphql`
        fragment ItemLinkList_items on Item @relay(plural: true) {
            id
            idx
            ...ItemLink_item
        }
    `,
});