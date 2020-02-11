import React from 'react';

import { Box, Text } from 'grommet';

const Avatar = (props) =>(
    <Box 
        direction="row" 
        align="center"
        gap='xsmall'
    >
        <Box
            height="40px"
            width="40px"
            round="full"
            background="dark-6"
        />
        <Text size ="small">{props.viewer.name} {props.viewer.admin && '(ADMIN)'}</Text>
    </Box>

)

export { Avatar}

