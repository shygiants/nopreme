import React, {Component} from 'react';

import FileUploader from './FileUploader';

export default class ItemInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            publicUrl: null,
        }
    }

    handleImageFileSelected({publicUrl}) {
        this.setState({publicUrl});
    }

    onClick() {
        if (this.state.publicUrl === null) {
            // Cancel
            return;
        }

        this.props.onSubmit({img: this.state.publicUrl});

        this.setState({publicUrl: null,});
    }



    render() {
        return (
            <div>
                <FileUploader label='이미지' onSelected={this.handleImageFileSelected.bind(this)} publicUrl={this.state.publicUrl} />
                <button 
                    onClick={this.onClick.bind(this)}
                >
                    추가
                </button>
            </div>
        );
    }
}