import React, { Component } from "react";
import { Link } from "react-router";
import cx from "classnames";
import { BigNumber } from "bignumber.js";
import _truncate from "lodash/truncate";

import {
  TxnTypes,
  TxnTypeText,
  TxnClasses,
  TxnPurpose,
  zeroTxAddress,
} from "../common/constants";
import {
  date,
  age,
  fee,
  status,
  type,
  gasPrice,
  from,
} from "../common/helpers/transactions";
import { formatCoin, priceCoin, getHex } from "../common/helpers/utils";
import { priceService } from "../common/services/price";
import { transactionsService } from "../common/services/transaction";
import NotExist from "../common/components/not-exist";
import DetailsRow from "../common/components/details-row";
import JsonView from "../common/components/json-view";
import BodyTag from "../common/components/body-tag";
import LoadingPanel from "../common/components/loading-panel";
import { withTranslation } from "react-i18next";

class TransactionExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backendAddress: this.props.route.backendAddress,
      transaction: null,
      totalTransactionsNumber: undefined,
      errorType: null,
      showRaw: false,
      price: { Pando: 0, TFuel: 0 },
      loading: true,
    };
  }
  componentWillUpdate(nextProps) {
    if (
      nextProps.params.transactionHash !== this.props.params.transactionHash
    ) {
      this.getOneTransactionByUuid(nextProps.params.transactionHash);
      this.getPrices();
    }
  }
  componentDidMount() {
    const { transactionHash } = this.props.params;
    this.getOneTransactionByUuid(transactionHash.toLowerCase());
    this.getPrices();
  }
  getPrices() {
    priceService
      .getAllprices()
      .then((res) => {
        const prices = _.get(res, "data.body");
        prices.forEach((info) => {
          switch (info._id) {
            case "PANDO":
              this.setState({
                price: { ...this.state.price, Pando: info.price },
              });
              return;
            case "PTX":
              this.setState({
                price: { ...this.state.price, TFuel: info.price },
              });
              return;
            default:
              return;
          }
        });
      })
      .catch((err) => { });
    setTimeout(() => {
      let { price } = this.state;
      if (!price.Pando || !price.TFuel) {
        this.getPrices();
      }
    }, 500000);
  }
  getOneTransactionByUuid(hash) {
    if (hash) {
      this.setState({ loading: true });

      transactionsService
        .getOneTransactionByUuid(hash.toLowerCase())
        .then((res) => {
          switch (res.data.type) {
            case "transaction":
              this.setState({
                transaction: res.data.body,
                totalTransactionsNumber: res.data.totalTxsNumber,
                errorType: null,
                loading: false,
              });
              break;
            case "error_not_found":
              this.setState({
                errorType: "error_not_found",
              });
          }
        })
        .catch((err) => {
          this.setState({
            errorType: "error_not_found",
          });
        });
    } else {
      this.setState({
        errorType: "error_not_found",
      });
    }
  }
  handleToggleDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showRaw: !this.state.showRaw });
  };
  render() {
    const { transactionHash } = this.props.params;
    const { transaction, errorType, showRaw, price } = this.state;
    const { t } = this.props;
    return (
      <div className="content transaction-details" style={{ textAlign: 'center' }}>
        {/* search section */}
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
        <h3> <img src="../images/Group 503.svg" alt="" srcset="" /> TRANSACTION DETAILS</h3>
        <div className="page-title transactions">
          <BodyTag className={cx({ "show-modal": showRaw })} />
          {errorType && <NotExist />}
          {transaction && errorType === null && (
            <React.Fragment>
              {this.state.loading ? (
                <LoadingPanel />
              ) : (
                <>
                  <div className="txt-de2">
                    <table className="details txn-info table">
                      <thead>
                        <tr>
                          <th># {t(`HASH`)}</th>
                          <th>
                           <span className="vilot"> {transaction.hash} </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction.eth_tx_hash !== zeroTxAddress &&
                          transaction.eth_tx_hash != null && (
                            <tr>
                              <th>Eth Hash</th>
                              <td>
                                <Link to={`/txs/${transaction.eth_tx_hash}`}>
                                  {transaction.eth_tx_hash}
                                </Link>
                              </td>
                            </tr>
                          )}
                        <tr>
                          <th>{t(`TYPE`)}</th>
                          <td>
                            {type(transaction)}
                          </td>
                        </tr>
                        <tr>
                          <th>{t(`STATUS`)}</th>
                          <td>
                            {status(transaction)}
                          </td>
                        </tr>
                        <tr>
                          <th>{t(`BLOCK`)}</th>
                          <td>
                            <Link to={`/blocks/${transaction.block_height}`}>
                              {transaction.block_height}
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <th>
                            {t(`TIME`)}
                          </th>
                          <td
                            title={age(transaction)}>
                            {date(transaction)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>


                  <div className="details-header">
                    <div className={cx("txn-type", TxnClasses[transaction.type])}>
                      {type(transaction)}
                    </div>
                    <button
                      className="btn tx raw"
                      onClick={this.handleToggleDetailsClick}
                    >
                      {t(`VIEW_RAW_TXN`)}
                    </button>
                  </div>
                  {transaction.type === TxnTypes.COINBASE && (
                    <Coinbase transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.SLASH && (
                    <Slash transaction={transaction} />
                  )}

                  {transaction.type === TxnTypes.TRANSFER && (
                    <Send transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.RESERVE_FUND && (
                    <ReserveFund transaction={transaction} price={price} />
                  )}

                  {
                    transaction.type === TxnTypes.RELEASE_FUND && (
                      <ReserveFund transaction={transaction} price={price} />
                    )
                    // <ReleaseFund transaction={transaction} price={price} />
                  }

                  {transaction.type === TxnTypes.SERVICE_PAYMENT && (
                    <ServicePayment transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.SPLIT_CONTRACT && (
                    <SplitContract transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.SMART_CONTRACT && (
                    <SmartContract transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.WITHDRAW_STAKE && (
                    <WithdrawStake transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.DEPOSIT_STAKE && (
                    <DepositStake transaction={transaction} price={price} />
                  )}

                  {transaction.type === TxnTypes.DEPOSIT_STAKE_TX_V2 && (
                    <DepositStake transaction={transaction} price={price} />
                  )}
                  {transaction.type === TxnTypes.DEPOSIT_STAKE_TX_V3 && (
                    <DepositStake transaction={transaction} price={price} />
                  )}

                  {showRaw && (
                    <JsonView
                      json={transaction}
                      onClose={this.handleToggleDetailsClick}
                      className="tx-raw"
                    />
                  )}
                </>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
export default withTranslation()(TransactionExplorer);

function _getAddressShortHash(address) {
  return address.substring(12) + "...";
}

function _renderIds(ids) {
  return _.map(ids, (i) => <div key={i}>{i}</div>);
}

const Amount = ({ coins, price }) => {
  return (
    <React.Fragment>
      {/* <div className="currency pando">
        {formatCoin(coins.PandoWei)} PTX
        <div className='price'>{`\$${priceCoin(coins.PandoWei)}`}</div>
        <div></div>
      </div> */}
      <div className="currency PTX">
        {formatCoin(coins?.ptxwei)} PTX
        <div className="price">{`\$${priceCoin(coins?.ptxwei)}`}</div>
      </div>
    </React.Fragment>
  );
};

const Address = ({ hash, truncate = null }) => {
  return (
    <Link to={`/account/${hash}`}>
      {truncate ? _.truncate(hash, { length: truncate }) : hash}
    </Link>
  );
};

const calulateFee = (val) => {
  if (val.includes(".")) {
    let splitNum = val?.split(".");
    if (splitNum[1].length > 10) {
      return `${splitNum[0]}.${splitNum[1]?.slice(0, 4)}`;
    } else {
      return val;
    }
  } else {
    return val;
  }
};

const Fee = ({ transaction }) => {
  return (
    <span className="currency PTX">
      {calulateFee(fee(transaction)) + " PTX"}
    </span>
  );
};

const CoinbaseOutput = ({ output, price }) => {
  const isPhone = window.screen.width <= 560;
  const isSmallPhone = window.screen.width <= 320;
  const truncate = isPhone ? (isSmallPhone ? 10 : 15) : null;
  return (
    <div className="coinbase-output">
      <div>
        <Amount coins={output?.coins} price={price} />
      </div>
      <Address hash={output?.address} truncate={truncate} />
    </div>
  );
};

const ServicePayment = ({ transaction, price }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label="Fee" data={<Fee transaction={transaction} />} />
        <DetailsRow
          label="From Address"
          data={<Address hash={data.source.address} />}
        />
        <DetailsRow
          label="To Address"
          data={<Address hash={data.target.address} />}
        />
        <DetailsRow
          label="Amount"
          data={<Amount coins={data.source.coins} price={price} />}
        />
        <DetailsRow label="Payment Sequence" data={data.payment_sequence} />
        <DetailsRow label="Reserve Sequence" data={data.reserve_sequence} />
        <DetailsRow label="Resource ID" data={data.resource_id} />
      </tbody>
    </table>
  );
};

const ReserveFund = ({ transaction, price }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label="Fee" data={<Fee transaction={transaction} />} />
        <DetailsRow
          label="From Address"
          data={<Address hash={data?.inputs[0]?.address} />}
        />
        <DetailsRow
          label="Amount"
          data={_.map(data.outputs, (output, i) => (
            <CoinbaseOutput key={i} output={output} price={price} />
          ))}
        />
      </tbody>
    </table>
  );
};

const ReleaseFund = ({ transaction }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody></tbody>
    </table>
  );
};

const SplitContract = ({ transaction }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label="Fee" data={<Fee transaction={transaction} />} />
        <DetailsRow label="Duration" data={data.duration} />
        <DetailsRow
          label="Initiator Address"
          data={<Address hash={data.initiator.address} />}
        />
        <DetailsRow label="Resource Id" data={data.resource_id} />
        <DetailsRow
          label="Splits"
          data={
            <div className="th-tx-text__split">
              {data.splits.map((split) => (
                <span key={split.Address}>
                  {"Address: " + split.Address + "  " + split.Percentage + "%"}
                </span>
              ))}
            </div>
          }
        />
      </tbody>
    </table>
  );
};

const Send = ({ transaction, price }) => {
  let { data } = transaction;
  return (
    <div className="txt-de2">
      <table className="details txn-details">
        <tbody>
          <DetailsRow label="Fee" data={<Fee transaction={transaction} />} />
          {data.inputs.length > 1 ? (
            <DetailsRow
              label="From Address"
              data={_.map(data.intputs, (input, i) => (
                <CoinbaseOutput key={i} output={input} price={price} />
              ))}
            />
          ) : (
            <DetailsRow
              label="From Address"
              data={<Address hash={data.inputs[0].address} />}
            />
          )}
          <DetailsRow
            label="Amount"
            data={_.map(data.outputs, (output, i) => (
              <CoinbaseOutput key={i} output={output} price={price} />
            ))}
          />
        </tbody>
      </table>
    </div>
  );
};

const Slash = ({ transaction }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow
          label="Proposer Address"
          data={<Address hash={data.proposer.address} />}
        />
        <DetailsRow label="Reserved Sequence" data={data.reserved_sequence} />
        <DetailsRow
          label="Slash Proof"
          data={data.slash_proof.substring(0, 12) + "......."}
        />
        <DetailsRow
          label="Slashed Address"
          data={<Address hash={data.slashed_address} />}
        />
      </tbody>
    </table>
  );
};

const Coinbase = ({ transaction, price }) => {
  let { data } = transaction;
  return (
    <div className="txt-de2">
      <table className="details txn-details 7">
        <tbody>
          <DetailsRow
            label="Proposer"
            data={<Address hash={_.get(data, "proposer.address")} />}
          ></DetailsRow>
          <DetailsRow
            label="Amount"
            data={_.map(data.outputs, (output, i) => (
              <CoinbaseOutput key={i} output={output} price={price} />
            ))}
          />
        </tbody>
      </table>
    </div>
  );
};

const WithdrawStake = ({ transaction, price }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label="Fee" data={<Fee transaction={transaction} />} />
        <DetailsRow
          label="Stake Addr."
          data={<Address hash={_.get(data, "holder.address")} />}
        />
        <DetailsRow
          label="Stake"
          data={<Amount coins={_.get(data, "source.coins")} price={price} />}
        />
        <DetailsRow label="Purpose" data={TxnPurpose[_.get(data, "purpose")]} />
        <DetailsRow
          label="Staker"
          data={<Address hash={_.get(data, "source.address")} />}
        />
      </tbody>
    </table>
  );
};

const DepositStake = ({ transaction, price }) => {
  let { data } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow label="Fee" data={<Fee transaction={transaction} />} />
        <DetailsRow
          label="Stake Addr."
          data={<Address hash={_.get(data, "holder.address")} />}
        />
        <DetailsRow
          label="Stake"
          data={<Amount coins={_.get(data, "source.coins")} price={price} />}
        />
        <DetailsRow label="Purpose" data={TxnPurpose[_.get(data, "purpose")]} />
        <DetailsRow
          label="Staker"
          data={<Address hash={_.get(data, "source.address")} />}
        />
      </tbody>
    </table>
  );
};

const SmartContract = ({ transaction }) => {
  let { data, receipt } = transaction;
  return (
    <table className="details txn-details">
      <tbody>
        <DetailsRow
          label="From Addr."
          data={<Address hash={_.get(data, "from.address")} />}
        />
        <DetailsRow
          label="To Addr."
          data={<Address hash={_.get(data, "to.address")} />}
        />
        <DetailsRow
          label="CONTRACT ADDRESS"
          data={<Address hash={_.get(receipt, "ContractAddress")} />}
        />
        <DetailsRow label="TOKENS TRANSFERRED" data={`From: ${_truncate(data.from.address, { length: 20 })} To: ${_truncate(data.to.address, { length: 20 })}`} />
        <DetailsRow label="Gas Limit" data={data.gas_limit} />
        <DetailsRow label="Gas Used" data={receipt.GasUsed} />
        <DetailsRow
          label="Gas Price"
          data={
            <span className="currency PTX">
              {gasPrice(transaction) * 1000000000000000000 + " PTX"}
            </span>
          }
        />
        <DetailsRow label="Data" data={getHex(data.data)} />
      </tbody>
    </table>
  );
};
