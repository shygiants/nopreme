import React, {
    Component
} from 'react';
import {Box, Heading, Paragraph} from 'grommet'

export default class TalkChannel extends Component {
    componentDidMount() {
        // 카카오톡 채널 1:1채팅 버튼을 생성합니다.
        Kakao.Channel.createChatButton({
            container: '#kakao-talk-channel-chat-button',
            channelPublicId: '_UsMjxb' // 카카오톡 채널 홈 URL에 명시된 id로 설정합니다.
        });
    }

    render() {
        return (
            <Box
                direction='column'
                pad='medium'
            >
                <Heading>문의하기</Heading>
                <Paragraph>
                    궁금하신 점이 있거나, 문의 / 버그 / 제안 / 제휴 등 서비스 운영자에게 전하실 점이 있다면 언제든지 편하게 톡을 보내주세요.
                </Paragraph>
                <Box
                    direction='column'
                    align='center'
                >
                    <div id="kakao-talk-channel-chat-button"></div>
                </Box>
                
            </Box>
        );
    }
}