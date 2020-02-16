import React, {Component} from 'react';
import {Box, Text, Button, TextInput} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import debounce from 'lodash.debounce';

class Profile extends Component {    
    constructor(props) {
        super(props);

        const {viewer} = this.props;

        this.state = {
            name: viewer.name,
            openChatLink: viewer.openChatLink,        
        };

        //마지막 input발생 후 500ms뒤에 실행합니다
        this.debounceHandleNameChange = debounce(this.debounceHandleNameChange, 500);
        this.debounceHandleOpenChatLinkChange = debounce(this.debounceHandleOpenChatLinkChange, 500);
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
    }

    handleOpenChatLinkChange(e){
        let newValue = e.target.value;
        this.setState({
            openChatLink: newValue
        });
        this.debounceHandleOpenChatLinkChange(e.target);
    }

    debounceHandleOpenChatLinkChange(target){
        let newValue = target.value
        console.log(newValue);
        //디바운싱 로직 - Regex - 카카오톡 오픈채팅 링크 유효성 검사는 여기서
        // let chatLinkPattern = new RegExp("");
        // if(chatLinkPattern.test(newValue)){
        //     //Regex 매칭 로직
        // }    
    }


    handleKeyDown(e){
        if(e.key === 'Enter'){
            console.log(e.target.name +":"+e.target.value);
            //수정 요청 로직
        }
    }

    render() {
        const {viewer} = this.props;
        const {name, openChatLink} = this.state;
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