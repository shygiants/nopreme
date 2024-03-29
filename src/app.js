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

import App from './components/App';
import ArtistApp from './components/ArtistApp';
import EventApp from './components/EventApp';
import GoodsApp from './components/GoodsApp';
import ItemApp from './components/ItemApp';
import Pop from './components/Pop';
import Feed from './components/Feed';
import ViewerApp from './components/ViewerApp';

import {environment} from './environment';
import { graphql } from 'react-relay';
import ExchangeApp from './components/ExchangeApp';
import Profile from './components/Profile';
import Notice from './components/Notice';
import Settings from './components/Settings';

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
                    homeNotice {
                        ...App_homeNotice
                    }
                    banner {
                        ...App_banner
                    }
                }
            `}
        >
            <Route 
                Component={Feed}
                query={graphql`
                    query app_Feed_Query($count: Int, $cursor: String, $filterByRegion: Boolean, $method: MethodType) {
                        viewer {
                            ...Feed_viewer
                        }
                        matchList {
                            ...Feed_matchList @arguments(count: $count, cursor: $cursor, filterByRegion: $filterByRegion, method: $method)
                        }
                        exchangeList {
                            ...Feed_exchangeList
                        }
                    }
                `}
                prepareVariables={({filterByRegion, method, count}) => ({filterByRegion: filterByRegion || true, method: method || 'DONTCARE', count: count || 6})}
            />

            <Route
                path='exchanges/:exchangeId'
                Component={ExchangeApp}
                query={graphql`
                    query app_ExchangeApp_Query($exchangeId: ID) {
                        viewer {
                            ...ExchangeApp_viewer
                        }
                        exchange(id: $exchangeId) {
                            ...ExchangeApp_exchange
                        }
                    }
                `}
                prepareVariables={({exchangeId}) => ({exchangeId})}
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
                                        ...GoodsApp_viewer @arguments(goodsId: $goodsId)
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
                                    itemList(goodsId: $goodsId) {
                                        ...GoodsApp_itemList
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
                                    query app_ItemApp_Query($itemId: ID) {
                                        item(id: $itemId) {
                                            ...ItemApp_item
                                        }
                                    }
                                `}
                                prepareVariables={({itemId}) => ({itemId})}
                        />
                    </Route>

                </Route>


                
            </Route>

            <Route
                path='menu'
                Component={ViewerApp}
                query={graphql`
                    query app_ViewerApp_Query {
                        viewer {
                            ...ViewerApp_viewer
                        }
                    }
                `}
            />

            <Route
                path='profile'
                Component={Profile}
                query={graphql`
                    query app_Profile_Query($stateCode: String, $cityCode: String) {
                        viewer {
                            ...Profile_viewer
                        }
                        address {
                            ...Profile_address @arguments(stateCode: $stateCode, cityCode:$cityCode)
                        }
                    }
                `}
                prepareVariables={({stateCode, cityCode}) => ({stateCode, cityCode})}
            />

            <Route
                path='notice'
                Component={Notice}
                query={graphql`
                    query app_Notice_Query {
                        notices {
                            ...Notice_notices
                        }
                    }
                `}
            />

            {/* <Route
                path='settings'
                Component={Settings}
                query={graphql`
                    query app_Settings_Query {
                        viewer {
                            ...Settings_viewer
                        }
                    }
                `}
            /> */}
        </Route>
    ),
});

render(<Router resolver={new Resolver(environment)} />, document.getElementById('root'));