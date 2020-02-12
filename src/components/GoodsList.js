import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Grid, TextInput} from 'grommet';
import Goods from './Goods';
import { Search } from "grommet-icons";


import '../style/goodslist.css'

class GoodsList extends Component {
    render() {
        const {goodsList} = this.props;
        return (
            <Box className='goodsList'>
                <Grid rows = {['xxsmall', 'auto']}>
                    <Box className='goodsList-header'>
                        <Box className='goodsList-search' pad="small">
                            
                        </Box>
                    </Box>
                    <Box>  
                        <Box
                        className='container'
                        align='start'
                        justify='center'
                        direction='row'
                        wrap={true}
                        >
                            {goodsList.map( (goods) =>(
                                <div key={goods.id}><Goods goods = {goods}/></div>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Box>
        );

    }
}

export default createFragmentContainer(GoodsList, {
    goodsList: graphql`
        fragment GoodsList_goodsList on Goods @relay(plural: true) {
            id
            ...Goods_goods
        }
    `,
});