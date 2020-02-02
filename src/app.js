import React, {
    Component
} from 'react';
import {
    render
} from 'react-dom';

import { BrowserProtocol, queryMiddleware, HashProtocol } from 'farce';
import {
  createFarceRouter,
  createRender,
  makeRouteConfig,
  Route,
} from 'found';
import { Resolver } from 'found-relay';

import App from './components/App';
import ArtistApp from './components/ArtistApp';
import EventApp from './components/EventApp';
import GoodsApp from './components/GoodsApp';

import {environment} from './environment';

const artistName = 'IZ*ONE';

const Router = createFarceRouter({
    historyProtocol: new HashProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: makeRouteConfig(
        <Route
            path='/'
            Component={App}
            query={graphql`
                query app_App_Query {
                    viewer {
                        ...App_viewer
                    }
                }
            `}
        >
            <Route
                Component={ArtistApp}
                query={graphql`
                    query app_ArtistApp_Query($artistName: String) {
                        artist(name: $artistName) {
                            ...ArtistApp_artist
                        }
                    }
                `}
                prepareVariables={() => ({artistName})}
            />
            <Route
                path='events/:eventId'
                Component={EventApp}
                query={graphql`
                    query app_EventApp_Query($eventId: ID, $artistName: String) {
                        event(id: $eventId) {
                            ...EventApp_event @arguments(artistName: $artistName)
                        }
                        artist(name: $artistName) {
                            ...EventApp_artist 
                        }
                    }
                `}
                prepareVariables={(params) => ({eventId: params.eventId, artistName})}
            />
            <Route
                path='goods/:goodsId'
                Component={GoodsApp}
                query={graphql`
                    query app_GoodsApp_Query($goodsId: ID, $artistName: String) {
                        goods(id: $goodsId) {
                            ...GoodsApp_goods
                        }
                        artist(name: $artistName) {
                            ...ItemList_artist 
                        }
                    }
                `}
                prepareVariables={params => ({goodsId: params.goodsId, artistName})}
            />
        </Route>
    ),
});

render(<Router resolver={new Resolver(environment)} />, document.getElementById('root'));