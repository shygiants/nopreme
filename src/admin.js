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
import ArtistEditor from './components/ArtistEditor';
import EventEditor from './components/EventEditor';
import GoodsEditor from './components/GoodsEditor';
import ItemEditor from './components/ItemEditor';
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
                query admin_App_Query {
                    viewer {
                        ...App_viewer
                    }
                }
            `}
        >
            <Route 
                Component={Feed}
                query={graphql`
                    query admin_Feed_Query {
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
                    Component={ArtistEditor}
                    query={graphql`
                        query admin_ArtistEditor_Query($artistName: String) {
                            artist(name: $artistName) {
                                ...ArtistEditor_artist
                            }
                        }
                    `}
                    prepareVariables={() => ({artistName})}
                />
                <Route
                    path='events/:eventId'
                    Component={Pop}
                >
                    <Route
                        Component={EventEditor}
                        query={graphql`
                            query admin_EventEditor_Query($eventId: ID, $artistName: String) {
                                artist(name: $artistName) {
                                    ...EventEditor_artist 
                                }
                                event(id: $eventId) {
                                    ...EventEditor_event @arguments(artistName: $artistName)
                                }
                            }
                        `}
                        prepareVariables={(params) => ({eventId: params.eventId, artistName})}
                    />
                    <Route
                        path='/goods/:goodsId'
                    >
                        <Route
                            Component={GoodsEditor}
                            query={graphql`
                                query admin_GoodsEditor_Query($goodsId: ID, $artistName: String, $eventId: ID) {
                                    artist(name: $artistName) {
                                        ...GoodsEditor_artist 
                                    }
                                    event(id: $eventId) {
                                        ...GoodsEditor_event
                                    }
                                    goods(id: $goodsId) {
                                        ...GoodsEditor_goods
                                    }   
                                }
                            `}
                            prepareVariables={({goodsId, eventId}) => ({goodsId, artistName, eventId})}
                        />
                        <Route
                            path='/items/:itemId'
                            Component={ItemEditor}
                                query={graphql`
                                    query admin_ItemEditor_Query($itemId: ID, $goodsId: ID) {
                                        item(id: $itemId) {
                                            ...ItemEditor_item
                                        }
                                        goods(id: $goodsId) {
                                            ...ItemEditor_goods
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