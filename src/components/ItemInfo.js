import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';


class ItemInfo extends Component {
    render() {
        const {item} = this.props;
        const {members, goods} = item;

        function memberComp(member) {
            return (<span>{member.name}</span>);
        }

        let comp;
        if (members.length == 1) {
            comp = (
                <div>
                    {memberComp(members[0])}
                </div>
            );
        } else {
            comp = (
                <div>
                    <ul>
                        {members.map(member => (
                            <li key={member.id}>{memberComp(member)}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return (
            <div>
                <h1>IDX: {item.idx}</h1>
                <h2>{goods.name}</h2>
                {comp}
                <img src={item.img} />
            </div>
        );
    }
}

export default createFragmentContainer(ItemInfo, {
    item: graphql`
        fragment ItemInfo_item on Item {
            id
            idx
            members {
                id
                name
            }
            img
            goods {
                id
                name
            }
        }
    `,
});