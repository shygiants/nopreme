import React from 'react';

import { Box, Text } from 'grommet';

import Link from './Link';

const Avatar = (props) =>(
    <Box direction='row' align='center' pad='small'>
        <Text size ='small'>{props.viewer.name} {props.viewer.admin && '(ADMIN)'}</Text>
    </Box>

)

const HeaderLink = ({...rest}) =>(
    <Box 
        direction = 'row' 
        gap='medium'
        {...rest}
    >
        <Link to='/' label='Home' />
        <Link to='/browse' label='Browse' />
    </Box>
)

export { Avatar, HeaderLink }

