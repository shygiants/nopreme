import React, {Component} from 'react';
import {Box, Image, Text, Button} from 'grommet';
import ToggleSwitch from './ToggleSwitch';

import AddCollectionMutation from '../mutations/AddCollectionMutation';
import AddPosessionMutation from '../mutations/AddPosessionMutation';
import AddWishMutation from '../mutations/AddWishMutation';
import RemoveCollectionMutation from '../mutations/RemoveCollectionMutation';
import {getNodesFromConnection} from '../utils';
import RemovePosessionMutation from '../mutations/RemovePosessionMutation';
import RemoveWishMutation from '../mutations/RemoveWishMutation';

const COLLECTION = 'collection';
const POSESSION = 'posession';
const WISH = 'wish';

export default class ItemCard extends Component{
    handleCheck({name, on}) {
        const {relay, item, viewer} = this.props;

        let mutation;
        switch (name) {
            case COLLECTION:
                mutation = on ? AddCollectionMutation : RemoveCollectionMutation;
                mutation.commit(relay.environment, item, viewer);
                break;
            case POSESSION:
                mutation = on ? AddPosessionMutation : RemovePosessionMutation;
                mutation.commit(relay.environment, item, viewer);
                break;
            case WISH:
                mutation = on ? AddWishMutation : RemoveWishMutation;
                mutation.commit(relay.environment, item, viewer);
                break;
            default:
                throw new Error('Invalid `name`');
        }
    }
    
    render(){
        const {viewer, artist, item, onClick} = this.props;
        const {collects, posesses, wishes} = viewer;

        const collectionNodes = getNodesFromConnection(collects);
        const posessionNodes = getNodesFromConnection(posesses);
        const wishNodes = getNodesFromConnection(wishes);

        function isIn(coll, elem) {
            const ids = coll.map(e => e.item.itemId);
            return ids.includes(elem);
        }

        return (
            <Box 
                direction='column'
                align='center'
                focusIndicator={false}
                background='#FFFFFF'
                pad='small'
                gap='small'
                round='medium'
                margin={{vertical: 'xsmall'}}
            >
                <Box
                    height='40vw'
                    width='40vw'
                    round='medium'
                    onClick={onClick}
                    background='light-2'
                >
                    <Image 
                        src={item.img} 
                        fit='contain'
                        fill
                        style={{borderRadius:'10%'}}
                    />
                </Box>
                <Box
                    direction='row'
                    justify='around'
                    align='start'
                    fill='horizontal'
                >
                    <ToggleSwitch 
                        name={POSESSION} 
                        on={isIn(posessionNodes, item.itemId)}
                        onChange={this.handleCheck.bind(this)}
                    />
                    <ToggleSwitch 
                        name={WISH} 
                        on={isIn(wishNodes, item.itemId)}
                        onChange={this.handleCheck.bind(this)}
                    />
                </Box>
            </Box>
        );
    }
}