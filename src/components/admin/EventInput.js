import React, {Component} from 'react';
import {Box, Button} from 'grommet';

import TextInput from '../inputs/TextInput';
import DatePicker from '../inputs/DatePicker';
import ImageUploader from '../inputs/ImageUploader';

export default class EventInput extends Component {
    constructor(props) {
        super(props);

        const event = props.initialEvent || {};

        this.state = {
            name: '',
            img: '',
            description: '',
            date: '',
            ...event,
        };

        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleSubmitClick() {
        const {onSubmit} = this.props;

        onSubmit(this.state);
    }

    render() {
        const {name, description, date, img} = this.state;

        return (
            <Box
                direction='column'
                pad={{vertical: 'medium'}}
                gap='medium'
                flex='grow'
            >
                <ImageUploader
                    name='img'
                    label='이미지'
                    value={img}
                    onChange={img => this.setState({img})}
                />
                <TextInput 
                    name='name'
                    label='이름'
                    value={name}
                    onChange={name => this.setState({name})}
                />
                <TextInput 
                    name='description'
                    label='설명'
                    value={description}
                    onChange={description => this.setState({description})}
                />
                <DatePicker
                    name='date'
                    label='날짜'
                    value={date}
                    onChange={date => this.setState({date})}
                />
                <Button 
                    onClick={this.handleSubmitClick}
                    label='완료'
                />
            </Box>
            
        );

    }
}