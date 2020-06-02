import React, {Component} from 'react';
import {Box, Button} from 'grommet';

import TextInput from '../inputs/TextInput';
import ImageUploader from '../inputs/ImageUploader';

export default class GoodsInput extends Component {
    constructor(props) {
        super(props);

        const goods = props.initialGoods || {};

        this.state = {
            name: '',
            img: '',
            description: '',
            ...goods,
        };

        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleSubmitClick() {
        const {onSubmit} = this.props;

        onSubmit(this.state);
    }

    render() {
        const {name, description, img} = this.state;

        return (
            <Box
                direction='column'
                pad={{vertical: 'medium'}}
                gap='small'
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
                <Button 
                    onClick={this.handleSubmitClick}
                    label='완료'
                />
            </Box>
            
        );

    }
}