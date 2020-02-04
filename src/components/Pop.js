import React, {
    Component
} from 'react';

export default class Pop extends Component {
    onClick() {
        const {router} = this.props;
        router.go(-1);
    }

    render() {
        return (
            <div>
                <button onClick={this.onClick.bind(this)}>뒤로</button>
                {this.props.children}
            </div>
        );
    }
}