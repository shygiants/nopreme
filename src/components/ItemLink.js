import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './styled-components/Link';

class ItemLink extends Component {
    render() {
        const {artist, item} = this.props;

        const displayName = artist.members.length === item.members.length ? '단체' : item.members.map(member => member.name).join(', ');

        const curr = location.hash.slice(1);

        return (
            <div>
                <Link to={curr + `/items/${item.itemId}`} label={`${displayName} ${item.idx}`} />
                <img src={item.img} />
            </div>
        );

    }
}

export default createFragmentContainer(ItemLink, {
    artist: graphql`
        fragment ItemLink_artist on Artist {
            id
            members {
                id
            }
        }
    `,
    item: graphql`
        fragment ItemLink_item on Item {
            id
            itemId
            idx
            img
            members {
                id
                name
            }
        }
    `,
});