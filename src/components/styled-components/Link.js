import React, {Component} from 'react';
import {Link as FoundLink}  from 'found';
import { Text } from 'grommet'

export default class Link extends Component {
    render() {
        const {label, to} = this.props;

        return (
            <FoundLink style={{textDecoration: 'none'}} to={to}>
                <Text 
                    color='brand'
                >{label}
                </Text>
            </FoundLink>
        );
    }
}