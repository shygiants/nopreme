import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Box, Image, Text} from 'grommet';

class UserItemCard extends Component {
    render() {
        const {relationType, item} = this.props;

        const member = item.members[0]

        return (
            <Box
                direction='column'
                align='center'
                width='20vw'
                focusIndicator={false}
            >
                <Box
                    direction='row'
                    justify='start'
                    fill='horizontal'
                    gap='xsmall'
                    margin={{bottom: 'small'}}
                >
                    <Text
                        size='xsmall'
                        weight='bold'
                        truncate
                    >
                        {relationType}
                    </Text>
                </Box>
                
                <Box
                    height='20vw'
                    width='20vw'
                    background='light-2'
                    round='medium'
                >
                    <Image
                        src={item.img}
                        fit='contain'
                    />
                </Box>

                <Box
                    direction='row'
                    justify='start'
                    fill='horizontal'
                    margin={{top: 'small'}}
                >
                    <Text
                        size='xsmall'
                        weight='bold'
                        truncate
                    >
                        {member.name} {item.idx}
                    </Text>
                </Box>
            </Box>
        );
    }
}

export default createFragmentContainer(UserItemCard, {
    item: graphql`
        fragment UserItemCard_item on Item {
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