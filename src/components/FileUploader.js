import React, {Component} from 'react';

import {Box, Heading, Text, Anchor, Tabs, Tab, Button, Image} from 'grommet';

export default class FileUploader extends Component {

    handleChange(e) {
        console.log(e);
        const imgFile = e.target.files[0];
        const formData = new FormData();

        formData.append('file', imgFile);
        fetch('/upload', {
            method: 'POST', 
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            },
        }).then(res => res.json()).then((({publicUrl}) => {
            this.props.onSelected({publicUrl});
        }).bind(this)).catch(console.error);
    }

    render() {
        return (
            <Box>
                <Text size='small' color='brand'>
                    {this.props.label}
                </Text>
                <input 
                    type='file'
                    name='file'
                    accept="image/png, image/jpeg"

                    onChange={this.handleChange.bind(this)}
                />
                
                {this.props.publicUrl && (
                    <Box
                        width='medium'
                        height='medium'
                    >
                        <Image 
                            src={this.props.publicUrl} 
                            fit='contain'
                        />
                    </Box>
                )}
            </Box>
        );
    }
}