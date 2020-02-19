import React, {Component, createRef} from 'react';
import {Box, Text, Button, TextInput, Layer, Drop} from 'grommet';
import {CopyToClipboard as CTC} from 'react-copy-to-clipboard';
import {Copy} from 'grommet-icons';

export default class CopyToClipboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            copied: false,
        }

        this.handleCopy = this.handleCopy.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.buttonRef = createRef();
    }

    handleCopy() {
        this.setState({copied: true});
    }

    handleClose() {
        this.setState({copied: false});
    }

    render() {
        const {copied} = this.state;
        const {value} = this.props;


        return (
            <Box
                fill='horizontal'
            >
                <Box
                    direction='row'
                    gap='small'
                    align='center'
                >
                    <TextInput size='small' value={value}></TextInput>
                    <CTC
                        text={value}
                        onCopy={this.handleCopy}
                    >
                        <Box width='50vw'>
                            <Button fill='horizontal' label='링크 복사' ref={this.buttonRef} />
                        </Box>
                    </CTC>
                </Box>
                {this.buttonRef.current && copied && (
                    <Drop
                        align={{ top: "bottom" }}
                        stretch={false}
                        target={this.buttonRef.current}
                        onEsc={this.handleClose}
                        onClickOutside={this.handleClose}
                    >
                        <Box 
                            round='medium' 
                            pad="small" 
                            align='center' 
                            direction='row' 
                            gap='xsmall'
                        ><Copy /> 복사 완료!</Box>
                    </Drop>
                )}
            </Box>
        );
    }
}