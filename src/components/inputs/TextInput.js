import React, {Component} from 'react';

import {Box, Text, TextInput as GTextInput} from 'grommet';

export default class TextInput extends Component {
    render() {
        const {name, label, value, placeholder, onChange} = this.props;

        return (
            <Box
                gap='small'
            >
                <Text
                    size='small' 
                    color='brand'
                >
                    {label}
                </Text>
                <GTextInput 
                    name={name}
                    value={value}
                    focusIndicator={false}
                    size='small'
                    onChange={({currentTarget: {value}}) => onChange(value)}
                    placeholder={placeholder || `${label} 입력`}
                />
            </Box>
        );
    }
}