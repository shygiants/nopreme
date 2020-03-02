import React, {
    Component
} from 'react';
import {Box, Tab, Stack, Text} from 'grommet';

export default class BadgedTab extends Component {
    render() {
        const {children, counts, tabStyle, title, ...rest} = this.props;
        return (
            <Tab 
                {...rest}
                title={(
                    <Stack anchor='right'>
                        <Box 
                            {...tabStyle}
                        >
                            <Text size='small'>
                                {title}
                            </Text>
                        </Box>
                        {counts > 0 && (
                            <Box
                                background='brand'
                                round='medium'
                                pad={{ horizontal: 'small' }}
                                margin={{ horizontal: 'xsmall' }}
                            >
                                <Text size='xsmall'>
                                    {counts}
                                </Text>
                            </Box>
                        )}
                    </Stack>
                )}
            >
                {children}
            </Tab>
        );
    }
}