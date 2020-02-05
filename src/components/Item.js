import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Link} from 'found';

class Item extends Component {
    render() {
        const {viewer, artist, item} = this.props;

        const displayName = artist.members.length === item.members.length ? '단체' : item.members.map(member => member.name).join(', ');

        const curr = location.hash.slice(1);

        const {collects, posesses, wishes} = viewer;

        function isIn(coll, elem) {
            const ids = coll.map(e => e.itemId);
            return ids.includes(elem);
        }

        return (
            <div>
                <Link to={curr + `/items/${item.itemId}`}>{displayName} {item.idx}</Link>
                <label><input type='checkbox' checked={isIn(collects, item.itemId)} />수집</label>
                <label><input type='checkbox' checked={isIn(posesses, item.itemId)} />보유</label>
                <label><input type='checkbox' checked={isIn(wishes, item.itemId)} />희망</label>
            </div>
        );

    }
}

export default createFragmentContainer(Item, {
    viewer: graphql`
        fragment Item_viewer on User {
            id
            collects {
                id
                itemId
            }
            posesses {
                id
                itemId
            }
            wishes {
                id
                itemId
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
});