import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Grid, TextInput} from 'grommet';
import Goods from './Goods';
import { Search } from "grommet-icons";

class GoodsList extends Component {
    render() {
        const {goodsList} = this.props;
        return (
            <Box
            align='start'
            justify='center'
            direction='row'
            wrap
            >
                {goodsList.map( (goods) =>(
                    <div key={goods.id}><Goods goods = {goods}/></div>
                ))}
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