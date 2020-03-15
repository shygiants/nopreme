import React, {
    Component
} from 'react';
import {graphql, createPaginationContainer} from 'react-relay';
import {Box, Text, Button, InfiniteScroll, Heading} from 'grommet';

import MatchCard from './MatchCard';
import Link from './Link';
import CopyToClipboard from './CopyToClipboard';

import {getNodesFromConnection} from '../utils';


class MatchList extends Component {
    _loadMore() {
        if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
            return;
        }
    
        this.props.relay.loadMore(
            6,
        );
    }

    render() {
        const {viewer, matchList, onExchangeRequest, relay} = this.props;

        const matches = getNodesFromConnection(matchList.matches);

        return (
            <Box
                direction='column'
                pad='medium'
                align='center'
                gap='medium'
            >
                <InfiniteScroll scrollableAncestor={'window'} items={matches} step={6} onMore={this._loadMore.bind(this)}>
                    {(match, idx) => (
                        <Box
                            key={`match${idx}`} 
                            direction='column'
                            fill='horizontal'
                            margin={{bottom: 'medium'}}
                        >
                            <MatchCard 
                                viewer={viewer} 
                                match={match} 
                                onExchangeRequest={onExchangeRequest}
                            />                            
                        </Box>
                    )}
                </InfiniteScroll>
                {relay.hasMore() ? (
                    <Button 
                        label='더보기' 
                        onClick={this._loadMore.bind(this)}
                    />) : (
                    <Heading
                        margin='xsmall'
                        level='2'
                        color='brand'
                    >
                        <b><i>Nopreme</i></b>
                    </Heading>
                )}

                {matches.length === 0 && (
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
        );
    }
}

export default createPaginationContainer(MatchList, {
    viewer: graphql`
        fragment MatchList_viewer on User {
            id
            method
            ...MatchCard_viewer
        }
    `,
    matchList: graphql`
        fragment MatchList_matchList on MatchList @argumentDefinitions(
            count: {type: "Int", defaultValue: 6}
            cursor: {type: "String"}
            filterByRegion: {type: "Boolean", defaultValue: true}
            method: {type: "MethodType", defaultValue: "POST"}
        ) {
            matches (
                filterByRegion: $filterByRegion
                method: $method
                first: $count
                after: $cursor
            ) @connection(key: "MatchList_matches", filters: ["filterByRegion", "method"]) {
                edges {
                    node {
                        id
                        ...MatchCard_match
                    }
                }
                pageInfo{
                    endCursor
                    hasNextPage
                }
            }
        }
    `,
}, {
    direction: 'forward',
    getConnectionFromProps: props => props.matchList && props.matchList.matches,
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
        return {
            ...prevVars,
            count: totalCount,
        };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
        return {
            count,
            cursor,
            filterByRegion: fragmentVariables.filterByRegion,
            method: fragmentVariables.method,
        };
    },
    query: graphql`
        query MatchListRefetchQuery($count: Int, $cursor: String, $filterByRegion: Boolean, $method: MethodType) {
            viewer {
                ...Feed_viewer
            }
            matchList {
                ...Feed_matchList @arguments(count: $count, cursor: $cursor, filterByRegion: $filterByRegion, method: $method)
            }
            exchangeList {
                ...Feed_exchangeList
            }
        }
    `
  });