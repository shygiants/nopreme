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
import ItemApp from './components/ItemApp';
import Pop from './components/Pop';
import Feed from './components/Feed';

import {environment} from './environment';
import { graphql } from 'react-relay';

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
                Component={Feed}
                query={graphql`
                    query app_Feed_Query {
                        viewer {
                            ...Feed_viewer
                        }
                    }
                `}
            />
            <Route
                path='browse'
            >
                <Route
                    Component={ArtistApp}
                    query={graphql`
                        query app_ArtistApp_Query($artistName: String) {
                            artist(name: $artistName) {
                                ...ArtistApp_artist @arguments(artistName: $artistName)
                            }
                        }
                    `}
                    prepareVariables={() => ({artistName})}
                />
                <Route
                    path='/'
                    Component={Pop}
                >
                    <Route
                        path='goods/:goodsId'
                    >
                        <Route
                            Component={GoodsApp}
                            query={graphql`
                                query app_GoodsApp_Query($goodsId: ID, $artistName: String) {
                                    viewer {
                                        ...GoodsApp_viewer
                                    }
                                    artist(name: $artistName) {
                                        ...GoodsApp_artist 
                                    }
                                    event(goodsId: $goodsId) {
                                        ...GoodsApp_event
                                    }
                                    goods(id: $goodsId) {
                                        ...GoodsApp_goods
                                    }   
                                }
                            `}
                            prepareVariables={({goodsId}) => ({goodsId, artistName})}
                        />
                        <Route
                            path='events/:eventId'
                            Component={EventApp}
                            query={graphql`
                                query app_EventApp_Query($eventId: ID, $artistName: String) {
                                    artist(name: $artistName) {
                                        ...EventApp_artist 
                                    }
                                    event(id: $eventId) {
                                        ...EventApp_event @arguments(artistName: $artistName)
                                    }
                                }
                            `}
                            prepareVariables={(params) => ({eventId: params.eventId, artistName})}
                        />
                        <Route
                            path='/items/:itemId'
                            Component={ItemApp}
                                query={graphql`
                                    query app_ItemApp_Query($itemId: ID, $goodsId: ID) {
                                        item(id: $itemId) {
                                            ...ItemApp_item
                                        }
                                        goods(id: $goodsId) {
                                            ...ItemApp_goods
                                        }
                                    }
                                `}
                                prepareVariables={({itemId, goodsId}) => ({itemId, goodsId})}
                        />
                    </Route>

                </Route>


                
            </Route>
            
        </Route>
    ),
});

render(<Router resolver={new Resolver(environment)} />, document.getElementById('root'));