import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Box, Text, Anchor} from 'grommet';

class Banner extends Component {
    render() {
        const {banner} = this.props;

        console.log(banner)

        const texts = (
            <Box
                direction='column'
                justify='end'
            >
                {banner.texts.map((text, idx) => (
                    <Text
                        key={`bannerText${idx}`}
                        size='xsmall'
                        color='brand'
                        weight='bold'
                        margin='0'
                    >
                        {text}
                    </Text>            
                ))}
            </Box>
        );

        return (
            <Box>
                {banner.link !== undefined && banner.link !== null ? (
                    <Anchor 
                        target='blank'
                        href={banner.link}  
                        label={texts}
                    />
                ) : texts}
            </Box>
        );
    }
}

export default createFragmentContainer(Banner, {
    banner: graphql`
        fragment Banner_banner on Banner {
            id
            texts
            link
        }
    `,
});