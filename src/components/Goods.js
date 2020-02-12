import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './Link';
import GoodsCard from './GoodsCard'

class Goods extends Component {
    render() {
        const {goods, event} = this.props;
        const curr = location.hash.slice(1);

        return (
            <Link 
                component={GoodsCard} 
                goods={goods} 
                event={event}
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