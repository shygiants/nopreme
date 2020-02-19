import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './Link';
import ItemCard from './ItemCard';

const COLLECTION = 'collection';
const POSESSION = 'posession';
const WISH = 'wish';

class Item extends Component {
    render() {
        const {viewer, artist, item, relay} = this.props;
        const curr = location.hash.slice(1);

        return (
            <Link 
                component={ItemCard}
                artist={artist}
                item={item}
                viewer={viewer}
                relay={relay}
                to={curr + `/items/${item.itemId}`}
            />
        );
    }
}

export default createFragmentContainer(Item, {
    viewer: graphql`
        fragment Item_viewer on User @argumentDefinitions(
            goodsId: {type: "ID"}
        ) {
            id
            userId
            collects(
                goodsId: $goodsId
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Item_collects", filters: ["goodsId"]) {
                edges {
                    node {
                        id
                        item {
                            id
                            itemId
                            idx
                        }
                        num
                        isInExchange
                    }
                }
            }
            posesses(
                goodsId: $goodsId
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Item_posesses", filters: ["goodsId"]) {
                edges {
                    node {
                        id
                        item {
                            id
                            itemId
                            idx
                        }
                        num
                        isInExchange
                    }
                }
            }
            wishes(
                goodsId: $goodsId
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Item_wishes", filters: ["goodsId"]) {
                edges {
                    node {
                        id
                        item {
                            id
                            itemId
                            idx
                        }
                        num
                        isInExchange
                    }
                }
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
            img
            members {
                id
                name
            }
            goods {
                id
                goodsId
            }
        }
    `,
});