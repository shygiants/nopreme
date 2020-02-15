import React, {
    Component
} from 'react';
import {Box, Layer, Heading, Button} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';

class ExchangeLayer extends Component {
    handleCancelClick() {
        this.props.onCancel();
    }

    render() {
        const {exchange} = this.props;

        return (
            <Layer
                position='center' 
                modal
                responsive={false}
            >
                <Box
                    width='medium'
                    pad='medium'
                    direction='column'
                    gap='medium'
                >
                    <Heading level={2} margin='none'>교환 신청 완료</Heading>

                    <Button onClick={this.handleCancelClick.bind(this)} label='교환 취소'/>
                    <Button target='_blank' href={exchange.acceptor.openChatLink} label='오픈채팅으로 연락'/>
                </Box>
            </Layer>
        );
    }

}

export default createFragmentContainer(ExchangeLayer, {
    exchange: graphql`
        fragment ExchangeLayer_exchange on Exchange {
            id
            acceptor {
                id
                openChatLink
            }
        }
    `,
});