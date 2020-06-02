import React, {Component} from 'react';

import {Box, Text, Image} from 'grommet';

export default class FileUploader extends Component {
    constructor(props) {
        super(props);

        this.handlePick = this.handlePick.bind(this);
    }

    handlePick(e) {
        const {onChange} = this.props;

        const imgFile = e.target.files[0];
        const formData = new FormData();

        formData.append('file', imgFile);
        fetch('/upload', {
            method: 'POST', 
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            },
        }).then(res => res.json()).then(({publicUrl}) => onChange(publicUrl)).catch(console.error);
    }

    render() {
        const {name, label, value, onChange} = this.props;

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
                <input 
                    type='file'
                    name='file'
                    accept='image/png, image/jpeg'
                    onChange={this.handlePick}
                />
                {value && (
                    <Box
                        width='medium'
                        height='medium'
                    >
                        <Image 
                            src={value} 
                            fit='contain'
                        />
                    </Box>
                )}
            </Box>
        );
    }
}