import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Box, Tabs, Tab, Stack, Text} from 'grommet';

import MatchCard from './MatchCard';
import AddExchangeMutation from '../mutations/AddExchangeMutation';
import {getNodesFromConnection} from '../utils';
import RemoveExchangeMutation from '../mutations/RemoveExchangeMutation';

class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addedExchanges: [],
        }
    }

    handleExchangeRequest(match) {
        const {relay, exchangeList} = this.props;
        AddExchangeMutation.commit(relay.environment, match, exchangeList, ((resp) => {
            const exchange = resp.addExchange.exchangeEdge.node
            
            this.setState(({addedExchanges}) => ({
                addedExchanges: addedExchanges.concat([exchange]),
            }));
        }).bind(this));
    }

    handleExchangeCancel(exchange) {
        const {relay, exchangeList} = this.props;
        RemoveExchangeMutation.commit(relay.environment, exchange, exchangeList);
    }

    render() {
        const {addedExchanges} = this.state;
        const {viewer, matches, exchangeList} = this.props;

        const exchangeNodes = getNodesFromConnection(exchangeList.exchanges);

        function compareMatchExchange(match, exc) {
            return ![
                match.wishItem.itemId !== exc.accPosessionItem.itemId,
                match.posessionItem.itemId !== exc.reqPosessionItem.itemId,
                match.user.userId !== exc.acceptor.userId,
            ].some(b => b);
        }

        function matchIsValid(match) {
            return (!exchangeNodes.some(node => {
                return compareMatchExchange(match, node);
            })) || addedExchanges.some(exc => compareMatchExchange(match, exc));
        }

        function matchToExchange(match) {
            const exchange = addedExchanges.find(exc => compareMatchExchange(match, exc));
            return exchange === undefined? null : exchange;
        }

        const validMatches = matches.filter(matchIsValid);

        const tabStyle = {
            width: '31vw',
            direction: 'column',
            align: 'center',
        }

        const tab2 = (
            <Stack anchor='right'>
                <Box 
                    {...tabStyle}
                >
                    <Text size='small'>
                        보낸 신청
                    </Text>
                </Box>
                <Box
                    background='brand'
                    round='medium'
                    pad={{ horizontal: 'small' }}
                    margin={{ horizontal: 'xsmall' }}
                >
                <Text size='xsmall'>{exchangeNodes.length}</Text>
                </Box>
            </Stack>
        );

        return (
            <Tabs>
                <Tab 
                    title={(
                        <Box 
                            {...tabStyle}
                        >
                            <Text size='small'>
                                매칭
                            </Text>
                        </Box>
                    )}
                >
                    <Box
                        direction='column'
                        pad={{horizontal: 'medium'}}
                        align='center'
                        gap='medium'
                    >
                        {validMatches.map(match => (
                            <MatchCard 
                                key={match.wishItem.id+match.posessionItem.id+match.user.id} 
                                viewer={viewer} 
                                match={match} 
                                exchange={matchToExchange(match)}
                                onExchangeRequest={this.handleExchangeRequest.bind(this)}
                                onExchangeCancel={this.handleExchangeCancel.bind(this)}
                            />                            
                        ))}
                    </Box>
                </Tab>
                <Tab 
                    title={tab2}
                >
                    <Box
                        direction='column'
                        pad={{horizontal: 'medium'}}
                        align='center'
                        gap='medium'
                    >
                        {exchangeNodes.map(exchange => (
                            <MatchCard 
                                key={exchange.id} 
                                viewer={viewer} 
                                exchange={exchange}
                                match={null}
                                onExchangeRequest={this.handleExchangeRequest.bind(this)}
                                onExchangeCancel={this.handleExchangeCancel.bind(this)}
                            />                            
                        ))}
                    </Box>
                </Tab>
                <Tab 
                    title={(
                        <Box 
                            {...tabStyle}
                        >
                            <Text size='small'>
                                받은 신청
                            </Text>
                        </Box>
                    )}
                ></Tab>
            </Tabs>
            
        );
    }
}

export default createFragmentContainer(Feed, {
    viewer: graphql`
        fragment Feed_viewer on User {
            id
            name
            ...MatchCard_viewer
        }
    `,
    matches: graphql`
        fragment Feed_matches on Match @relay(plural: true) {
            wishItem {
                id
                itemId
            }
            posessionItem {
                id
                itemId
            }
            user {
                id
                userId
            }
            ...MatchCard_match
        }
    `,
    exchangeList: graphql`
        fragment Feed_exchangeList on ExchangeList {
            id
            exchanges(
                # TODO: Pagination
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Feed_exchanges") {
                edges {
                    node {
                        id
                        exchangeId
                        acceptor {
                            id
                            userId
                        }
                        reqPosessionItem {
                            id
                            itemId
                        }
                        accPosessionItem {
                            id
                            itemId
                        }
                        ...MatchCard_exchange
                    }
                }
            }
        }
    `,
});