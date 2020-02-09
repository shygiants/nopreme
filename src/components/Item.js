import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';

import ToggleSwitch from './ToggleSwitch';
import ItemLink from './ItemLink';
import AddCollectionMutation from '../mutations/AddCollectionMutation';
import AddPosessionMutation from '../mutations/AddPosessionMutation';
import AddWishMutation from '../mutations/AddWishMutation';
import RemoveCollectionMutation from '../mutations/RemoveCollectionMutation';
import {getNodesFromConnection} from '../utils';
import RemovePosessionMutation from '../mutations/RemovePosessionMutation';
import RemoveWishMutation from '../mutations/RemoveWishMutation';

const COLLECTION = 'collection';
const POSESSION = 'posession';
const WISH = 'wish';

class Item extends Component {
    handleCheck(event) {
        const target = event.target;
        const checked = target.checked;
        const name = target.name;

        const {relay, item, viewer} = this.props;

        let mutation;
        switch (name) {
            case COLLECTION:
                mutation = checked ? AddCollectionMutation : RemoveCollectionMutation;
                mutation.commit(relay.environment, item, viewer);
                break;
            case POSESSION:
                mutation = checked ? AddPosessionMutation : RemovePosessionMutation;
                mutation.commit(relay.environment, item, viewer);
                break;
            case WISH:
                mutation = checked ? AddWishMutation : RemoveWishMutation;
                mutation.commit(relay.environment, item, viewer);
                break;
            default:
                throw new Error('Invalid `name`');
        }

    }

    render() {
        const {viewer, artist, item} = this.props;

        const {collects, posesses, wishes} = viewer;

        const collectionNodes = getNodesFromConnection(collects);
        const posessionNodes = getNodesFromConnection(posesses);
        const wishNodes = getNodesFromConnection(wishes);

        function isIn(coll, elem) {
            const ids = coll.map(e => e.item.itemId);
            return ids.includes(elem);
        }

        return (
            <div>
                <ItemLink artist={artist} item={item} />
                <ToggleSwitch 
                    name={COLLECTION} 
                    on={isIn(collectionNodes, item.itemId)}
                    onChange={this.handleCheck.bind(this)}
                    label='수집'
                />
                <ToggleSwitch 
                    name={POSESSION} 
                    on={isIn(posessionNodes, item.itemId)}
                    onChange={this.handleCheck.bind(this)}
                    label='보유'
                />
                <ToggleSwitch 
                    name={WISH} 
                    on={isIn(wishNodes, item.itemId)}
                    onChange={this.handleCheck.bind(this)}
                    label='희망'
                />
            </div>
        );

    }
}

export default createFragmentContainer(Item, {
    viewer: graphql`
        fragment Item_viewer on User {
            id
            userId
            collects(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Item_collects") {
                edges {
                    node {
                        id
                        item {
                            id
                            itemId
                            idx
                        }
                        num
                    }
                }
            }
            posesses(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Item_posesses") {
                edges {
                    node {
                        id
                        item {
                            id
                            itemId
                            idx
                        }
                        num
                    }
                }
            }
            wishes(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Item_wishes") {
                edges {
                    node {
                        id
                        item {
                            id
                            itemId
                            idx
                        }
                        num
                    }
                }
            }
        }
    `,
    artist: graphql`
        fragment Item_artist on Artist {
            id
            ...ItemLink_artist
        }
    `,
    item: graphql`
        fragment Item_item on Item {
            id
            itemId
            ...ItemLink_item
        }
    `,
});