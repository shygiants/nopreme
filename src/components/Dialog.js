import React, {Component} from 'react';
import {Box, Text, Button, Layer, Heading} from 'grommet';

export default class Dialog extends Component {
    render() {
        const {show, title, message, actions, onAction, onClose} = this.props;

        return show && (
            <Layer 
                responsive={false}
                position="center" 
                modal 
                onClickOutside={onClose} 
                onEsc={onClose}
            >
                <Box pad="medium" gap="small" width="medium">
                    <Heading level={2} margin="none">
                    {title}
                    </Heading>

                    {message instanceof String ? (<Text>{message}</Text>) : message}
                    <Box
                        as="footer"
                        gap="small"
                        direction="row"
                        align="center"
                        justify="end"
                        pad={{ top: "medium", bottom: "small" }}
                    >

                        {actions.map(({label, name, primary=false, color=null}) => (
                            <Button 
                                key={name}
                                label={label}
                                onClick={() => onAction(name)}
                                primary={primary}
                                color={color}
                            />
                        ))}


                        {/* <Button label="Open 2" onClick={onOpen2} color="dark-3" />
                        <Button
                            label={
                            <Text color="white">
                                <strong>Delete</strong>
                            </Text>
                            }
                            onClick={onClose}
                            primary
                            color="status-critical"
                        /> */}
                    </Box>
                </Box>
            </Layer>
        );
    }
}