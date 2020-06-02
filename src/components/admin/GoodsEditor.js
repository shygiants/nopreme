import React, {Component} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Heading, Text, Button, Layer, Anchor, DataTable, Image} from 'grommet';
import {Add, Edit} from 'grommet-icons';

import TextsInput from '../TextsInput';
import AddItemMutation from '../../mutations/AddItemMutation';
import ModifyItemMutation from '../../mutations/ModifyItemMutation';

import {range, classify} from '../../utils';
import ItemInput from './ItemInput';

function wrapCommit(func) {
    function asyncWrapper(environment, args) {
        return new Promise((resolve, reject) => {
            try {
                func(environment, args, resolve);
            } catch (e) {
                reject(e);
            }
        });
    }

    return asyncWrapper;
}

class GoodsEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adding: false,
            editing: null,
        };

        this.handleItemEdit = this.handleItemEdit.bind(this);
        this.handleItemEditSave = this.handleItemEditSave.bind(this);
        this.handleItemsSave = this.handleItemsSave.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleAdd() {
        this.setState({
            adding: true,
        });
    }

    handleClose() {
        this.setState({
            adding: false,
            editing: null,
        });
    }

    handleItemsSave({numPerMembers, numPerGroup}) {
        const {relay, goods, artist, itemList} = this.props;

        numPerMembers = Number(numPerMembers);
        numPerGroup = Number(numPerGroup);

        const asyncCommit = wrapCommit(AddItemMutation.commit);

        async function commit() {
            if (numPerMembers > 0) {
                for (const member of artist.members) {
                    const indices = range(numPerMembers);
                    for (const idx of indices) {
                        await asyncCommit(relay.environment, {
                            idx, 
                            memberIds: [member.memberId], 
                            goodsId: goods.goodsId, 
                            itemList
                        });
                        console.log(member.name)
                        console.log(idx)
                    }
                }
            }
    
            if (numPerGroup > 0) {
                const indices = range(numPerGroup);
                for (const idx of indices) {
                    await asyncCommit(relay.environment, {
                        idx, 
                        memberIds: artist.members.map(member => member.memberId), 
                        goodsId: goods.goodsId, 
                        itemList
                    });
                }
            }
        }

        commit().then(() => this.setState({adding: false}));
    }

    handleItemEdit(item) {
        this.setState({editing: item});
    }

    handleItemEditSave(item) {
        const {goods} = this.props;

        ModifyItemMutation.commit(this.props.relay.environment, {
            id: item.itemId,
            idx: item.idx,
            memberIds: item.members.map(member => member.memberId),
            img: item.img,
            goods,
        }, () => this.setState({editing: null}));
    }

    render() {
        const {adding, editing} = this.state;
        const {artist, event, goods, itemList} = this.props;
        const {items} = itemList;

        const nodes = items.edges.map(edge => edge.node);
        
        const texts = [{
            name: 'numPerMembers',
            display: '멤버 당 수',
        }, {
            name: 'numPerGroup',
            display: '그룹 당 수',
        }];

        const classified = classify(nodes, 'members.name');
        const memberCombs = [...classified.keys()];

        // const memberNames = this.props.artist.members.map(member => member.name);

        function displayMemberComb(memberComb) {
            const memberNames = memberComb.split(',');

            return memberNames.length === artist.members.length ? '단체' : memberComb;
        }

        const nodesReadible = nodes.map(node => ({
            ...node, 
            membersName: displayMemberComb(node.members.map(member => member.name).join(','))
        }));

        return (
            <Box
                direction='column'
                pad={{horizontal: 'medium'}}
            >
                <Box
                    width='medium'
                    height='medium'
                >
                    <Image
                        src={goods.img}
                        fit='contain'
                    />
                </Box>
                <Heading level={2}>{goods.name}</Heading>
                <Text>{goods.description}</Text>
                
                {(adding || editing) && (
                    <Layer 
                        margin='large'
                        responsive={false}
                        position='center' 
                        modal 
                        full
                        onClickOutside={this.handleClose.bind(this)} 
                        onEsc={this.handleClose.bind(this)}
                    >
                        <Box
                            margin='medium'
                            overflow='auto'
                        >
                            {editing ? (
                                <ItemInput item={editing} onSubmit={this.handleItemEditSave} />
                            ) : (
                                <TextsInput texts={texts} onSave={this.handleItemsSave} />
                            )}
                        </Box>
                    </Layer>
                )}
                <Button fill hoverIndicator='light-2' onClick={this.handleAdd}>
                    <Box flex='grow' pad="small" direction="row" align="center" gap="small">
                        <Add/>
                        <Text>새로운 아이템 추가</Text>
                    </Box>
                </Button>
                <DataTable
                    columns={[{
                        property: 'img',
                        header: '이미지',
                        render: datum => datum.img && (
                            <Box
                                height='100px'
                                width='100px'
                            >
                                <Image
                                    src={datum.img}
                                    fit='contain'
                                />
                            </Box>
                        )
                    }, {
                        property: 'membersName',
                        header: '멤버',
                    }, {
                        property: 'idx',
                        header: '번호',
                    }, {
                        property: 'edit',
                        render: datum => (
                            <Button icon={<Edit/>} onClick={() => this.handleItemEdit(datum)}/>
                        )
                    }, ]}
                    data={nodesReadible}
                    // groupBy={adding ? null : 'membersName'}
                />

            </Box>
        );
    }
}

export default createFragmentContainer(GoodsEditor, {
    artist: graphql`
        fragment GoodsEditor_artist on Artist {
            id
            members {
                id
                memberId
                name
            }
        }
    `,
    event: graphql`
        fragment GoodsEditor_event on Event {
            id
            name
        }
    `,
    goods: graphql`
        fragment GoodsEditor_goods on Goods {
            id
            goodsId
            name
            description
            img
        }
    `,
    itemList: graphql`
        fragment GoodsEditor_itemList on ItemList {
            id
            items(
                first: 2147483647 # max GraphQLInt
            ) @connection(key: "GoodsEditor_items") {
                edges {
                    node {
                        id
                        itemId
                        idx
                        img
                        members {
                            id
                            memberId
                            name
                        }
                    }
                }
            }
        }
    `,
});
