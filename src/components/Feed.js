import React, {
    Component
} from 'react';
import {graphql, createRefetchContainer} from 'react-relay';
import {Box, Tabs, Tab, Text} from 'grommet';

import MatchList from './MatchList';
import RequestedExchangeList from './RequestedExchangeList';
import AcceptedExchangeList from './AcceptedExchangeList';

import BadgedTab from './BadgedTab';

import AddExchangeMutation from '../mutations/AddExchangeMutation';


class Feed extends Component {
    constructor(props) {
        super(props);

        const {numRequested, numAccepted} = props.exchangeList;

        this.state = {
            activeTabIndex: 0,
            numRequested,
            numAccepted,
        }
    }

    handleExchangeRequest(match) {
        const {relay, exchangeList} = this.props;

        AddExchangeMutation.commit(
            relay.environment, 
            match, 
            exchangeList, 
            () => this._refetch.bind(this)()
        );
    }

    handleTabChange(activeIndex) {
        this.setState({activeTabIndex: activeIndex});
    }

    handleRequestedChange(numRequested) {
        this.setState({numRequested});
    }

    handleAcceptedChange(numAccepted) {
        this.setState({numAccepted});
    }

    _refetch() {
        this.props.relay.refetch(
            null,
            null,
            () => { 
                this.setState({activeTabIndex: 1})
             },
            {force: true},
        );
    }

    render() {
        const {activeTabIndex, numRequested, numAccepted} = this.state;
        const {viewer, matchList, exchangeList, router} = this.props;

        const tabStyle = {
            width: '31vw',
            direction: 'column',
            align: 'center',
        }

        return (
            <Tabs
                activeIndex={activeTabIndex}
                onActive={this.handleTabChange.bind(this)}
            >
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
                    <MatchList 
                        viewer={viewer}
                        matchList={matchList}
                        onExchangeRequest={this.handleExchangeRequest.bind(this)}
                    />
                </Tab>

                <BadgedTab
                    tabStyle={tabStyle}
                    title='보낸 신청'
                    counts={numRequested}
                >
                    <RequestedExchangeList
                        router={router}
                        exchangeList={exchangeList}
                        onChange={this.handleRequestedChange.bind(this)}
                    />
                </BadgedTab>
                
                <BadgedTab 
                    tabStyle={tabStyle}
                    title='받은 신청'
                    counts={numAccepted}
                >
                    <AcceptedExchangeList
                        router={router}
                        exchangeList={exchangeList}
                        onChange={this.handleAcceptedChange.bind(this)}
                    />
                </BadgedTab>
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
            ...MatchList_viewer
        }
    `,
    matchList: graphql`
        fragment Feed_matchList on MatchList @argumentDefinitions(
            count: {type: "Int"}
            cursor: {type: "String"}
            filterByRegion: {type: "Boolean"}
            method: {type: "MethodType"}
        ) {
            ...MatchList_matchList @arguments(count: $count, cursor: $cursor, filterByRegion: $filterByRegion, method: $method)
        }
    `,
    exchangeList: graphql`
        fragment Feed_exchangeList on ExchangeList {
            id
            numRequested
            numAccepted
            ...RequestedExchangeList_exchangeList
            ...AcceptedExchangeList_exchangeList
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