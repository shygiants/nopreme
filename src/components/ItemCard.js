import React, {Component, createRef} from 'react';
import {Box, Image, Drop} from 'grommet';
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
    constructor(props) {
        super(props);

        this.state = {
            delPosessionBlocked: false,
            delWishBlocked: false,
        }

        // this.posessionRef = createRef();
        this.wishRef = createRef();
    }

    handleClose() {
        this.setState({
            delPosessionBlocked: false,
            delWishBlocked: false,
        });
    }

    handleCheck({name, on}) {
        const {relay, item, viewer} = this.props;

        function isIn(coll, elem) {
            const ids = coll.filter(e => e.isInExchange).map(e => e.item.itemId);
            return ids.includes(elem);
        }

        if (!on) {
            if (name === POSESSION) {
                if (isIn(getNodesFromConnection(viewer.posesses), item.itemId)) {
                    this.setState({delPosessionBlocked: true});
                    return;
                }
                    

            } else if (name === WISH) {
                if (isIn(getNodesFromConnection(viewer.wishes), item.itemId)) {
                    this.setState({delWishBlocked: true});
                    return;
                }
                    
            }
        }

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
        const {delWishBlocked, delPosessionBlocked} = this.state;
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
                    ref={this.wishRef} 
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

                {this.wishRef.current && (delWishBlocked || delPosessionBlocked) && (
                    <Drop
                        align={{ top: "bottom" }}
                        stretch={false}
                        target={this.wishRef.current}
                        onEsc={this.handleClose.bind(this)}
                        onClickOutside={this.handleClose.bind(this)}
                    >
                        <Box 
                            round='medium' 
                            pad="small" 
                            align='center' 
                            direction='row' 
                            gap='xsmall'
                        >교환 진행중!</Box>
                    </Drop>
                )}
            </Box>
        );
    }
}