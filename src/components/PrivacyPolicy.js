import React, {
    Component
} from 'react';
import {Box, Heading} from 'grommet'

import Link from './Link';

const mds = {
    latest: import('../../resources/documents/privacy-policy.md'),
    200221: import('../../resources/documents/privacy-policy-200221.md'),
};


export default class PrivacyPolicy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: null,
        };
    }

    componentDidMount() {
        const version = this.props.match.params.version;

        mds[version].then(page => {
            this.setState({page});
        });
    }

    componentDidUpdate(prevProps) {
        const version = this.props.match.params.version;
        const prevVersion = prevProps.match.params.version;

        if (prevVersion !== version) {
            mds[version].then(page => {
                this.setState({page});
            });
        }
    }

    render() {
        const {page} = this.state;
        return (
            <Box
                pad={{horizontal: 'medium'}}
            >
                <Heading>개인정보처리방침</Heading>
                <Box
                    wrap
                    dangerouslySetInnerHTML={{
                        __html: page
                    }}
                />
                <Box
                    direction='column'
                    pad='medium'
                >
                    <Link to='/privacy-policy/latest' label='2020.3.2 ~ 적용' />
                    <Link to='/privacy-policy/200221' label='2020.2.21 ~ 20.3.1 적용' />
                </Box>
            </Box>
        );
    }
}