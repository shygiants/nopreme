import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box} from 'grommet';
import Goods from './Goods';

class GoodsList extends Component {
    render() {
        const {goodsList, events} = this.props;
        return (
            <Box
                align='start'
                direction='row'
                wrap
                justify='evenly'
            >
                {goodsList.map((goods, idx) =>(
                    <Goods key={goods.id} goods={goods} event={events[idx]} />
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