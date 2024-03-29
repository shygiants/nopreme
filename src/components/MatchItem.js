import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Box, Image, Text} from 'grommet';

class MatchItem extends Component {
    render() {
        const {user, item} = this.props;

        const member = item.members[0]

        return (
            <Box
                direction='column'
                align='center'
                width='35vw'
                focusIndicator={false}
                gap='small'
            >
                <Box
                    direction='row'
                    justify='start'
                    fill='horizontal'
                    gap='xsmall'
                >
                    <Text
                        size='xsmall'
                        weight='bold'
                        truncate
                    >
                        {user.name}
                    </Text>
                    <Text
                        size='xsmall'
                        truncate
                    >
                        보유
                    </Text>
                </Box>
                
                <Box
                    height='35vw'
                    width='35vw'
                    background='light-2'
                    round='medium'
                >
                    <Image
                        src={item.img}
                        fit='contain'
                    />
                </Box>

                <Box
                    direction='column'
                    fill='horizontal'
                >
                    <Box
                        direction='row'
                        justify='start'
                        fill='horizontal'
                    >
                        <Text
                            size='xsmall'
                            weight='bold'
                            truncate
                        >
                            {member.name} {item.idx}
                        </Text>
                    </Box>
                    <Box 
                        direction='row'
                        justify='start'
                        fill='horizontal'
                    >
                        <Text 
                            size='xsmall' 
                            color='dark-3'
                            truncate
                        >
                            {item.goods.name}
                        </Text>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default createFragmentContainer(MatchItem, {
    user: graphql`
        fragment MatchItem_user on User {
            id
            name
        }
    `,
    item: graphql`
        fragment MatchItem_item on Item {
            id
            idx
            img
            members {
                id
                name
            }
            goods {
                id
                name
            }
        }
    `,
})