import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppWrapper from './AppWrapper';
import { BigNumber } from 'bignumber.js';
import './i18n'

BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
ReactDOM.render(<AppWrapper />, document.getElementById('root'));
