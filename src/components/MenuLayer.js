import React, {
    Component
} from 'react';
import {graphql, createFragmentContainer,} from 'react-relay';
import {Grommet, Header, Main, Footer, Layer, Button, Box, Heading} from 'grommet';
import { Transaction, Search } from 'grommet-icons';

import {Avatar,} from './styled-components/HeaderComponent';
import Link from './Link';



class MenuLayer extends Component {
    render () {
        const {viewer, show, onClose} = this.props;

        return show && (
            <Layer
                responsive={false}
                full='vertical'
                position='left'
                onEsc={onClose}
                onClickOutside={onClose}
            >
                <Box
                    width='60vw'
                    height='100vh'
                    direction='column'
                    justify='between'
                    pad='large'
                    gap='large'
                >
                    <Header>
                        <Avatar viewer={viewer}/>
                    </Header>
                    
                    <Main
                        fill={false}
                        gap='large'
                    >
                        <Link onClick={onClose} icon={<Transaction />} to='/' label='교환 상대 찾기'/>
                        <Link onClick={onClose} icon={<Search />} to='/browse' label='굿즈'/>
                    </Main>

                    <Footer>
                        Footer
                    </Footer>
                </Box>
            </Layer>   
        );
    }
}

export default createFragmentContainer(MenuLayer, {
    viewer: graphql`
        fragment MenuLayer_viewer on User {
            id
            userId
            name
            admin
        }
    `,
});