import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'
import {Box, Heading, Text, Anchor, DataTable, Image} from 'grommet';

import Goods from '../Goods';
import {getNodesFromConnection} from '../../utils';


class EventGoodsList extends Component {
    

    render() {
        const {event} = this.props;
        const {goodsList} = event;

        const nodes = getNodesFromConnection(goodsList);

        return (
            <Box>
                <DataTable
                    columns={[{
                        property: 'img',
                        header: <Text>이미지</Text>,
                        render: datum => (
                            <Box
                                height='100px'
                                width='100px'
                            >
                                <Image
                                    src={datum.img}
                                    fit='contain'
                                />
                            </Box>
                        )
                    }, {
                        property: 'name',
                        header: <Text>이름</Text>,
                        primary: true,
                    }, {
                        property: 'description',
                        header: <Text>설명</Text>,
                    }]}
                    data={nodes}
                />

            </Box>
        );
    }
}

export default createFragmentContainer(EventGoodsList, {
    event: graphql`
        fragment EventGoodsList_event on Event @argumentDefinitions(
            artistName: {type: "String"}
        ) {
            id
            eventId
            name
            goodsList(
                artistName: $artistName
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "EventGoodsList_goodsList", filters: ["artistName"]) {
                edges {
                    node {
                        id
                        name
                        img
                        description
                        ...Goods_goods
                    }
                }
            }
        }
    `,
});