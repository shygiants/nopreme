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

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

const Router = createFarceRouter({
    historyProtocol: new HashProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: makeRouteConfig(
        <Route
            path='/'
        >
            <Route
                Component={SignIn}
            />

            <Route
                path='signup'
                Component={SignUp}
            />

        </Route>

    ),
});



render(<Router resolver={resolver} />, document.getElementById('root'));