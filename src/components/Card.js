import React from 'react';
import { Box,Image, Text} from 'grommet';

class GoodsCard extends React.Component{
    render(){
        const {goods, onClick} = this.props;
        return (
                <Box 
                    margin='small'
                    pad='small'
                    width='43vw'
                    align='center'
                    justify='center'
                    pad='small'
                    onClick={onClick}
                >
                    <Box className='card-img'>
                        <Image 
                            src={goods.img} 
                            fit='contain'
                            fill
                            style={{borderRadius:'10%'}}
                        />
                    </Box>
                    <Box>
                        <Text 
                            margin='small'
                            size='xsmall' 
                            truncate

                        >
                            {goods.name}
                        </Text>
                    </Box>
                </Box>
        );
    }
}


export { GoodsCard }