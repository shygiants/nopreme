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
                <Box
                    height='46vw'
                    width='46vw'
                    round='medium'
                    background='light-2'
                >
                    <Image 
                        src={goods.img} 
                        fit='contain'
                        fill
                        style={{borderRadius:'10%'}}
                    />
                </Box>
                
                <Box
                    direction='column'
                    align='start'
                    fill='horizontal'
                    margin={{top: 'small', bottom: 'medium'}}
                >
                    <Box
                        direction='row'
                    >
                        <Text 
                            size='xsmall' 
                            weight='bold'
                            truncate
                        >
                            {goods.name}
                        </Text>
                    </Box>
                    <Box
                        direction='row'
                    >
                        <Text 
                            size='xsmall' 
                            color='dark-3'
                            truncate
                        >
                            {event}
                        </Text>
                    </Box>
                </Box>
            </Box>
        );
    }
}
