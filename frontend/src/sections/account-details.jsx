import React, { Component, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { Link } from 'react-router';
import _ from 'lodash';
import get from 'lodash/get';
import cx from 'classnames';

import { formatCoin, priceCoin, getPando } from '../common/helpers/utils';
import { CurrencyLabels } from '../common/constants';
import { accountService } from '../common/services/account';
import { transactionsService } from '../common/services/transaction';
import { stakeService } from '../common/services/stake';
import { priceService } from '../common/services/price';
import TransactionTable from "../common/components/transactions-table";
import TokenTxsTable from "../common/components/token-txs-table";
import Pagination from "../common/components/pagination";
import NotExist from '../common/components/not-exist';
import DetailsRow from '../common/components/details-row';
import LoadingPanel from '../common/components/loading-panel';
import StakeTxsTable from "../common/components/stake-txs";
import SmartContract from '../common/components/smart-contract';
import RametronTransactionTable from "../common/components/rametron-transactions-table";
import { withTranslation } from "react-i18next";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { tokenService } from "../common/services/token";
import { useIsMountedRef } from '../common/helpers/hooks';
import { arrayUnique } from "../common/helpers/tns";
import tns from "../libs/tns";

const NUM_TRANSACTIONS = 20;
const today = new Date().toISOString().split("T")[0];
let scrollTimes = 0;
let maxScrollTimes = 1;


class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.getEmptyAccount(this.props.params.accountAddress),
      hasPNC721: false,
      hasPNC20: false,
      hasInternalTxs: false,
      transactions: null,
      currentPage: 1,
      totalPages: null,
      errorType: null,
      loading_acct: false,
      loading_txns: false,
      loading_txns1: false,
      includeService: false,
      hasOtherTxs: true,
      hasStakes: false,
      hasDownloadTx: false,
      hasStartDateErr: false,
      hasEndDateErr: false,
      price: { 'Pando': 0, 'Pando': 0 },
      isDownloading: false,
      rametronStake: null,
      overallBalance: 0,
      totalRametronStake: 0,
      type: [],
      actgivetabs:'coinbase'

      // rameSourceTxs: null,
    };
    this.downloadTrasanctionHistory = this.downloadTrasanctionHistory.bind(this);
    this.download = React.createRef();
    this.startDate = React.createRef();
    this.actgivetabs = React.createRef();
    this.endDate = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.resetInput = this.resetInput.bind(this);
    this.changeType = this.changeType.bind(this);
  }
  static defaultProps = {
    includeDetails: true,
    truncate: window.screen.width <= 560 ? 10 : 35,
  }
  getEmptyAccount(address) {
    return {
      address: address.toLowerCase(),
      balance: { pandowei: 0, ptxwei: 0 },
      sequence: 0,
      reserved_funds: [],
      txs_counter: {}
    }
  }
  componentWillUpdate(nextProps) {
    if (nextProps.params.accountAddress !== this.props.params.accountAddress) {
      this.setState({ hasOtherTxs: true, includeService: false })
      this.fetchData(nextProps.params.accountAddress);
    }
  }

  componentDidUpdate(preProps, preState) {
    if (preProps.params.accountAddress !== this.props.params.accountAddress) {
      this.setState({
        hasOtherTxs: true,
        includeService: false,
        rewardSplit: 0,
        beneficiary: "",
        tabIndex: 0,
        hasToken: false,
        hasPNC20: false,
        hasPNC721: false,
        // tokenBalance: INITIAL_TOKEN_BALANCE // to fetch the token balance
      })
      this.fetchData(this.props.params.accountAddress);
    }
    if (preState.account !== this.state.account
      || preState.transactions !== this.state.transactions
      || preState.hasInternalTxs !== this.state.hasInternalTxs
      || preState.hasPNC20 !== this.state.hasPNC20
      || preState.hasPNC721 !== this.state.hasPNC721) {
      let tabNames = [];
      const { transactions, account, hasInternalTxs, hasPNC20, hasPNC721 } = this.state;
      if (transactions && transactions.length > 0) {
        tabNames.push('Transactions');
      }
      if (account.code && account.code !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470') {
        tabNames.push('Contract');
      }
      if (hasInternalTxs) {
        tabNames.push('InternalTxns')
      }
      if (hasPNC20) {
        tabNames.push('PNC20TokenTxns');
      }
      if (hasPNC721) {
        tabNames.push('PNC721TokenTxns')
      }
      let tabName = this.props.location.hash.replace("#", "").split('-')[0];

      let tabIndex = tabNames.indexOf(tabName) === -1 ? 0 : tabNames.indexOf(tabName);
      if (tabName) {
        maxScrollTimes++;
      } else {
        maxScrollTimes = 0;
      }
      this.handleHashScroll();
      this.setState({ tabNames, tabIndex });
    }
  }

  componentDidMount() {
    const { accountAddress } = this.props.params;

    this.fetchData(accountAddress);

  }
  fetchData(address) {
    this.getOneAccountByAddress(address);
    this.getTransactionsByAddress(address);
    this.getStakeTransactions(address);
    // this.getRametronStakeTransactions(address);
    this.overallBalance(address)
    // this.rameOnlyTotalStake(address)
    // this.getPrices();
    this.getTokenTransactionsNumber(address)
    // this.rameSourceTxs(address)
  }

  // rameSourceTxs(address) {
  //   stakeService.rameSourceTxs(address).then((res) => {
  //     this.setState({ rameSourceTxs: res.data })
  //   })
  // }

  overallBalance(address) {
    this.setState({ loading_txns1: true });
    stakeService.overallBalance(address).then((res) => {

      if (res.body && res.body.balance) {
        if (res.body.balance.ptxwei > 0) {
          this.setState({ overallBalance: formatCoin(res.body.balance.ptxwei) })
        }
        else {
          this.setState({ overallBalance: 0 })
        }
      }
      else {
        this.setState({ overallBalance: 0 })
      }
      this.setState({ loading_txns1: false });

    }).catch(err => {
      this.setState({ overallBalance: 0 })
    })
  }


  getStakeTransactions(address) {
    if (!address) {
      return;
    }
    stakeService.getStakeByAddress(address)
      .then(res => {
        const stakes = _.get(res, 'data.body');
        this.setState({
          holderTxs: stakes.holderRecords,
          sourceTxs: stakes.sourceRecords,
          hasStakes: stakes.holderRecords.length + stakes.sourceRecords.length > 0
        })
      })
      .catch(err => {

      });
  }



  getTransactionsByAddress(address, page = 1, types = ["0"]) {
    if (!address) {
      return;
    }
    this.setState({ loading_txns: true });
    this.setState({ hasOtherTxs: false, currentPage: 1, totalPages: null, transactions: [] })
    console.log(address, page, types)
    transactionsService.getTransactionsByAddress(address, page, types)
      .then(res => {
        const txs = _.get(res, 'data.body');

        if (!txs) {
          this.setState({ hasOtherTxs: false, currentPage: 1, totalPages: null, transactions: [] })
          return
        }
        if (txs.length !== 0) {
          this.setState({
            transactions: _.get(res, 'data.body'),
            currentPage: _.get(res, 'data.currentPageNumber'),
            totalPages: _.get(res, 'data.totalPageNumber'),
            loading_txns: false,
          })
        } else {
          this.setState({ loading_txns: false });
          this.setState({ hasOtherTxs: false })
          // this.handleToggleHideTxn();
        }

      }
      )
      .catch(err => {
        this.setState({ loading_txns: false });

      });
  }

  getTokenTransactionsNumber(address) {
    const tokenList = ["PNC-721", "PNC-20", "PTX"];
    const self = this;
    for (let name of tokenList) {
      tokenService.getTokenTxsNumByAccountAndType(address, name)
        .then(res => {
          // if (!self._isMounted) return;
          const num = get(res, 'data.body.total_number');
          if (num > 0) {
            if (name === 'PNC-721') {
              this.setState({ hasPNC721: true });
            } else if (name === 'PNC-20') {
              this.setState({ hasPNC20: true });
            } else if (name === 'PTX') {
              this.setState({ hasInternalTxs: true });
            }
          }
        })
    }
  }

  getOneAccountByAddress(address) {
    if (!address) {
      return;
    }

    this.setState({ loading_acct: true });
    accountService.getOneAccountByAddress(address)
      .then(res => {
        switch (res.data.type) {
          case 'account':
            this.setState({
              account: res.data.body,
              errorType: null
            })
            break;
          case 'error_not_found':
            break;
          default:
            break;
        }
        this.setState({
          loading_acct: false, hasDownloadTx: (res.data.body.txs_counter[0]
            || res.data.body.txs_counter[2] || res.data.body.txs_counter[5]) !== undefined
        });
      }).catch(err => {
        this.setState({ loading_acct: false });
        this.setState({ errorType: err.response.data.type })
      })
  }

  handlePageChange = pageNumber => {
    let { accountAddress } = this.props.params;
    let { includeService } = this.state;
    this.getTransactionsByAddress(accountAddress, pageNumber);
  }

  handleToggleHideTxn = () => {
    let { accountAddress } = this.props.params;
    let includeService = !this.state.includeService;
    this.setState({
      includeService,
      currentPage: 1,
      totalPages: null,
    });
    this.getTransactionsByAddress(accountAddress, 1);
  }

  downloadTrasanctionHistory() {
    const { accountAddress } = this.props.params;
    const startDate = (new Date(this.startDate.value).getTime() / 1000).toString();
    const endDate = (new Date(this.endDate.value).getTime() / 1000).toString();
    let hasStartDateErr = false, hasEndDateErr = false;
    if (this.startDate.value === '' || this.endDate.value === '') {
      if (this.startDate.value === '') hasStartDateErr = true;
      if (this.endDate.value === '') hasEndDateErr = true;
      this.setState({ hasStartDateErr, hasEndDateErr })
      return
    }
    this.setState({ isDownloading: true })
    accountService.getTransactionHistory(accountAddress, startDate, endDate)
      .then(res => {
        if (res.status === 200) {
          function convertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
            var line = '';
            for (var index in array[0]) {
              if (line != '') line += ','
              line += index;
            }
            str += line + '\r\n';
            for (var i = 0; i < array.length; i++) {
              var line = '';
              for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
              }

              str += line + '\r\n';
            }
            return str;
          }
          var json = JSON.stringify(res.data.body);
          var csv = convertToCSV(json);
          var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          // var blob = new Blob([json], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          this.download.current.download = 'transactions.csv';
          this.download.current.href = url;
          this.download.current.click();
          this.setState({ isDownloading: false })
        }
      });
  }
  handleInput(type) {
    if (type === 'start') {
      let date = new Date(this.startDate.value)
      date.setDate(date.getDate() + 7);
      this.endDate.min = this.startDate.value;
      let newDate = this.getDate(date);
      this.endDate.max = newDate < today ? newDate : today;
    } else if (type === 'end') {
      let date = new Date(this.endDate.value)
      date.setDate(date.getDate() - 7);
      this.startDate.max = this.endDate.value;
      this.startDate.min = this.getDate(date);
    }
    if (type === 'start' && !this.hasStartDateErr) this.setState({ hasStartDateErr: false })
    if (type === 'end' && !this.hasEndDateErr) this.setState({ hasEndDateErr: false })
  }
  getDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return year + '-' + month + '-' + day;
  }
  resetInput() {
    this.startDate.value = '';
    this.startDate.max = today;
    this.startDate.min = '';
    this.endDate.value = '';
    this.endDate.max = today;
    this.endDate.min = '';
  }
  calulateFee = (val) => {
    if (val.includes('.')) {
      let splitNum = val?.split('.');
      return `${splitNum[0]}.${splitNum[1]?.slice(0, 4)}`;
    } else {
      return val;
    }
  }
  changeType(type) {
    console.log(type)
    this.setState({actgivetabs:type})
    if (type == 'coinbase') {
      this.getTransactionsByAddress(this.state.account.address, 1, ["0"])
    }
    else if (type == 'transfer') {
      this.getTransactionsByAddress(this.state.account.address, 1, ["2","5"])
    }
    else if (type == 'stake') {
      this.getTransactionsByAddress(this.state.account.address, 1, ["8","9","10","11"])

    }
    else {
      this.getTransactionsByAddress(this.state.account.address, 1, ["7"])

    }
  }

  handleHashScroll = () => {
    let tabName = this.props.location.hash.replace("#", "").split('-')[0];
    if (tabName && this.tabRef && scrollTimes < maxScrollTimes) {
      setTimeout(() => this.tabRef.scrollIntoView({ behavior: "smooth" }));
      scrollTimes++;
    }
  }

  render() {
    const { t, truncate } = this.props
    const { account, transactions, currentPage, totalPages, errorType, loading_txns, loading_txns1,
      includeService, hasOtherTxs, hasStakes, holderTxs, hasDownloadTx, sourceTxs,
      price, hasStartDateErr, hasEndDateErr, isDownloading, rametronStake, rameSourceTxs, hasPNC20, hasPNC721, hasToken, hasInternalTxs, actgivetabs } = this.state;

    return (
      <div className="content account">
        <div className="page-title account"><p className="ac-det"><img src="../images/Group 718.svg" className="sifr-img mr-2" />{t(`ACCOUNT_DETAIL`)}</p></div>
        {errorType === 'invalid_address' &&
          < NotExist msg={t(`INVALID_ADDRESS`)} t={t} />}
        {account && !errorType &&
          <React.Fragment>
            <div className="txt-de2">
            <table className="details account-info">
              <thead>
                <tr key={1}>
                  <th>{t(`ADDRESS`)}</th>
                  <th><span className="vilot">{account.address}</span></th>
                </tr>
              </thead>
              <tbody>
                {this.state.loading_txns1 ? <span style={{ marginLeft: '10px' }}>{t(`LOADING`)}</span> :
                  <DetailsRow label="Wallet Balance" data={`${this.state.overallBalance} PTX`} />
                  // <DetailsRow label="Overall Balance" data={<Balance balance={account.balance} price={price} />} />
                }


                <DetailsRow label="Sequence" data={account.sequence} />
              </tbody>
            </table>
            </div>
          </React.Fragment>}
        {hasStakes &&
          <div className="stake-container">
            {sourceTxs.length > 0 && <StakeTxsTable type='source' txs={sourceTxs} price={price} />}
            {holderTxs.length > 0 && <StakeTxsTable type='holder' txs={holderTxs} price={price} />}
          </div>
        }



       <div className="fhg54-tb">
        <Tabs>
          <TabList>
            <Tab className="juh6"> <div className="title"><p><img src="../images/Group503.svg" />Transactions <button className="btn btn-success custom-btn trans-54" onClick={() => this.test(this.state.currentPageNumber)} title="Refresh" ><img src="/images/Layer 2.svg" alt="" /></button></p></div></Tab>

            {account.code && account.code !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' &&
              <Tab>Contract</Tab>
            }
            {hasInternalTxs && <Tab>Internal Txns</Tab>}
            {hasPNC20 && <Tab>PNC-20 Token Txns</Tab>}
            {hasPNC721 && <Tab>PNC-721 Token Txns</Tab>}
          </TabList>
           <TabPanel>


            {
              loading_txns ? <LoadingPanel className="fill" /> :
              
                <React.Fragment>



                  
                  <div>
                  
                    {loading_txns &&
                      <LoadingPanel className="fill" />}
                    <div className="customtansaciton">
                      <button className={actgivetabs === 'coinbase' ? 'active' : ''} onClick={() => this.changeType('coinbase')}>Coinbase/Rewards</button>
                      <button className={actgivetabs === 'transfer' ? 'active' : ''} onClick={() => this.changeType('transfer')}>Transfer</button>
                      <button className={actgivetabs === 'stake' ? 'active' : ''} onClick={() => this.changeType('stake')}>Stake</button>
                      <button className={actgivetabs === 'contract' ? 'active' : ''} onClick={() => this.changeType('contract')}>Smart Contract</button>
                    </div>
                    <div className="actions">
                    {hasDownloadTx && <Popup trigger={<button className="download btn tx export">{t(`EXPORT_TRANSACTION_HISTORY`)}</button>} position="right center">
                      <div className="popup-row header">{t(`CHOOSE_THE_TIME_PERIOD`)}</div>
                      <div className="popup-row">
                        <div className="popup-label">{t(`START_DATE`)}</div>
                        <input className="popup-input" type="date" ref={input => this.startDate = input} onChange={() => this.handleInput('start')} max={today}></input>
                      </div>
                      <div className={cx("popup-row err-msg", { 'disable': !hasStartDateErr })}>{t(`INPUT_VALID_START_DATE`)}</div>
                      <div className="popup-row">
                        <div className="popup-label"> {t(`END_DATE`)}</div>
                        <input className="popup-input" type="date" ref={input => this.endDate = input} onChange={() => this.handleInput('end')} max={today}></input>
                      </div>
                      <div className={cx("popup-row err-msg", { 'disable': !hasEndDateErr })}>{t(`INPUT_VALID_END_DATE`)}</div>
                      <div className="popup-row buttons">
                        <div className={cx("popup-reset", { disable: isDownloading })} onClick={this.resetInput}>{t(`RESET`)}</div>
                        <div className={cx("popup-download export", { disable: isDownloading })} onClick={this.downloadTrasanctionHistory}>{t(`DOWNLOAD`)}</div>
                        <div className={cx("popup-downloading", { disable: !isDownloading })}>{t(`DOWNLOADING`)}</div>
                      </div>
                    </Popup>}
                    <a ref={this.download}></a>



                  </div>
                    <TransactionTable t={t} transactions={transactions} account={account} price={price} />
                  </div>
                  <Pagination
                    size={'lg'}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                    disabled={loading_txns} />
                </React.Fragment>

            }
          </TabPanel>


          {account.code &&


            account.code !== '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' &&
            <TabPanel>
              <SmartContract address={account.address} handleHashScroll={this.handleHashScroll} urlHash={location.hash} />
            </TabPanel>
          }
          {hasInternalTxs && <TabPanel>
            <TokenTab type="PTX" address={account.address} handleHashScroll={this.handleHashScroll} />
          </TabPanel>}
          {hasPNC20 && <TabPanel>
            <TokenTab type="PNC-20" address={account.address} handleHashScroll={this.handleHashScroll} />
          </TabPanel>}
          {hasPNC721 && <TabPanel>
            <TokenTab type="PNC-721" address={account.address} handleHashScroll={this.handleHashScroll} />
          </TabPanel>}
        </Tabs>
        </div>
      </div >);
  }
}

