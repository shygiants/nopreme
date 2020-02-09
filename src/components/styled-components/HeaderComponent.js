import React from 'react';
import { Box, Anchor, Text } from 'grommet';



const Avatar = (props) =>(
    <Box direction="row" align="center">
            <Box
            height="40px"
            width="40px"
            round="full"
            background="dark-6"
        >
        </Box>
    <Text size ="small">{props.viewer.name} {props.viewer.admin && '(ADMIN)'}</Text>
    </Box>

)

const HeaderLink = ({...rest}) =>(
    <Box 
        direction = "row" 
        gap="medium"
        {...rest}
    >
    <Anchor label="Home" href="#" />
    <Anchor label="Browse" href="/#/browse" />
    </Box>
)

export { Avatar, HeaderLink }

