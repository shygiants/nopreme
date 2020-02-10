import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer} from 'react-relay';

class MatchItem extends Component {
    render() {
        const {item} = this.props;

        const member = item.members[0]

        return (
            <div>
                <img src={item.img} />
                <div>{item.goods.name}</div>
                <div>{member.name} {item.idx}</div>
            </div>
        );
    }
}

export default createFragmentContainer(MatchItem, {
    item: graphql`
        fragment MatchItem_item on Item {
            id
            idx
            img
            members {
                id
                name
            }
            goods {
                id
                name
            }
        }
    `,
})