const Balance = ({ balance, price }) => {
  return (
    <div className="act balance">
      {_.map(balance, (v, k) => <div key={k} className={cx("currency", k)}>
        {`${calulateFee(v / 1000000000000000000)} ${CurrencyLabels[k] || k}`}
        {/* <div className='price'>{`[\$${priceCoin(v, price[CurrencyLabels[k]])} USD]`}</div> */}
      </div>)}
    </div>)
}

const calulateFee = (val) => {
  return val.toFixed(4)
  // if (val.includes('.')) {
  //   let splitNum = val?.split('.');
  //   return `${splitNum[0]}.${splitNum[1]?.slice(0, 4)}`;
  // } else {
  //   return val;
  // }
}

const Address = ({ hash }) => {
  return (<Link to={`/account/${hash}`} target="_blank">{hash}</Link>)
}

const HashList = ({ hashes }) => {
  return (
    <React.Fragment>
      {_.map(_.compact(hashes), (hash, i) => <div key={i}><Link key={hash} to={`/txs/${hash.toLowerCase()}`}>{hash.toLowerCase()}</Link></div>)}
    </React.Fragment>
  )
}

const TokenTab = props => {
  const { type, address, handleHashScroll } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingTxns, setLoadingTxns] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [tokenMap, setTokenMap] = useState({});
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    fetchTokenTransactions(address, type, currentPage);
  }, [type, address])

  const handlePageChange = pageNumber => {
    fetchTokenTransactions(address, type, pageNumber);
  }

  const setTokensTNS = async (transactions) => {
    const uniqueAddresses = arrayUnique(
      transactions.map((x) => x.from)
        .concat(transactions.map((x) => x.to))
    );
    const domainNames = await tns.getDomainNames(uniqueAddresses);
    transactions.map((transaction) => {
      // transaction.fromTns = transaction.from ? domainNames[transaction.from] : null;
      // transaction.toTns = transaction.to ? domainNames[transaction.to] : null;
      transaction.fromTns = transaction.from;
      transaction.toTns = transaction.to;
    });

    if (!isMountedRef.current) return;
    setTransactions(transactions);
  }


  const fetchTokenTransactions = (address, type, page) => {
    tokenService.getTokenTxsByAccountAndType(address, type, page, NUM_TRANSACTIONS)
      .then(res => {
        if (!isMountedRef.current) return;
        let txs = res.data.body;
        txs = txs.sort((a, b) => b.timestamp - a.timestamp);
        setTotalPages(res.data.totalPageNumber);
        setCurrentPage(res.data.currentPageNumber);
        setLoadingTxns(false);
        setTokensTNS(txs);
        let addressSet = new Set();
        txs.forEach(tx => {
          if (tx.contract_address) {
            addressSet.add(tx.contract_address);
          }
        })
        if (addressSet.size === 0) {
          return;
        }
        tokenService.getTokenInfoByAddressList([...addressSet])
          .then(res => {
            if (!isMountedRef.current) return;
            let infoList = get(res, 'data.body') || [];
            let map = {};
            infoList.forEach(info => {
              map[info.contract_address] = {
                name: info.name,
                decimals: info.decimals
              }
            })
            setTokenMap(map);
          })
          .catch(e => console.log(e.message))
      })
      .catch(e => {
        setLoadingTxns(false);
      })
  }

  return <>
    <div>
      {loadingTxns &&
        <LoadingPanel className="fill" />}
      {!loadingTxns && <TokenTxsTable transactions={transactions} type={type} address={address} tokenMap={tokenMap} handleHashScroll={handleHashScroll} />}
    </div>
    <Pagination
      size={'lg'}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      disabled={loadingTxns} />
  </>
}

export default withTranslation()(AccountDetails)
