import React, {Component} from 'react';

export default class TextsInput extends Component {
    constructor(props) {
        super(props);

        const {texts} = props

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
        this.props.onSave(this.state);
        
        this.setState(this.props.texts.reduce((map, {name}) => {
            map[name] = '';
            return map;
        }, {}));
    }

    render() {
        return (
            <div>
                {this.props.texts.map(({name, display}) => (
                    <label key={name}>
                        {display}
                        <input
                            name={name}
                            value={this.state[name]}
                            onChange={this.onChange.bind(this)}
                            placeholder={`${display} 입력`}
                        />
                    </label>
                ))}
                <button 
                    onClick={this.onClick.bind(this)}
                >
                    추가
                </button>
            </div>
        );
    }
}