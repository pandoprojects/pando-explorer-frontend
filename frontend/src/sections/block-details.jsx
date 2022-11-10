import React, { Component } from "react";
import { browserHistory, Link } from 'react-router';
import cx from 'classnames';

import { blocksService } from '../common/services/block';
import LinkButton from "../common/components/link-button";
import NotExist from '../common/components/not-exist';
import { BlockStatus, TxnTypeText, TxnClasses } from '../common/constants';
import { date, hash, prevBlock } from '../common/helpers/blocks';
import { formatCoin, priceCoin } from '../common/helpers/utils';
import { priceService } from '../common/services/price';
import LoadingPanel from '../common/components/loading-panel';
import { withTranslation } from "react-i18next";
class BlocksExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.route.backendAddress,
      block: null,
      totalBlocksNumber: undefined,
      errorType: null,
      price: {},
      loading: true
    };
  }
  componentWillUpdate(nextProps) {
    if (nextProps.params.blockHeight !== this.props.params.blockHeight) {
      this.getOneBlockByHeight(nextProps.params.blockHeight);
    }
  }
  componentDidMount() {
    const { blockHeight } = this.props.params;
    this.getOneBlockByHeight(blockHeight);
    this.getPrices();
  }
  getOneBlockByHeight(height) {
    const { totalBlocksNumber } = this.state;
    const msg = this.props.location.state;
    if (Number(height)
      && (totalBlocksNumber === undefined
        || totalBlocksNumber >= height
        || height > 0)) {
      this.setState({ loading: true });

      blocksService.getBlockByHeight(height)
        .then(res => {
          switch (res.data.type) {
            case 'block':
              this.setState({
                block: res.data.body,
                totalBlocksNumber: res.data.totalBlocksNumber,
                errorType: null,
                loading: false
              });
              break;
            case 'error_not_found':
              this.setState({
                errorType: msg ? 'error_coming_soon' : 'error_not_found'
              });
          }
        }).catch(err => {
        })
    } else {
      this.setState({
        errorType: 'error_not_found'
      });

    }
  }
  renderNoMoreMsg() {
    return (
      <div className="th-explorer__buttons--no-more">No More</div>
    )
  }
  getPrices() {
    priceService.getAllprices()
      .then(res => {
        const prices = _.get(res, 'data.body');
        prices.forEach(info => {
          switch (info._id) {
            case 'PANDO':
              this.setState({ price: { ...this.state.price, 'Pando': info.price } })
              return;
            case 'PTX':
              this.setState({ price: { ...this.state.price, 'TFuel': info.price } })
              return;
            default:
              return;
          }
        })
      })
      .catch(err => {

      });
    setTimeout(() => {
      let { price } = this.state;
      if (!price.Pando) {
        this.getPrices();
      }
    }, 500000);
  }
  render() {
    const { t } = this.props
    const { block, totalBlocksNumber, errorType, price } = this.state;
    const height = Number(this.props.params.blockHeight);
    const hasNext = totalBlocksNumber > height;
    const hasPrev = height > 1;
    const isCheckPoint = block && (block.total_voted_guardian_stakes != undefined);
    return (

      <div className="content block-details">
        <div class="explore-1 mb-5">

          <div className="searchContainer">
            <input type="text" className="search-input nwe1" placeholder={`${t('SEARCH')}`} ref={input => this.searchInput = input} onKeyPress={e => this.handleEnterKey(e)} />
            <div className="search-select">
              <i class="fa fa-angle-down" aria-hidden="true"></i>
              <select ref={option => this.searchType = option} onChange={(e) => this.clearSearchBox()}  >

                <option value="address">{t('ADDRESS')}</option>
                <option value="block">{t('BLOCK_HEIGHT')}</option>
                <option value="transaction">{t('TRANSACTION')}</option>
              </select>

            </div>

          </div>
        </div>
        <div className="page-title blocks"><img src="../images/icons/Icon awesome-boxes.svg" className="mr-2" />{t(`BLOCK_DETAILS`)}</div>
        {errorType === 'error_not_found' &&
          <NotExist />}
        {errorType === 'error_coming_soon' &&
          <NotExist msg="This block information is coming soon." />}
        {block && !errorType &&
          <React.Fragment>
            {this.state.loading ?
              <LoadingPanel />
              :
              <div>
                <div className="txt-de2">
                  <table className="txn-info details">
                    <tbody className={cx({ 'cp': isCheckPoint })}>
                      <tr>
                        <th>{t(`HEIGHT`)}</th>
                        <td>{height}</td>
                      </tr>
                      <tr>
                        <th>{t(`Status`)}</th>
                        <td>{BlockStatus[block.status]}</td>
                      </tr>
                      <tr>
                        <th>{t(`TIMESTAMP`)}</th>
                        <td>{date(block)}</td>
                      </tr>
                      <tr>
                        <th>{t(`HASH`)}</th>
                        <td>{hash(block)}</td>
                      </tr>
                      <tr>
                        <th># {t(`TRANSACTIONS`)}</th>
                        <td>{block.num_txs}</td>
                      </tr>
                      {isCheckPoint && <tr>
                        <th className="cp"># {t(`VOTED_METATRON_STAKES`)}</th>
                        <td>
                          <div className="currency PandoWei left">{formatCoin(block.total_voted_guardian_stakes)} {t(`Pando`)}</div>
                          <div className='price'>&nbsp;{`[\$${priceCoin(block.total_voted_guardian_stakes)} USD]`}</div>
                        </td>
                      </tr>}
                      {isCheckPoint && <tr>
                        <th className="cp"># {t(`DEPOSITED_METATRON_STAKES`)}</th>
                        <td>
                          <div className="currency PandoWei left">{formatCoin(block.total_deposited_guardian_stakes)} {t(`Pando`)}</div>
                          <div className='price'>&nbsp;{`[\$${priceCoin(block.total_deposited_guardian_stakes)} USD]`}</div>
                        </td>
                      </tr>}
                      <tr>
                        <th>{t(`PROPOSER`)}</th>
                        <td>{<Link to={`/account/${block.proposer}`}>{block.proposer}</Link>}</td>
                      </tr>
                      <tr>
                        <th>{t(`STATE_HASH`)}</th>
                        <td>{block.state_hash}</td>
                      </tr>
                      <tr>
                        <th>{t(`TXNS_HASH`)}</th>
                        <td>{block.transactions_hash}</td>
                      </tr>
                      <tr>
                        <th>{t(`PREVIOUS_BLOCK`)}</th>
                        <td>{<Link to={`/blocks/${height - 1}`}>{prevBlock(block)}</Link>}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h3>{t(`TRANSACTIONS`)}</h3>
                <div className="txt-de2 nh6">
                  <table className="data transactions">
                    <tbody>
                      {_.map(block.txs, (t, i) => <Transaction t={t} key={i} txn={t} />)}
                    </tbody>
                  </table>
                </div>

                <div className="button-list split">
                  {hasPrev &&
                    <Link className="btn icon prev" to={`/blocks/${height - 1}`}><i /></Link>}
                  {hasNext &&
                    <Link className="btn icon next" to={`/blocks/${height + 1}`}><i /></Link>}
                </div>
              </div>
            }

          </React.Fragment>}
      </div>);
  }
}

const Transaction = ({ txn }) => {
  let { hash, type } = txn;
  return (
    <tr className="block-txn">
      <td className={cx("txn-type hrt5", TxnClasses[type])}>{TxnTypeText[type]}</td>
      <td className="hash overflow"><Link to={`/txs/${hash}`}>{hash}</Link></td>
    </tr>)
}
export default withTranslation()(BlocksExplorer)



