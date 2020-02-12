import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import GoodsList from './GoodsList';

import {getNodesFromConnection} from '../utils';
import { Box } from 'grommet';

class ArtistApp extends Component {
    render() {
        const {artist} = this.props;

        const nodes = getNodesFromConnection(artist.events);
        const sortedEvents = nodes.sort((a, b) => new Date(b) - new Date(a));

        const reducedGoodsList = sortedEvents.map(
            ({goodsList}) => getNodesFromConnection(goodsList)).reduce((a, b) => a.concat(b));

        return (
            <Box>
                <GoodsList goodsList={reducedGoodsList} />
            </Box>
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
