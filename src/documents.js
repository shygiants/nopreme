import './css/documents/main.css'

import React, {
    Component
} from 'react';
import {
    render
} from 'react-dom';
import { queryMiddleware, HashProtocol } from 'farce';
import {
    createFarceRouter,
    makeRouteConfig,
    Redirect,
    Route,
    resolver,
} from 'found';

import Container from './components/Container';
import {Paragraph, Box, Heading} from 'grommet'

import termsOfService from '../resources/documents/terms-of-service.md';
import privacyPolicy from '../resources/documents/privacy-policy.md';
import TalkChannel from './components/TalkChannel';

const Router = createFarceRouter({
    historyProtocol: new HashProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: makeRouteConfig(
        <Route
            Component={Container}
            path='/'
        >
            <Redirect from='/' to='/talk-channel' />
            <Route
                Component={TalkChannel}
                path='talk-channel'
            />
            <Route
                path='terms-of-service'
                render={() => {
                    return (
                        <Box
                            pad={{horizontal: 'medium'}}
                        >
                            <Heading>이용약관</Heading>
                            <Box
                                wrap
                                dangerouslySetInnerHTML={{
                                    __html: termsOfService
                                }}
                            />

                        </Box>
                    )
                }}
            />

            <Route
                path='privacy-policy'
                render={() => {
                    return (
                        <Box
                            pad={{horizontal: 'medium'}}
                        >
                            <Heading>개인정보처리방침</Heading>
                            <Box
                                wrap
                                dangerouslySetInnerHTML={{
                                    __html: privacyPolicy
                                }}
                            />

                        </Box>
                    )
                }}
            />
        </Route>
    ),
});

render(<Router resolver={resolver} />, document.getElementById('root'));