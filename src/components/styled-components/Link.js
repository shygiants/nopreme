import React, {Component} from 'react';
import {Link as FoundLink}  from 'found';
import { Text } from 'grommet'

export default class Link extends Component {
    render() {
        const {label, to, icon, onClick} = this.props;

        return (
            <FoundLink as={Anchor} to={to} icon={icon} label={label} onClick={onClick} />
        );
    }
}