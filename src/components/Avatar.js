import React, {Component} from 'react';

import { Box, Text } from 'grommet';

export default class Avatar extends Component {
    render() {
        return (
            <Box 
                direction="row" 
                align="center"
                padding={{bottom: 'small'}}
            >
                <Box
                    height="40px"
                    width="40px"
                    round="full"
                    background="dark-6"
                />
            </Box>
        );

    }
}

