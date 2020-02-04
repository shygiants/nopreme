import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';


class ItemApp extends Component {
    render() {
        const {goods, item} = this.props;
        const {members} = item;

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
            </div>
        );
    }
}

export default createFragmentContainer(ItemApp, {
    item: graphql`
        fragment ItemApp_item on Item {
            id
            idx
            members {
                id
                name
            }
        }
    `,
    goods: graphql`
        fragment ItemApp_goods on Goods {
            id
            name
        }
    `,
});