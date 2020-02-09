import React, {Component} from 'react';

import TextsInput from './TextsInput';
import FileUploader from './FileUploader';

export default class EventInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            publicUrl: null,
        };
    }
    handleTextsInputSave({name, date, description}) {
        if (this.state.publicUrl === null) {
            // Cancel
            return;
        }
        this.props.onSubmit({name, date, description, img: this.state.publicUrl});

        this.setState({publicUrl: null,});
    }

    handleImageFileSelected({publicUrl}) {
        this.setState({publicUrl});
    }

    render() {
        const texts = [{
            name: 'name',
            display: '이름',
        }, {
            name: 'date',
            display: '날짜',
        }, {
            name: 'description',
            display: '설명',
        }];

        return (
            <div>
                <TextsInput texts={texts} onSave={this.handleTextsInputSave.bind(this)} />
                <FileUploader label='이미지'onSelected={this.handleImageFileSelected.bind(this)} publicUrl={this.state.publicUrl}/>
            </div>
            
        );

    }
}