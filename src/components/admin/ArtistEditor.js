import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import EventList from './EventList';
import EventInput from './EventInput';

import {Box, Heading, Text, Anchor, Tabs, Tab, Button, Layer} from 'grommet';
import {Add} from 'grommet-icons';
import AddEventMutation from '../../mutations/AddEventMutation';
import ModifyEventMutation from '../../mutations/ModifyEventMutation';

class ArtistEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adding: false,
            editing: null,
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
        }, () => this.setState({adding: false}));
    }

    handleEventEdit(event) {
        this.setState({
            editing: event,
        });
    }

    handleEventEditSave(event) {
        ModifyEventMutation.commit(this.props.relay.environment, {
            ...event,
            id: event.eventId,
            artistId: this.props.artist.artistId,
        }, () => this.setState({editing: null}));
    }

    handleClose() {
        this.setState({
            editing: null,
            adding: false,
        });
    }

    render() {
        const {adding, editing} = this.state;
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
                        {(adding || editing) && (
                            <Layer 
                                margin='large'
                                responsive={false}
                                position='center' 
                                modal 
                                full
                                onClickOutside={this.handleClose.bind(this)} 
                                onEsc={this.handleClose.bind(this)}
                            >
                                <Box
                                    margin='medium'
                                    overflow='auto'
                                >
                                    {editing ? (
                                        <EventInput onSubmit={this.handleEventEditSave.bind(this)} initialEvent={editing}/>
                                    ) : (
                                        <EventInput onSubmit={this.handleEventSave.bind(this)} />
                                    )}
                                </Box>
                            </Layer>
                        )}
                        <Button fill hoverIndicator='light-2' onClick={this.handleAdd.bind(this)}>
                            <Box flex='grow' pad="small" direction="row" align="center" gap="small">
                                <Add/>
                                <Text>새로운 이벤트 추가</Text>
                            </Box>
                        </Button>
                        <EventList artist={artist} router={router} onEdit={this.handleEventEdit.bind(this)}/>
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
