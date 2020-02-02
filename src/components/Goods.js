import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {Link} from 'found';

class Goods extends Component {
    render() {
        const {goods} = this.props;

        return <Link to={`/goods/${goods.goodsId}`}>{goods.name}</Link>;

    }
}

export default createFragmentContainer(Goods, {
    goods: graphql`
        fragment Goods_goods on Goods {
            id
            goodsId
            name
        }
    `,
});