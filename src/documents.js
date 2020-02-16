import './css/documents/main.css'

import React, {
    Component
} from 'react';
import {
    render
} from 'react-dom';
import { BrowserProtocol, queryMiddleware, HashProtocol } from 'farce';
import {
    createFarceRouter,
    HttpError,
    makeRouteConfig,
    Redirect,
    Route,
    resolver,
} from 'found';

import Container from './components/Container';
import {Paragraph} from 'grommet'

import termsOfService from '../resources/documents/terms-of-service.txt';
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
                        <Paragraph>
                            {termsOfService}
                        </Paragraph>
                    )
                }}
            />

            <Route
                path='privacy-policy'
                render={() => {
                    return (
                        <Paragraph>
                            {termsOfService}
                        </Paragraph>
                    )
                }}
            />
        </Route>
    ),
});

render(<Router resolver={resolver} />, document.getElementById('root'));