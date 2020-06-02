import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Heading, Text, Anchor, DataTable, Button, Image, Layer} from 'grommet';
import {Add} from 'grommet-icons';

import EventGoodsList from './EventGoodsList';

import AddGoodsMutation from '../../mutations/AddGoodsMutation';
import ModifyGoodsMutation from '../../mutations/ModifyGoodsMutation';
import GoodsInput from './GoodsInput';

class EventEditor extends Component {
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

    handleGoodsSave({name, description, img}) {
        const {relay, event, artist} = this.props;
        AddGoodsMutation.commit(
            relay.environment, {
                name, 
                event, 
                artist,
                description, 
                img,
            }, () => this.setState({adding: false}));
    }

    handleGoodsEditSave(goods) {
        ModifyGoodsMutation.commit(this.props.relay.environment, {
            ...goods,
            id: goods.goodsId,
            eventId: this.props.event.eventId,
        }, () => this.setState({editing: null}));
    }

    handleClose() {
        this.setState({
            editing: null,
            adding: false,
        });
    }

    handleGoodsEdit(goods) {
        this.setState({
            editing: goods,
        });
    }

    render() {
        const {adding, editing} = this.state;
        const {artist, event, router} = this.props;

        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
            >
                <Box
                    width='medium'
                    height='medium'
                >
                    <Image
                        src={event.img}
                        fit='contain'
                    />
                </Box>
                <Heading level={2}>{event.name}</Heading>
                <Text>{event.description}</Text>
                <Text>{event.date}</Text>
                
                
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
                                <GoodsInput onSubmit={this.handleGoodsEditSave.bind(this)} initialGoods={editing} />
                            ): (
                                <GoodsInput onSubmit={this.handleGoodsSave.bind(this)} />
                            )}
                            
                        </Box>
                    </Layer>
                )}
                <Button fill hoverIndicator='light-2' onClick={this.handleAdd.bind(this)}>
                    <Box flex='grow' pad="small" direction="row" align="center" gap="small">
                        <Add/>
                        <Text>새로운 굿즈 추가</Text>
                    </Box>
                </Button>
                <EventGoodsList event={event} router={router} onEdit={this.handleGoodsEdit.bind(this)}/>
            </Box>
        );
    }
}

export default createFragmentContainer(EventEditor, {
    event: graphql`
        fragment EventEditor_event on Event @argumentDefinitions(
            artistName: {type: "String"},
        ) {
            id
            eventId
            name
            img
            description
            date
            ...EventGoodsList_event @arguments(artistName: $artistName)
        }
    `,
    artist: graphql`
        fragment EventEditor_artist on Artist {
            id
            artistId
            name
        }
    `,
});