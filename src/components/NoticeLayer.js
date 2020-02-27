import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';

import {Box, Layer, Button, Heading, Paragraph, Image} from 'grommet';
import {Close} from 'grommet-icons';

import Link from './Link';


class NoticeLayer extends Component {
    render() {
        const {onClose, homeNotice} = this.props;

        return (
            <Layer
                background='black'
                responsive={false}
            >
                <Box 
                    direction='column'
                    fill='horizontal'
                    align='end'
                >
                    <Button
                        icon={<Close />}
                        onClick={onClose}
                    />
                </Box>
                <Box
                    background='white'
                    direction='column'
                    pad={{horizontal: 'large', bottom: 'large'}}
                    width='90vw'
                    align='center'
                    overflow={{horizontal: 'hidden', vertical: 'auto'}}
                >
                    <Box
                        direction='column'
                        align='center'
                        gap='medium'
                    >
                        <Heading level={2} margin='0'>
                            {homeNotice.title}
                        </Heading>
                        {homeNotice.img && (
                            <Box
                                direction='row'
                                fill='horizontal'
                                flex='grow'
                            >
                                <Image src={homeNotice.img} fit='contain' fill />
                            </Box>
                        )}
                        <Link
                            component={Button}
                            to='/notice'
                            label='자세히 보기'
                            onClick={onClose}
                        />
                    </Box>
                </Box>
            </Layer>
        );
    }
}

export default createFragmentContainer(NoticeLayer, {
    homeNotice: graphql`
        fragment NoticeLayer_homeNotice on Notice {
            id
            noticeId
            title
            img
        }
    `,
})