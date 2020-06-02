import React, {Component} from 'react';
import {graphql, createFragmentContainer} from 'react-relay'
import {Box, Heading, Text, Anchor, Button, DataTable, Image} from 'grommet';
import {Edit, Login} from 'grommet-icons';

import {getNodesFromConnection} from '../../utils';


class EventGoodsList extends Component {
    

    render() {
        const {event, router, onEdit} = this.props;
        const {goodsList} = event;

        const nodes = getNodesFromConnection(goodsList);

        return (
            <Box>
                <DataTable
                    columns={[{
                        property: 'img',
                        header: '이미지',
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
                        header: '이름',
                        primary: true,
                    }, {
                        property: 'description',
                        header: '설명',
                    }, {
                        property: 'edit',
                        render: datum => (
                            <Button icon={<Edit/>} onClick={() => onEdit(datum)}/>
                        )
                    }, {
                        property: 'go',
                        render: ({goodsId}) => (
                            <Button icon={<Login/>} onClick={() => router.push(`/events/${event.eventId}/goods/${goodsId}`)}/>
                        )
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
                        goodsId
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