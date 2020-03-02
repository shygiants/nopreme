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
import {Box, Heading} from 'grommet'

import termsOfService from '../resources/documents/terms-of-service.md';

import TalkChannel from './components/TalkChannel';
import PrivacyPolicy from './components/PrivacyPolicy';

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
            <Redirect
                from='privacy-policy'
                to='/privacy-policy/latest'
            />
            <Route
                path='privacy-policy/:version'
                Component={PrivacyPolicy}
            />
        </Route>
    ),
});

render(<Router resolver={resolver} />, document.getElementById('root'));