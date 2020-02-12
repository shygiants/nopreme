import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './Link';
import {GoodsCard} from './styled-components/Card'

class Goods extends Component {
    render() {
        const {goods} = this.props;
        const curr = location.hash.slice(1);

        return (
            <Link 
                component={GoodsCard} 
                goods={goods} 
                to={curr + `/goods/${goods.goodsId}`}
            />        
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