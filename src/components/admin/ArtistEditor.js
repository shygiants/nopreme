import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventList from './EventList';
import EventInput from './EventInput';

import {Box, Heading, Text, Anchor, Tabs, Tab, Button} from 'grommet';
import {Add} from 'grommet-icons';
import AddEventMutation from '../../mutations/AddEventMutation';

class ArtistEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adding: false,
        };
    }

    handleAdd() {
        this.setState({
            adding: true,
        });
    }


    handleEventSave({name, date, description, img}) {
        AddEventMutation.commit(this.props.relay.environment, {
            name, 
            date, 
            description,
            img,
            artist: this.props.artist,
        }, () => {
            this.setState({
                adding: false,
            });
        });
    }

    render() {
        const {adding} = this.state;
        const {artist, router} = this.props;

        function tabTitle(title) {
            return (
                <Box
                    width='small'
                    direction='column'
                    align='center'
                >
                    <Text size='small'>
                        {title}
                    </Text>
                </Box>
            );
        }

        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
            >
                <Heading>{artist.name}</Heading>
                <Tabs
                    justify='start'
                    fill='horizontal'
                >
                    <Tab title={tabTitle('이벤트')}>
                        <EventList artist={artist} router={router}/>
                        {adding? (
                            <EventInput onSubmit={this.handleEventSave.bind(this)} />
                        ) : (
                            <Button fill hoverIndicator='light-2' onClick={this.handleAdd.bind(this)}>
                                <Box flex='grow' pad="small" direction="row" align="center" gap="small">
                                    <Add/>
                                    <Text>새로운 이벤트 추가</Text>
                                </Box>
                            </Button>
                        )}
                    </Tab>
                    <Tab title={tabTitle('멤버')}>
                        <ul>
                            {artist.members.map(member => (
                                <li key={member.memberId}>{member.name}</li>
                            ))}
                        </ul>
                    </Tab>
                    
                </Tabs>
            </Box>
        );
    }
}

export default createFragmentContainer(ArtistEditor, {
    artist: graphql`
        fragment ArtistEditor_artist on Artist {
            id
            artistId
            name
            members {
                id
                memberId
                name
            }
            ...EventList_artist
        }
    `,
});
