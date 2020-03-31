import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import GoodsList from './GoodsList';

import {getNodesFromConnection} from '../utils';

class ArtistApp extends Component {
    render() {
        const {artist} = this.props;

        const nodes = getNodesFromConnection(artist.events);
        const sortedEvents = nodes.sort((a, b) => new Date(b.date) - new Date(a.date));

        const reducedGoodsList = sortedEvents.map(
            ({name, goodsList}) => getNodesFromConnection(goodsList).map(goods => ({...goods, eventName: name}))
        ).reduce((a, b) => a.concat(b));

        const eventNames = reducedGoodsList.map(({eventName}) => eventName);

        return (
            <GoodsList goodsList={reducedGoodsList} events={eventNames} />
        );
    }
}

export default createFragmentContainer(ArtistApp, {
    artist: graphql`
        fragment ArtistApp_artist on Artist @argumentDefinitions(
            artistName: {type: "String"}
        ) {
            id
            artistId
            name
            members {
                id
                memberId
                name
            }
            events(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "ArtistApp_events") {
                edges {
                    node {
                        id
                        name
                        date
                        goodsList(
                            artistName: $artistName
                            first: 2147483647 # max GraphQLInt
                        ) @connection(key: "ArtistApp_goodsList", filters: ["artistName"]) {
                            edges {
                                node {
                                    id
                                    ...GoodsList_goodsList
                                }
                            }
                        }
                    }
                }
            }
        }
    `,
});
