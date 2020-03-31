import './css/main.css';

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
  Route,
} from 'found';
import { Resolver } from 'found-relay';

import AdminApp from './components/admin/AdminApp';
import ArtistEditor from './components/admin/ArtistEditor';
import EventEditor from './components/admin/EventEditor';
import GoodsEditor from './components/GoodsEditor';
import ItemEditor from './components/ItemEditor';

import {environment} from './environment';
import { graphql } from 'react-relay';

const artistName = 'IZ*ONE';

const Router = createFarceRouter({
    historyProtocol: new HashProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: makeRouteConfig(
        <Route
            path='/'
            Component={AdminApp}
            query={graphql`
                query admin_AdminApp_Query {
                    viewer {
                        ...AdminApp_viewer
                    }
                }
            `}
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
                                itemList(goodsId: $goodsId) {
                                    ...GoodsEditor_itemList
                                }
                            }
                        `}
                        prepareVariables={({goodsId, eventId}) => ({goodsId, artistName, eventId})}
                    />
                    <Route
                        path='/items/:itemId'
                        Component={ItemEditor}
                            query={graphql`
                                query admin_ItemEditor_Query($itemId: ID) {
                                    item(id: $itemId) {
                                        ...ItemEditor_item
                                    }
                                }
                            `}
                            prepareVariables={({itemId}) => ({itemId})}
                    />
                </Route>
            </Route>
        </Route>
    ),
});

render(<Router resolver={new Resolver(environment)} />, document.getElementById('root'));