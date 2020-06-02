import React, {Component} from 'react';
import {Box, Button, Heading, Text} from 'grommet';

import ImageUploader from '../inputs/ImageUploader';

export default class ItemInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            img: props.item.img,
        };

        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleSubmitClick() {
        const {onSubmit, item} = this.props;

        onSubmit({...item, ...this.state});
    }

    render() {
        const {item: {members, idx}} = this.props;
        const {img} = this.state;

        const memberNames = members.map(member => member.name).join(',')

        return (
            <Box
                direction='column'
                pad={{vertical: 'medium'}}
                gap='medium'
                flex='grow'
            >
                <Heading level={2}>{memberNames}</Heading>
                <Text>{idx}</Text>
                <ImageUploader
                    name='img'
                    label='이미지'
                    value={img}
                    onChange={img => this.setState({img})}
                />
                <Button 
                    onClick={this.handleSubmitClick}
                    label='완료'
                />
            </Box>
        );
    }
}