import React, {Component} from 'react';
import {Link as FoundLink}  from 'found';
import { Anchor } from 'grommet';

export default class Link extends Component {
    render() {
        const {label, to, icon, onClick, component} = this.props;

        return (
            <FoundLink 
                {...this.props}
                as={component || Anchor} 
                to={to} 
                icon={icon} 
                label={label} 
                onClick={onClick} 
            />
        );
    }
}