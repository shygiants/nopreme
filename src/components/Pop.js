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
                {this.props.children}
            </div>
        );
    }
}