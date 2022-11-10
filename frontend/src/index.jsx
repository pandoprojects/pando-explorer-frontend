import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './app';
import Home from './sections/home';
import Transactions from './sections/transactions'
import TransactionDetails from './sections/transaction-details'
import Blocks from './sections/blocks'
import BlockDetails from './sections/block-details'
import AccountDetails from './sections/account-details'
import Downloads from './sections/downloads'
import Stakes from './sections/stakes'
import config from './config';
import Nodes from './sections/nodes';
import './styles/styles.scss'
import "./i18n.js"
import NodeStatus from './sections/node-status';
import Network from './common/components/networks';
const backendSocketAddress = `${config.socketApi.host}:${config.socketApi.port}`;
ReactDom.render(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home} backendAddress={backendSocketAddress} />
      <Route path='/dashboard' component={Home} backendAddress={backendSocketAddress} />
      <Route path='/blocks' component={Blocks} backendAddress={backendSocketAddress} />
      <Route path='/blocks/:blockHeight' component={BlockDetails} backendAddress={backendSocketAddress} />
      <Route path='/txs' component={Transactions} backendAddress={backendSocketAddress} />
      <Route path='/txs/:transactionHash' component={TransactionDetails} backendAddress={backendSocketAddress} />
      <Route path='/tx/:transactionHash' component={TransactionDetails} />
      <Route path='/account/:accountAddress' component={AccountDetails} />
      <Route path='/stakes' component={Stakes}/>
      <Route path='/nodes' component={Nodes}/>
      <Route path='/node-status' component={NodeStatus} />
      <Route path='/downloads' component={Downloads}/>
     
    </Route>
  </Router>,
  document.getElementById('app-root')
);
