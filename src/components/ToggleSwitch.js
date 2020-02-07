import React, {Component} from 'react';

export default class ToggleSwitch extends Component {
    render() {
        return (
            <label>
                <input 
                    type='checkbox' 
                    name={this.props.name}
                    checked={this.props.on} 
                    onChange={this.props.onChange} />
                {this.props.label}
            </label>
        );
    }
}