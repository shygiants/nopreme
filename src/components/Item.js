import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Link} from 'found';

class Item extends Component {
    render() {
        const {artist, item} = this.props;

        const displayName = artist.members.length === item.members.length ? '단체' : item.members.map(member => member.name).join(', ');

        return <Link to={`/items/${item.itemId}`}>{displayName} {item.idx}</Link>;

    }
}

export default createFragmentContainer(Item, {
    item: graphql`
        fragment Item_item on Item {
            id
            itemId
            idx
            members {
                id
                name
            }
        }
    `,
    artist: graphql`
        fragment Item_artist on Artist {
            id
            members {
                id
            }
        }
    `,
});