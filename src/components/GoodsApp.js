import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import ItemList from './ItemList';
import ToggleSwitch from './ToggleSwith';

class GoodsApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editable: false,
        };
    }

    handleToggle() {
        this.setState(state => ({
            editable: !state.editable,
        }));
    }
    render() {
        const {goods, artist, event} = this.props;
        const {editable} = this.state;

        return (
            <div>
                <h1>{goods.name}</h1>
                <h2>{event.name}</h2>
                <ToggleSwitch on={editable} onChange={this.handleToggle.bind(this)} label='Admin' />
                <ItemList goods={goods} artist={artist} editable={editable}/>
            </div>
        );
    }
}

export default createFragmentContainer(GoodsApp, {
    goods: graphql`
        fragment GoodsApp_goods on Goods {
            id
            name
            ...ItemList_goods
        }
    `,
    event: graphql`
        fragment GoodsApp_event on Event {
            id
            name
        }
    `,
});
