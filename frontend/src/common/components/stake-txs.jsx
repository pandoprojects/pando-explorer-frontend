import React, { Component } from "react";
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';
import cx from 'classnames';

import { formatCoin, sumCoin, priceCoin } from '../../common/helpers/utils';
import { hash } from '../../common/helpers/transactions';
import { TxnTypeText, TxnClasses } from '../../common/constants';
import { withTranslation } from "react-i18next";
const TRUNC = 2;


class StakeTxsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.backendAddress,
      type: this.props.type,
      transactions: this.props.txs.slice(0, TRUNC),
      isSliced: true
    };
  }
  static defaultProps = {
    includeDetails: true,
    truncate: window.screen.width <= 560 ? 10 : 35,
  }
  componentWillUpdate(nextProps) {
    if (nextProps.txs !== this.props.txs) {
      this.setState({ transactions: nextProps.txs.slice(0, TRUNC), isSliced: true })
    }
  }
  toggleList() {
    if (this.state.isSliced) {
      this.setState({ transactions: this.props.txs, isSliced: false })
    } else {
      this.setState({ transactions: this.props.txs.slice(0, TRUNC), isSliced: true })
    }
  }

  render() {
    const { txs, type, className, truncate, price, t } = this.props;
    const { transactions, isSliced } = this.state;
    let sum = txs.reduce((sum, tx) => { return sumCoin(sum, tx.amount) }, 0);
    return (
     
        <div className="stakes">
          <div className="title">
            <p><img src="../images/PTX LOGO.svg" className="sifr-img" /> {type === 'source' ? `${t('TOKENS_STAKED_BY_THIS_ADDRESS')}` : `${t('TOKENS_STAKED_TO_THIS_NODE')}`}</p>
            </div>
          <div className="txt-de2">
          <table className={cx("data txn-table2", className)}>
            <thead>
              <tr>
                <th className="node-type"><p>{t(`NODE_TYPE`)}</p></th>
                {type === 'source' && <th className="token left"><p>{t(`TOKENS_STAKED`)}</p></th>}
                <th className="address"><p>{type === 'source' ? `${t(`TO_NODE`)}` : `${t(`FROM_ADDRESS`)}`}</p></th>
                {/* <th className="txn">STAKING TX</th> */}
                <th className="status"><p>{t(`STATUS`)}</p></th>
                {type !== 'source' && <th className="token for45"><p>{t(`TOKENS_STAKED`)}</p></th>}
              </tr>
            </thead>
            <tbody className="stake-tb">
              {_.map(transactions, record => {
                const address = type === 'holder' ? record.source : record.holder;
                return (
                  <tr key={record._id}>
                    <td className={cx("node-type", record.type)}><div className="hbd5">
                      {record.type === 'vcp' &&
                      `${t(`ZYTATRON`)}`
                }
                {
                  record.type === 'gcp' &&
                    `${t(`METATRON`)}`
                }
                {
                  record.type === 'rametronenterprisep' &&
                    `${t(`RAMETRON`)}`
                }
                </div>
                      </td>
                    {type === 'source' && <td className="token left"><div className="currency PandoWei left">{formatCoin(record.amount)} </div></td>}
                    <td className="address"><Link to={`/account/${address}`}>{_.truncate(address, { length: truncate })}</Link></td>
                    {/* <td className="txn"><Link to={`/txs/${record.txn}`}>{hash(record, truncate)}</Link></td> */}
                    <td className="status">{record.withdrawn ? 'Pending Withdrawal' : 'Staked'}</td>
                    {type !== 'source' && <td className="token"><div className="currency PandoWei">{formatCoin(record.amount)} {window.screen.width <= 560 ? '' : 'PTX'}</div></td>}
                  </tr>);
              })}
              {txs.length > TRUNC &&
                <tr>
                  <td className="arrow-container" colSpan='4' onClick={this.toggleList.bind(this)}>
                    {t(`VIEW`)} {isSliced ? `${t(`MORE`)}` : `${t(`LESS`)}`}
                  </td>
                </tr>
              }
              <tr><td className="empty"></td></tr>
              <tr>
                <td></td>
                <td className={cx("token", { 'left': type === 'source' })} colSpan='3'>
                  <div className={cx("currency PTXWei", { 'left': type === 'source' })}>{formatCoin(sum)} PTX </div>
                  {/* {type === 'source' && <div className='price'>&nbsp;{`[\$${priceCoin(sum, price['Pando'])} USD]`}</div>} */}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>);
      
  }
}
export default withTranslation()(StakeTxsTable)



