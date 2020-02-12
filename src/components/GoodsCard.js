import React, {Component} from 'react';
import {Box, Image, Text} from 'grommet';

export default class GoodsCard extends Component{
    render(){
        const {goods, event, onClick} = this.props;

        return (
            <Box 
                direction='column'
                width='46vw'
                align='center'
                onClick={onClick}
                focusIndicator={false}
            >
                <Image 
                    src={goods.img} 
                    fit='contain'
                    fill
                    style={{borderRadius:'10%'}}
                />
                <Box
                    direction='column'
                    align='start'
                    margin={{vertical: 'small'}}
                    overflow='hidden'
                >
                    <Text 
                        size='xsmall' 
                        color='dark-3'
                        truncate
                    >
                        {event}
                    </Text>
                    <Text 
                        size='xsmall' 
                        weight='bold'
                        truncate
                    >
                        {goods.name}
                    </Text>
                </Box>
            </Box>
        );
    }
}