import React, {Component} from 'react';
import {Box, Text, Button, Menu, Stack} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import {Transaction, Flag, More, Location, Clock} from 'grommet-icons';

import MatchItem from './MatchItem';
import BlockUserMutation from '../mutations/BlockUserMutation';

const methods = {
    DIRECT: '직거래',
    POST: '준등기',
    DONTCARE: '상관 없음',
}

class MatchCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blocked: false,
        };
    }
    handleReport() {
        // TODO: Report
    }

    handleBlock() {
        const {relay, match} = this.props;
        
        BlockUserMutation.commit(
            relay.environment, 
            match.user,
            () => this.setState({blocked: true}));
    }

    render() {
        const {viewer, match, onExchangeRequest} = this.props;
        const {blocked} = this.state;

        const {wishItem, posessionItem, user} = match;

        const reqPosessionItem = posessionItem;
        const requestor = viewer;
        const accPosessionItem = wishItem;
        const acceptor = user;

        if (blocked)
            return (
                <Box
                    pad='large'
                    direction='column'
                    align='center'
                >
                    <Text>숨긴 매칭</Text>
                </Box>

            );
        
        return (
            <Stack 
                anchor="top-right"
                fill
            >
                <Box
                    direction='column'
                    round='medium'
                    background='#FFFFFF'
                    align='center'
                    pad='medium'
                    gap='small'
                >
                    <Box 
                        direction='row'
                        align='center'
                        gap='xsmall'
                    >
                        <Location size='small' />
                        <Text 
                            size='xsmall' 
                            color='dark-3'
                            truncate
                        >
                            {user.regions.length === 0 ? '전체 지역' : user.regions[0].displayName}
                        </Text>
                        <Transaction size='small' />
                        <Text 
                            size='xsmall' 
                            color='dark-3'
                            truncate
                        >
                            {methods[user.method]}
                        </Text>
                    </Box>

                    <Box
                        direction='row'
                        align='center'
                        justify='between'
                        fill='horizontal'
                        margin={{bottom: 'small'}}
                    >
                        <MatchItem user={requestor} item={reqPosessionItem} />
                        
                        <Transaction />

                        <MatchItem user={acceptor} item={accPosessionItem} />
                    </Box>

                    <Button
                        fill='horizontal'
                        label='교환 신청'
                        onClick={() => onExchangeRequest(match)}
                    />
                    
                </Box>  

                <Menu
                    dropAlign={{right: 'right', top: 'bottom'}}
                    size='small'
                    label={<Box pad='xsmall'><More size='18px'/></Box>}
                    icon={false}
                    items={[{
                        label: '하루 동안 이 사용자 보지 않기',
                        onClick: this.handleBlock.bind(this),
                        icon: (
                            <Box pad='small' align='center'><Clock size='small'/></Box>
                        )
                    }, {
                        label: '신고하기', 
                        onClick: this.handleReport.bind(this), 
                        icon: (
                            <Box pad='small' align='center'><Flag size='small'/></Box>
                        )
                    }]}
                />
            </Stack>
        );
    }
}

export default createFragmentContainer(MatchCard, {
    viewer: graphql`
        fragment MatchCard_viewer on User {
            id
            userId
            regions {
                id
                regionId
                stateCode
                stateName
                cityCode
                cityName
                parentCityCode
                parentCityName
                displayName
            }
            ...MatchItem_user
        }
    `,
    match: graphql`
        fragment MatchCard_match on Match {
            wishItem {
                id
                itemId
                ...MatchItem_item
            }
            posessionItem {
                id
                itemId
                ...MatchItem_item
            }
            user {
                id
                userId
                regions {
                    id
                    regionId
                    stateCode
                    stateName
                    cityCode
                    cityName
                    parentCityCode
                    parentCityName
                    displayName
                }
                method
                ...MatchItem_user
            }
        }
    `,
})
