import React, {Component} from 'react';
import {
    graphql, 
    createFragmentContainer,
} from 'react-relay';
import {Box, Heading, Text, Anchor, DataTable, Image} from 'grommet';

import {getNodesFromConnection} from '../../utils';

class EventList extends Component {
    render() {
        const {router} = this.props;
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
                        header: <Text>이름</Text>,
                        primary: true,
                    }, {
                        property: 'date',
                        header: <Text>날짜</Text>,
                    }, {
                        property: 'description',
                        header: <Text>설명</Text>,
                    }, ]}
                    data={nodes}
                    onClickRow={event => router.push(`/events/${event.datum.eventId}`)}
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