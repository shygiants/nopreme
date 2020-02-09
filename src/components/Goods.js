import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import Link from './styled-components/Link';

class Goods extends Component {
    render() {
        const {goods} = this.props;

        const curr = location.hash.slice(1);

        return <Link to={curr + `/goods/${goods.goodsId}`} label={goods.name} />;
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