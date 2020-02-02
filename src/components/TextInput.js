import React, {Component} from 'react';

export default class TextInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }
    
    onChange({currentTarget: {value}}) {
        this.setState({value});
    }

    onClick() {
        // TODO: Validate text
        this.props.onSave(this.state.value);
        
        this.setState({value: ''});
    }

    render() {
        return (
            <div>
                <input 
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    placeholder={this.props.placeholder}
                />
                <button 
                    onClick={this.onClick.bind(this)}
                >
                    추가
                </button>
            </div>
        );
    }
}