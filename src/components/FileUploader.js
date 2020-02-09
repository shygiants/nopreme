import React, {Component} from 'react';

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
            <div>
                <label>
                    {this.props.label}
                    <input 
                        type='file'
                        name='file'
                        accept="image/png, image/jpeg"

                        onChange={this.handleChange.bind(this)}
                    />
                </label>
                
                {this.props.publicUrl && <img src={this.props.publicUrl} />}
            </div>
        );
    }
}