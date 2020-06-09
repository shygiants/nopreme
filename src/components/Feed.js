import React, {
    Component
} from 'react';
import {graphql, createRefetchContainer} from 'react-relay';
import {Box, Tabs, Tab, Text, CheckBox, DropButton, RadioButtonGroup} from 'grommet';
import {Filter} from 'grommet-icons';

import MatchList from './MatchList';
import RequestedExchangeList from './RequestedExchangeList';
import AcceptedExchangeList from './AcceptedExchangeList';

import BadgedTab from './BadgedTab';

import AddExchangeMutation from '../mutations/AddExchangeMutation';

const methods = {
    DIRECT: '직거래',
    POST: '준등기',
    DONTCARE: '상관 없음',
};

class Feed extends Component {
    constructor(props) {
        super(props);

        const {numRequested, numAccepted} = props.exchangeList;

        this.state = {
            filterByRegion: true,
            method: methods['DONTCARE'],
            open: false,
            activeTabIndex: 0,
            numRequested,
            numAccepted,
        };
    }

    handleExchangeRequest(match) {
        const {relay, exchangeList} = this.props;
        const {filterByRegion, method} = this.state;

        AddExchangeMutation.commit(
            relay.environment, 
            match, 
            exchangeList, 
            () => {
                const vars = {
                    filterByRegion,
                    method: this.getMethodKey(method),
                    count: 6,
                };

                relay.refetch(
                    vars, null, () => this.setState({activeTabIndex: 1}), {force: true}
                )
                
            }
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

    handleFilterChange({target: {checked}}) {
        const {relay} = this.props;
        const {method} = this.state;

        const vars = {
            method: this.getMethodKey(method),
            filterByRegion: checked,
            count: 6,
        };

        relay.refetch(
            vars,
            null,
            () => {
                this.setState({
                    filterByRegion: checked
                });
            },
            {force: true},
        );
    }

    handleMethodChange({target: {value}}) {
        const {relay} = this.props;
        const {filterByRegion} = this.state;

        const method = this.getMethodKey(value);

        const vars = {
            filterByRegion,
            method,
            count: 6,
        };

        relay.refetch(
            vars,
            null,
            () => {
                this.setState({
                    method: value,
                    open: false,
                });
            },
            {force: true},
        );
    }

    getMethodKey(method) {
        return Object.keys(methods).find(k => methods[k] === method);
    }

    render() {
        const {activeTabIndex, numRequested, numAccepted, filterByRegion, method, open} = this.state;
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
                    <Box
                        fill='horizontal'
                        direction='row'
                        justify='end'
                        gap='medium'
                        pad={{vertical: 'small', horizontal: 'medium'}}
                    >
                        <DropButton
                            plain
                            open={open}
                            focusIndicator={false}
                            onOpen={() => this.setState({open: true})}
                            onClose={() => this.setState({open: false})}
                            icon={<Filter />}
                            label={method}
                            dropContent={(
                                <Box
                                    pad='small'
                                >
                                <RadioButtonGroup 
                                    name='method'
                                    options={['직거래', '준등기', '상관 없음']}
                                    value={method}
                                    onChange={this.handleMethodChange.bind(this)}
                                />
                                </Box>
                            )}
                        />
                        <CheckBox
                            checked={filterByRegion}
                            label='같은 지역만'
                            onChange={this.handleFilterChange.bind(this)}
                        />
                    </Box>
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
            id
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
    query FeedRefetchQuery($count: Int, $cursor: String, $filterByRegion: Boolean, $method: MethodType) {
        viewer {
            ...Feed_viewer
        }
        matchList {
            ...Feed_matchList @arguments(filterByRegion: $filterByRegion, method: $method, count: $count, cursor: $cursor)
        }
        exchangeList {
            ...Feed_exchangeList
        }
    }
`);