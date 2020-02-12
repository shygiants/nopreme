import React from 'react';

import { Box,Image, Text } from 'grommet';
import {Link}  from 'found';
import '../../style/goods.css'


class GoodsCard extends React.Component{

    render(){
        const {goods} = this.props;
        const curr = location.hash.slice(1);

        return (
            <Link to={curr + `/goods/${goods.goodsId}`}>
                <Box 
                    className='goods-card'
                    align='center'
                    justify='center'
                    hoverIndicator
                    pad='small'
                    background='light-1'
                >
                    <Box className='card-img'>
                        <img src={goods.img} />
                    </Box>
                    <Box className='card-text'>
                        <span className='goods-name'>
                            {goods.name}
                        </span>
                        <span className='dummy'>
                            {goods.name}
                        </span>
                    </Box>
                </Box>
            </Link>
        );
    }
}


export { GoodsCard }