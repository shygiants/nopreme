import React, {Component} from 'react';
import { Box, Button, Text } from 'grommet';
import {Favorite, Transaction, Archive, Share} from 'grommet-icons'


const COLLECTION = 'collection';
const POSESSION = 'posession';
const WISH = 'wish';

export default class ToggleSwitch extends Component {
    render() {
        const {name, on, onChange} = this.props;
        const handleChange = (e) => {
            onChange({name:name, on:!on});
        }

        let icon, iconColor;
        if (on) {
            iconColor='brand'
        } else {
            iconColor='dark-2'
        }

        switch(name){
            case COLLECTION:
                icon = <Archive color={iconColor} size='medium'/>
                break;
            case POSESSION:
                //roundState={"size":"medium", "corner":"bottom-left"}
                icon = <Share color={iconColor} size='medium'/>
                break;
            case WISH:
                //roundState={"size":"medium", "corner":"bottom-right"}
                icon = <Favorite color={iconColor} size='medium'/>
                break;
            default:
                throw new Error('Invalid `name`');
        }

        return (
            <Box
                focusIndicator={false}
                onClick={handleChange}
            >
                {icon}
            </Box>
        );
    }
}