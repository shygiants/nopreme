import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import moment from 'moment-timezone';
require('moment/locale/ko');

import GoodsList from './GoodsList';

import {getNodesFromConnection} from '../utils';

class ArtistApp extends Component {
    render() {
        const {artist} = this.props;

        function dateStrToMilli(date) {
            return moment.tz(date, 'LL', 'Asia/Seoul').valueOf();
        }

        const nodes = getNodesFromConnection(artist.events);
        const sortedEvents = nodes.sort((a, b) => dateStrToMilli(b.date) - dateStrToMilli(a.date));

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
