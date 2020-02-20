import React, {Component} from 'react';
import {Box, Text, Button, TextInput} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import debounce from 'lodash.debounce';

import ModifyUserMutation from '../mutations/ModifyUserMutation';


const nameStatusText = {
    available:'사용할 수 있는 닉네임 입니다',
    unavailable:'중복되거나 사용할 수 없는 닉네임 입니다'
}

const linkStatusText = {
    available:'유효한 링크입니다',
    unavailable:'유효하지 않은 링크입니다'
}

const statusColor = {
    available:'status-ok',
    unavailable:'status-error'
}

class Profile extends Component {    
    constructor(props) {
        super(props);

        const {viewer} = this.props;

        this.state = {
            name: viewer.name,
            openChatLink: viewer.openChatLink || '',
            linkStatus: '',  
            nameStatus: '',   
        };

        // 마지막 input발생 후 500ms뒤에 실행합니다
        this.debounceHandleOpenChatLinkChange = debounce(this.debounceHandleOpenChatLinkChange, 300);
    }

    handleNameChange({target: {value}}) {
        this.setState({
            name: value
        });
    }

    handleOpenChatLinkChange({target: {value}}){
        this.setState({
            openChatLink: value
        });

        this.debounceHandleOpenChatLinkChange(value);
    }

    debounceHandleOpenChatLinkChange(value){
        const pattern = "^https?:\/\/(open\.kakao\.com)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$";
        let chatLinkPattern = new RegExp(pattern);

        if (chatLinkPattern.test(value)) {
            this.setState({
                linkStatus: 'available'
            });
        } else {
            this.setState({
                linkStatus: 'unavailable'
            });
        }
    }

    handleSubmit() {
        const {name, openChatLink} = this.state;
        const {relay, router} = this.props;

        ModifyUserMutation.commit(relay.environment, {name, openChatLink}).then(resp => {
            router.go(-1);
        }).catch(err => {
            this.setState({
                nameStatus: 'unavailable',
            });

        });
    }

    render() {
        const {viewer} = this.props;
        const {name, openChatLink, linkStatus, nameStatus} = this.state;

        return (
            <Box
                pad='medium'
                direction='column'
                gap='large'
            >
                <Box
                    direction='column'
                    gap='small'
                >
                    <Text size='small' color='brand'>이름</Text>
                    <TextInput
                        name='name'
                        value={name}
                        focusIndicator={false}
                        size='small'
                        onChange={this.handleNameChange.bind(this)}
                    />
                    <Text
                        size='xsmall'
                        color={statusColor[nameStatus]}
                    >
                        {nameStatusText[nameStatus]}
                    </Text>
                </Box>
                <Box
                    direction='column'
                    gap='small'
                >
                    <Text size='small' color='brand'>오픈카카오톡 링크</Text>
                    <TextInput
                        name='openChatLink'
                        value={openChatLink}
                        focusIndicator={false}
                        size='small'
                        onChange={this.handleOpenChatLinkChange.bind(this)}
                    />
                    <Text 
                        size='xsmall' 
                        color={statusColor[linkStatus]}
                    >
                        {linkStatusText[linkStatus]}
                    </Text>
                </Box>
                <Button disabled={
                    (linkStatus === 'unavailable' || 
                    linkStatus === '' || 
                    openChatLink === viewer.openChatLink) &&
                    name === viewer.name
                } label='변경' onClick={this.handleSubmit.bind(this)} />
            </Box>
        );
    }
}

export default createFragmentContainer(Profile, {
    viewer: graphql`
        fragment Profile_viewer on User {
            id
            userId
            name
            openChatLink
        }
    `,
});