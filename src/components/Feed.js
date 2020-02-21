import React, {
    Component
} from 'react';
import {graphql, createRefetchContainer} from 'react-relay';
import {Box, Tabs, Tab, Stack, Text} from 'grommet';

import MatchCard from './MatchCard';
import AddExchangeMutation from '../mutations/AddExchangeMutation';
import {getNodesFromConnection} from '../utils';
import RemoveExchangeMutation from '../mutations/RemoveExchangeMutation';
import RejectExchangeMutation from '../mutations/RejectExchangeMutation';
import ResolveExchangeMutation from '../mutations/ResolveExchangeMutation';
import Link from './Link';
import CopyToClipboard from './CopyToClipboard';

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

            this._refetch();
        }).bind(this));
    }

    handleExchangeCancel(exchange) {
        const {relay, exchangeList} = this.props;
        RemoveExchangeMutation.commit(relay.environment, exchange, exchangeList);

        this.setState(({addedExchanges}) => {
            const idx = addedExchanges.map(exchange => exchange.exchangeId).indexOf(exchange.exchangeId)

            addedExchanges.splice(idx, 1);

            return {addedExchanges};
        });
    }

    handleExchangeReject(exchange) {
        const {relay, exchangeList} = this.props;
        RejectExchangeMutation.commit(relay.environment, exchange, exchangeList);
    }

    handleExchangeApproval(exchange) {
        const {relay, exchangeList} = this.props;
        ResolveExchangeMutation.commit(relay.environment, exchange, exchangeList);
    }

    _refetch() {
        this.props.relay.refetch(
            null,
            null,
            () => { console.log('Refetch done') },
            {force: true},
        );
    }

    render() {
        const {addedExchanges} = this.state;
        const {viewer, matchList, exchangeList, router} = this.props;

        const matches = getNodesFromConnection(matchList.matches);

        const exchangeNodes = getNodesFromConnection(exchangeList.exchanges);
        const requested = exchangeNodes.filter(exchange => exchange.requestor.userId === viewer.userId);
        const accepted = exchangeNodes.filter(exchange => exchange.acceptor.userId === viewer.userId);
        const rejected = requested.filter(exchange => exchange.status === 'REJECTED');

        function compareMatchExchange(match, exc) {
            switch (match.user.userId) {
                case exc.acceptor.userId:
                    return ![
                        match.wishItem.itemId !== exc.accPosessionItem.itemId,
                        match.posessionItem.itemId !== exc.reqPosessionItem.itemId,
                    ].some(b => b);
                case exc.requestor.userId:
                    return ![
                        match.wishItem.itemId !== exc.reqPosessionItem.itemId,
                        match.posessionItem.itemId !== exc.accPosessionItem.itemId,
                    ].some(b => b);
                default:
                    return false;
            }
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
                {requested.length > 0 && <Box
                    background='brand'
                    round='medium'
                    pad={{ horizontal: 'small' }}
                    margin={{ horizontal: 'xsmall' }}
                >
                <Text size='xsmall'>{requested.length}</Text>
                </Box>}
            </Stack>
        );

        const tab3 = (
            <Stack anchor='right'>
                <Box 
                    {...tabStyle}
                >
                    <Text size='small'>
                        받은 신청
                    </Text>
                </Box>
                {accepted.length > 0 && <Box
                    background='brand'
                    round='medium'
                    pad={{ horizontal: 'small' }}
                    margin={{ horizontal: 'xsmall' }}
                >
                <Text size='xsmall'>{accepted.length}</Text>
                </Box>}
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
                                router={router}
                                viewer={viewer} 
                                match={match} 
                                exchange={matchToExchange(match)}
                                onExchangeRequest={this.handleExchangeRequest.bind(this)}
                                onExchangeCancel={this.handleExchangeCancel.bind(this)}
                                onExchangeReject={this.handleExchangeReject.bind(this)}
                                onExchangeApproval={this.handleExchangeApproval.bind(this)}
                            />                            
                        ))}
                        {validMatches.length === 0 && (
                            <Box
                                margin='large'
                                direction='column'
                                gap='small'
                            >
                                <Text>조건에 맞는 매칭이 없습니다</Text>
                                <Text><Link to='/browse' label='이 곳' />에서 굿즈 수집/보유/희망 현황을 더 입력해주세요.</Text>
                                <Text>더 많은 팬들이 <i><b>Nopreme</b></i>을 알 수 있게 아래의 링크를 복사해서 공유해주세요.</Text>
                                <CopyToClipboard value={`http://${process.env.PUBLIC_URL}`} />
                            </Box>
                        )}
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
                        {requested.map(exchange => (
                            <MatchCard 
                                key={exchange.id} 
                                router={router}
                                viewer={viewer} 
                                exchange={exchange}
                                match={null}
                                onExchangeRequest={this.handleExchangeRequest.bind(this)}
                                onExchangeCancel={this.handleExchangeCancel.bind(this)}
                                onExchangeReject={this.handleExchangeReject.bind(this)}
                                onExchangeApproval={this.handleExchangeApproval.bind(this)}
                            />                            
                        ))}
                        {requested.length === 0 && (
                            <Box
                                margin='large'
                            >
                                <Text>보낸 교환 신청이 없습니다</Text>
                            </Box>
                        )}
                    </Box>
                </Tab>
                <Tab 
                    title={tab3}
                >
                    <Box
                        direction='column'
                        pad={{horizontal: 'medium'}}
                        align='center'
                        gap='medium'
                    >
                        {accepted.map(exchange => (
                            <MatchCard 
                                key={exchange.id} 
                                router={router}
                                viewer={viewer} 
                                exchange={exchange}
                                match={null}
                                onExchangeRequest={this.handleExchangeRequest.bind(this)}
                                onExchangeCancel={this.handleExchangeCancel.bind(this)}
                                onExchangeReject={this.handleExchangeReject.bind(this)}
                                onExchangeApproval={this.handleExchangeApproval.bind(this)}
                            />                            
                        ))}
                        {accepted.length === 0 && (
                            <Box
                                margin='large'
                            >
                                <Text>받은 교환 신청이 없습니다</Text>
                            </Box>
                        )}
                    </Box>
                </Tab>
            </Tabs>
            
        );
    }
}

export default createRefetchContainer(Feed, {
    viewer: graphql`
        fragment Feed_viewer on User {
            id
            userId
            name
            ...MatchCard_viewer
        }
    `,
    matchList: graphql`
        fragment Feed_matchList on MatchList {
            matches (
                # first: 2147483647 # max GraphQLInt
                first: 6 # max GraphQLInt
            ) @connection(key: "Feed_matches") {
                edges {
                    node {
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
                }
            }
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
                        requestor {
                            id
                            userId
                        }
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
                        status
                        ...MatchCard_exchange
                    }
                }
            }
        }
    `,
}, graphql`
    query FeedRefetchQuery {
        viewer {
            ...Feed_viewer
        }
        matchList {
            ...Feed_matchList
        }
        exchangeList {
            ...Feed_exchangeList
        }
    }
`);