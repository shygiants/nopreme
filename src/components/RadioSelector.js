import React, {Component} from 'react';
import {Box, RadioButton} from 'grommet';

export default class RadioSelector extends Component {
    render() {
        const {options, value, onChange, name} = this.props;

        return (
            <Box
                direction='row'
                justify='around'
                pad={{vertical: 'small'}}
            >
                {options.map((option, idx) => (
                    <RadioButton
                        key={name + idx}
                        name={name}
                        checked={option === value}
                        label={option}
                        onChange={({target: {checked}}) => checked ? onChange(option) : null}
                    />
                ))}
            </Box>
        );
    }
}