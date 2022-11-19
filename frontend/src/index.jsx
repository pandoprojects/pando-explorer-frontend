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
import Nodes from './sections/nodes';
import './styles/styles.scss'
import "./i18n.js"
import NodeStatus from './sections/node-status';
ReactDom.render(
  
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Home}  />
      <Route path='/dashboard' component={Home}  />
      <Route path='/blocks' component={Blocks}  />
      <Route path='/blocks/:blockHeight' component={BlockDetails}  />
      <Route path='/txs' component={Transactions}  />
      <Route path='/txs/:transactionHash' component={TransactionDetails}  />
      <Route path='/tx/:transactionHash' component={TransactionDetails} />
      <Route path='/account/:accountAddress' component={AccountDetails} />
      <Route path='/stakes' component={Stakes}/>
      <Route path='/nodes' component={Nodes}/>
      <Route path='/public-node' component={NodeStatus} />
      <Route path='/downloads' component={Downloads}/>
     
    </Route>
  </Router>,
  document.getElementById('app-root')
);
