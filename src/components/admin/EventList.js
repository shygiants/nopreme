import React, {Component} from 'react';
import {
    graphql, 
    createFragmentContainer,
} from 'react-relay';
import {Box, Heading, Text, Anchor, Button, DataTable, Image} from 'grommet';
import {Edit, Login} from 'grommet-icons';

import {getNodesFromConnection} from '../../utils';

class EventList extends Component {
    render() {
        const {router, onEdit} = this.props;
        const {events} = this.props.artist;

        const nodes = getNodesFromConnection(events);

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
                        header: '이름',
                        primary: true,
                    }, {
                        property: 'date',
                        header: '날짜',
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
                        render: datum => (
                            <Button icon={<Login/>} onClick={() => router.push(`/events/${datum.eventId}`)}/>
                        )
                    }]}
                    data={nodes}
                    sortable
                />
            </Box>
        );
    }
}

export default createFragmentContainer(EventList, {
    artist: graphql`
        fragment EventList_artist on Artist {
            id
            events(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "EventList_events") {
                edges {
                    node {
                        id
                        eventId
                        name
                        date
                        description
                        img
                    }
                }
            }
        }
    `,

});