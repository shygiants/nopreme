import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './styled-components/Link';
import {Text} from 'grommet';
import {GoodsCard} from './styled-components/Card'

class Goods extends Component {
    render() {
        const {goods} = this.props;
        return (
            <GoodsCard goods = {goods}></GoodsCard>            
        );
    }
}

export default createFragmentContainer(Goods, {
    goods: graphql`
        fragment Goods_goods on Goods {
            id
            goodsId
            name
            img
        }
    `,
});