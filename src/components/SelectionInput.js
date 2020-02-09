import React, {Component} from 'react';

export default class SelectionInput extends Component {
    constructor(props) {
        super(props);

        const {options} = props;

        this.state = options.reduce((map, option) => {
            map[option] = false;
            return map;
        }, {});

        this.state.all = false;
    }

    handleInputChange(event) {
        const target = event.target;
        const checked = target.checked;
        const name = target.name;

        if (name === 'all' && !checked) {
            this.setState(Object.keys(this.state).reduce((map, option) => {
                map[option] = false;
                return map;
            }, {}));

            return;
        }
    
        this.setState({
          [name]: checked
        });
      }

    render() {
        return (
            <div>
                <label>
                    <input type='checkbox' name='all' checked={this.state.all} onChange={this.handleInputChange.bind(this)} />
                    전체
                </label>
                {Object.entries(this.state).map(([option, checked]) => (
                    option !== 'all' &&
                    <label>
                        <input type='checkbox' name={option} checked={this.state.all || checked} onChange={this.handleInputChange.bind(this)} />
                        {option}
                    </label>
                ))}
            </div>
        );
    }
}