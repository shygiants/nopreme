import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Box} from 'grommet';

import MatchCard from './MatchCard';
import ExchangeLayer from './ExchangeLayer';
import AddExchangeMutation from '../mutations/AddExchangeMutation';
import {getNodesFromConnection} from '../utils';

class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            exchange: null,
        }
    }

    handleExchangeRequest(match) {
        const {relay, exchangeList} = this.props;
        AddExchangeMutation.commit(relay.environment, match, exchangeList, ((resp) => {
            const exchange = resp.addExchange.exchangeEdge.node
            this.setState({show: true, exchange});

        }).bind(this));
    }

    handleCancel() {
        this.setState({show: false});
    }

    render() {
        const {show, exchange} = this.state;
        const {viewer, matches, exchangeList} = this.props;

        const exchangeNodes = getNodesFromConnection(exchangeList.exchanges);


        function matchIsValid(match) {
            return !exchangeNodes.some(exchange => {
                return ![
                    match.wishItem.itemId !== exchange.accPosessionItem.itemId,
                    match.posessionItem.itemId !== exchange.reqPosessionItem.itemId,
                    match.user.userId !== exchange.acceptor.userId,
                ].some(b => b);
            });
        }

        const validMatches = matches.filter(matchIsValid);


        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
                align='center'
                gap='medium'
            >
                {viewer.tutorialComplete || 'TUTORIAL'}
                {show && <ExchangeLayer exchange={exchange} onCancel={this.handleCancel.bind(this)} />}
                {validMatches.map(match => (
                    <MatchCard 
                        key={match.wishItem.id+match.posessionItem.id+match.user.id} 
                        viewer={viewer} 
                        match={match} 
                        exchangeList={exchangeList}
                        onExchangeRequest={this.handleExchangeRequest.bind(this)}
                    />                            
                ))}
            </Box>
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
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "Feed_exchanges") {
                edges {
                    node {
                        id
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
                        ...ExchangeLayer_exchange
                    }
                }
            }
        }
    `,
});