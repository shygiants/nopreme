import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import Goods from './Goods';

class GoodsList extends Component {
    render() {
        const {goodsList} = this.props;

        goodsList

        return (
            <div>
                <ul>
                    {goodsList.map(goods => (
                        <li key={goods.id}><Goods goods={goods} /></li>
                    ))}
                </ul>
            </div>
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