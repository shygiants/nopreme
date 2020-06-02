import React, {Component} from 'react';

import {Box, Heading, Text, Anchor, Tabs, Tab, Button, TextInput} from 'grommet';

export default class TextsInput extends Component {
    constructor(props) {
        super(props);

        const {texts} = props;

        this.state = texts.reduce((map, {name, initialValue}) => {
            map[name] = initialValue || '';
            return map;
        }, {})
    }
    
    onChange({currentTarget: {name, value}}) {
        this.setState({[name]: value});
    }

    onClick() {
        // TODO: Validate text
        const {onSave, resetOnSave} = this.props;
        onSave(this.state);
        
        if (resetOnSave) {
            this.setState(this.props.texts.reduce((map, {name}) => {
                map[name] = '';
                return map;
            }, {}));
        }
    }

    render() {
        return (
            <Box
                direction='column'
                gap='small'
            >
                {this.props.texts.map(({name, display}) => (
                    <Box
                        key={name}
                    >
                        <Text size='small' color='brand'>{display}</Text>
                        <TextInput
                            name={name}
                            value={this.state[name]}
                            focusIndicator={false}
                            size='small'
                            onChange={this.onChange.bind(this)}
                            placeholder={`${display} 입력`}
                        />
                    </Box>
                ))}
                <Button 
                    onClick={this.onClick.bind(this)}
                    label='추가'
                />
            </Box>
        );
    }
}