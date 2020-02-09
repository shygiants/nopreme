import React, {Component} from 'react';
import {Link as FoundLink}  from 'found';
import { Anchor } from 'grommet';

export default class Link extends Component {
    render() {
        const {label, to} = this.props;

        return (
            <FoundLink style={{textDecoration: 'none'}} to={to}>
                {/* <Anchor label={label}/> */}
                {label}
            </FoundLink>
        );
    }
}