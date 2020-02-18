import React, {Component} from 'react';
import {Box, Text, Button, TextInput} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import debounce from 'lodash.debounce';


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
            openChatLink: viewer.openChatLink,
            linkStatus: '',  
            nameStatus: '',   
        };

        //마지막 input발생 후 500ms뒤에 실행합니다
        this.debounceHandleNameChange = debounce(this.debounceHandleNameChange, 300);
        this.debounceHandleOpenChatLinkChange = debounce(this.debounceHandleOpenChatLinkChange, 300);
    }

    handleNameChange(e) {
        let newValue = e.target.value;
        this.setState({
            name: newValue
        });
        this.debounceHandleNameChange(e.target);
    }

    debounceHandleNameChange(target){
        //디바운싱 로직 - 닉네임 중복 체크는 여기서 하면 됩니다
        console.log(target.value);
        // if(true){
        //     this.setState({
        //         nameStatus: 'available'
        //     })
        // }else{
        //     this.setState({
        //         nameStatus: 'unavailable'
        //     })
        // }
    }


    handleOpenChatLinkChange(e){
        let newValue = e.target.value;
        this.setState({
            openChatLink: newValue
        });
        this.debounceHandleOpenChatLinkChange(e.target);
    }

    debounceHandleOpenChatLinkChange(target){
        const pattern = "^https?:\/\/(open\.kakao\.com)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$"
        let chatLinkPattern = new RegExp(pattern);
        if(chatLinkPattern.test(target.value)){
            this.setState({
                linkStatus: 'available'
            })
        }else{
            this.setState({
                linkStatus: 'unavailable'
            })
        }
    }

    /**
     * 각 inputField에서 엔터 입력이 발생할 경우 해당 필드값
     * 수정 요청을 보내기 위한 이벤트 핸들러입니다. 
     * @param {event} e 
     */
    handleKeyDown(e){
        if(e.key === 'Enter'){
            console.log(e.target.name +":"+e.target.value);
            //수정 요청 로직
        }
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
                        onKeyDown={this.handleKeyDown.bind(this)}
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
                        onKeyDown={this.handleKeyDown.bind(this)}
                    />
                    <Text 
                        size='xsmall' 
                        color={statusColor[linkStatus]}
                    >
                        {linkStatusText[linkStatus]}
                    </Text>
                </Box>

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