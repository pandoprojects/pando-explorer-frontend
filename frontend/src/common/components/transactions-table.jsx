import React, { Component } from "react";
import { browserHistory, Link } from 'react-router';
import socketClient from 'socket.io-client';
import _ from 'lodash';
import cx from 'classnames';

import { truncateMiddle } from '../../common/helpers/utils';
import { formatCoin, priceCoin } from '../../common/helpers/utils';
import { from, to, fee, value, hash, age, date, type, coins } from '../../common/helpers/transactions';
import { TxnTypeText, TxnClasses } from '../../common/constants';
import { withTranslation } from "react-i18next";



class TransactionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.backendAddress,
      transactions: [],
      account: null
    };
  }
  static defaultProps = {
    includeDetails: true,
    truncate: 20,
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.transactions && nextProps.transactions.length && nextProps.transactions !== prevState.transactions) {
      return { transactions: nextProps.transactions, account: nextProps.account };
    }
    return prevState;
  }
  componentDidMount() {
    const { backendAddress } = this.state;
    const { updateLive } = this.props;
    // const { transactions } = this.state;
    // Initial the socket
    // if (updateLive && backendAddress) {
    //   this.socket = socketClient(backendAddress);
    //   this.socket.on('PUSH_TOP_TXS', this.onSocketEvent)
    // }
  }
  componentWillUnmount() {
    
  }
  // onSocketEvent(data) {
  //   if (data.type == 'transaction_list') {

  //     let transactionsUpdated = (data.body || []).sort((a, b) => b.number - a.number);
  //    


  //     
  //   }
  // }

  handleRowClick = (hash) => {
    browserHistory.push(`/txs/${hash}`);
  }

  render() {
    const { className, includeDetails, truncate, account, price, t } = this.props;
    const { transactions } = this.state;

    let uniqueSet = new Set(transactions.map(JSON.stringify));
    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);

    const address = account ? account.address : null;
    return (
      <div className="txt-de2 mnet6">
      <table className={cx("data txn-table2", className)}>
        <thead style={{paddingBottom:'15px'}}>
          <tr>
            <th className="type"><p>{t(`TYPE`)}</p></th>
            <th className="hash"><p>{t('TXN_HASH')}</p></th>
            {includeDetails &&
              <React.Fragment>
                <th className="block"><p>{t(`BLOCK`)}</p></th>
                <th className="age"><p>{t(`AGE`)}</p></th>
                <th className="from"><p>{t(`FROM`)}</p></th>
                <th className={cx("icon", { 'none': !account })}></th>
                <th className="to"><p>{t(`TO`)}</p></th>
                <th className="value"><p>{t(`VALUE`)}</p></th>
              </React.Fragment>}
          </tr>
        </thead>
        <tbody>
          {_.map(uniqueArray, (txn, index) => {

            let source = null;
         
            source = !account ? 'none' : account.address === from(txn, null, account) ? 'from' : 'to';
            return (
              // <tr key={txn.hash} className={TxnClasses[txn.type]} key={index}>
              <tr key={txn.hash} className={TxnClasses[txn.type]}>
                <td className="type" ><img src="../images/icons/icon_coinbase@2x.png" className="coin-b2" />{type(txn)}</td>
                <td className="hash overflow"><Link to={`/txs/${txn.hash}`}>{hash(txn, truncate)}</Link></td>
                {includeDetails &&
                  <React.Fragment>
                    <td className="block">{txn.block_height}</td>
                    <td className="age" title={date(txn)}>{age(txn)}</td>
                    <td className={cx({ 'dim': source === 'to' }, "from overflow")}><Link to={`/account/${from(txn)}`}>{from(txn, 20)}</Link></td>
                    <td className={cx(source, "icon")}></td>
                    <td className={cx({ 'dim': source === 'from' }, "to overflow")}>
                      <Link to={`/account/${to(txn, null, address)}`}>{to(txn, 20, address)}</Link>
                    </td>

                    <td className="value"><Value coins={coins(txn, account)} /></td>



                  </React.Fragment>}
              </tr>);
          })}
        </tbody>
      </table>
      </div>
      );
      
  }
}

const Value = ({ coins, price }) => {
  const isMobile = window.screen.width <= 560;
  const calulateFee = (val) => {
    if (val.includes('.')) {
      let splitNum = val?.split('.');
      return `${splitNum[0]}.${splitNum[1]?.slice(0, 4)}`;
    } else {
      return val;
    }
  }
  return (
    <React.Fragment>

      {/* <div className="currency pando">
        {calulateFee((String(coins.PTXWei / 1000000000000000000)))}
        {!isMobile && " Pando"}

      </div> */}
      <div className="currency PTX">

        {isNaN(parseFloat(formatCoin(coins?.ptxwei))) ? 0 : formatCoin(coins?.ptxwei)}
        {!isMobile && "PTX"}

      </div>
    </React.Fragment>)
}
export default TransactionTable