import React, {Component} from 'react';
import {Box, Heading, Text, Accordion, AccordionPanel, Paragraph, Image, Anchor} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';

import Link from './Link';

class Notice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndices: [0],
        };
    }

    handleActive(activeIndices) {
        this.setState({activeIndices});
    }

    getNoticeLink(notice) {
        let link;

        if (notice.link) {
            if (notice.link[0] === '/') {
                link = (<Link to={notice.link} label={notice.linkText} />);
            } else {
                link = (<Anchor href={notice.link} target='blank' label={notice.linkText} />)
            }
        }

        return link;
    }

    render() {
        const {activeIndices} = this.state;
        const {notices} = this.props;

        return (
            <Box
                width='100vw'
            >
                <Accordion multiple activeIndex={activeIndices} onActive={this.handleActive.bind(this)}>
                {notices.map(notice => (
                    <AccordionPanel key={notice.noticeId} label={(
                            <Box
                                pad={{horizontal: 'medium'}}
                                direction='column'
                            >
                                <Heading 
                                    level={4}
                                    margin={{vertical: 'small'}}
                                >{notice.title}</Heading>
                                <Text 
                                    size='small' 
                                    color='dark-3'
                                >{notice.createdAt}</Text>
                            </Box>
                        )}>
                        <Box
                            direction='column'
                            pad='medium'
                        >
                            {notice.img && (
                                <Box
                                    direction='row'
                                    fill='horizontal'
                                    flex='grow'
                                >
                                    <Image src={notice.img} fit='contain' fill />
                                </Box>
                            )}
                            <Paragraph>{notice.text}</Paragraph>
                            {this.getNoticeLink(notice)}
                        </Box>
                    </AccordionPanel>
                ))}
                </Accordion>

            </Box>
            
        );
    }

}

export default createFragmentContainer(Notice, {
    notices: graphql`
        fragment Notice_notices on Notice @relay(plural: true) {
            id
            noticeId
            title
            text
            img
            link
            linkText
            createdAt
        }
    `,
})