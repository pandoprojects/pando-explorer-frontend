import React from "react";
import get from 'lodash/get';
import cx from 'classnames';
import { browserHistory, Link } from "react-router";
import { formatNumber, formatCurrency, sumCoin, formatCoin } from '../../common/helpers/utils';
import { transactionsService } from '../../common/services/transaction';
import { stakeService } from '../../common/services/stake';
import { blocksService } from '../../common/services/block';
import PandoChart from '../../common/components/chart';
import BigNumber from 'bignumber.js';
import config from "../../config";

export default class TokenDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      blockNum: 0,
      txnNum: 0,
      totalStaked: 0,
      holders: [],
      percentage: [],
      txTs: [],
      txNumber: [],
      nodeNum: 0,
      rametronStake: null,
      metatronStake: null,
      zetatronStake: null,
      lbankPrince: 0,
      marketCap: 0,
      CirculatingSupply: 0
    };
    this.searchInput = React.createRef();
    this.searchType = React.createRef();
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount() {
    //this.marketCap();
    this.lbank();
   // this.circulatingSupply();
    this.getTransactionNumber();
    this.getBlockNumber();
    this.getTransactionHistory();
    this.getTotalStaked();
    this.getAllStakes();

  }
  handleSearch() {
    const value = this.searchInput.value;
    switch (this.searchType.value) {
      case "address":
        if (value !== "") {
          browserHistory.push(`/account/${value}`);
          this.searchInput.value = "";
        }
        break;
      case "block":
        browserHistory.push(`/blocks/${value}`);
        this.searchInput.value = "";
        break;
      case "transaction":
        browserHistory.push(`/txs/${value}`);
        this.searchInput.value = "";
        break;
      default:
        break;
    }
  }

  clearSearchBox = () => {
    if (this.searchInput.value) {
      this.searchInput.value = "";
    }
  };
  handleEnterKey(e) {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  }

  getTransactionHistory() {
    transactionsService.getTransactionHistory()
      .then(res => {
        const txHistory = get(res, 'data.body.data');
        let txTs = [];
        let txNumber = []
        txHistory.sort((a, b) => a.timestamp - b.timestamp).forEach(info => {
          txTs.push(new Date(info.timestamp * 1000));
          txNumber.push(info.number);
        })
        this.setState({ txTs, txNumber })
      })
      .catch(err => {

      });
  }
  getAllStakes() {
    stakeService.getAllStake()
      .then(res => {
        let metatronStakeTotal = 0;
        let zetatronStakeTotal = 0;
        let rametronStakeTotal = 0;
    
        const stakeList = get(res, 'data.body')
        const metatronStake = stakeList.filter((val) => val.type === 'gcp')
        const zetatronStake = stakeList.filter((val) => val.type === 'vcp')
        const rametronStake = stakeList.filter((val) => val.type === 'rametronenterprisep')
        metatronStake.map((val) => {
          metatronStakeTotal = Number(metatronStakeTotal + Number(val.amount))
        })
        zetatronStake.map((val) => {
          zetatronStakeTotal = Number(zetatronStakeTotal + Number(val.amount))
        })
        rametronStake.map((val) => {
          rametronStakeTotal = Number(rametronStakeTotal + Number(val.amount))
        })
        this.setState({
          metatronStake: metatronStakeTotal
        })
        this.setState({
          zetatronStake: zetatronStakeTotal
        })
        this.setState({
          rametronStake: rametronStakeTotal
        })


        let sum = stakeList.reduce((sum, info) => { return sumCoin(sum, info.amount) }, 0);
        let newObj = stakeList.reduce((map, obj) => {
          if (!map[obj.holder]) map[obj.holder] = 0;
          map[obj.holder] = sumCoin(map[obj.holder], obj.amount).toFixed()
          return map;
        }, {});
        let topStakes = Array.from(Object.keys(newObj), key => {
          return { 'holder': key, 'amount': newObj[key] }
        }).sort((a, b) => {
          return b.amount - a.amount
        }).slice(0, 8)
        let sumPercent = 0;
        let objList = topStakes.map(stake => {
          let obj = {};
          obj.holder = stake.holder;
          obj.percentage = new BigNumber(stake.amount).dividedBy(sum / 100).toFixed(2);
          sumPercent += obj.percentage - '0';
          return obj;
        }).concat({ holder: 'Rest Nodes', 'percentage': (100 - sumPercent).toFixed(2) })
        this.setState({
          holders: objList.map(obj => { return obj.holder }),
          percentage: objList.map(obj => { return (obj.percentage - '0') })
        });
      })
      .catch(err => {

      });
  }
  getTransactionNumber() {
    transactionsService.getTotalTransactionNumber(24)
      .then(res => {
        const txnNum = get(res, 'data.body.total_num_tx');
        this.setState({ txnNum })
      })
      .catch(err => {

      });
  }
  getBlockNumber() {
    blocksService.getTotalBlockNumber(24)
      .then(res => {
        const blockNum = get(res, 'data.body.total_num_block');
        this.setState({ blockNum })
      })
      .catch(err => {

      });
  }
  getTotalStaked() {
    const { type } = this.props;
    stakeService.getTotalStake()
      .then(res => {
        const stake = get(res, 'data.body')
       
          this.setState({ totalStaked: (Number(stake.totalAmount / 1000000000000000000)), nodeNum: stake.totalNodes });
        })
    
  }

  
  lbank() {
    stakeService.lbank().then((data) => {
      this.setState({
        lbankPrince: data.lBankPrice[0].latestPrice
      })

    })
  }
  marketCap() {
    stakeService.marketCap().then((data) => {
      this.setState({
        marketCap: Math.floor(data.marketCap428)
      })
    })
  }
  circulatingSupply() {
    stakeService.circulatingSupply().then((data) => {
      this.setState({
        CirculatingSupply: Number(data.CirculatingSupply)
      })
    })
  }
  render() {
    const { blockNum, txnNum, totalStaked, holders, percentage, txTs, txNumber, nodeNum } = this.state;
    const { tokenInfo, type, t } = this.props;
    const icon = type + 'wei';
    const token = type.toUpperCase();
  
    return (
      <React.Fragment>

        <div>
        
            <div className="explore-1">

              <div className="searchContainer">
                <input type="text" className="search-input nwe1" placeholder={`${t('SEARCH')}`} ref={input => this.searchInput = input} onKeyPress={e => this.handleEnterKey(e)} />
                <div className="search-select">
                <i className="fa fa-angle-down" aria-hidden="true"></i>
                  <select ref={option => this.searchType = option} onChange={(e) => this.clearSearchBox()}  >

                    <option value="address">{t('ADDRESS')}</option>
                    <option value="block">{t('BLOCK_HEIGHT')}</option>
                    <option value="transaction">{t('TRANSACTION')}</option>
                  </select>

                </div>

              </div>
            </div>


          <div className={cx("token dashboard", type)}>
            <div className="column">
              <Detail title={`${t('PTX_PRICE')}`} value={`\$${this.state.lbankPrince}`} />
              <Detail title={`${t(`HR_BLOCKS`)}`} value={formatNumber(blockNum)} />
            </div>
          
            <div className="column">
              <Detail title={`${t('RAMETRON STAKE')}`} value={formatCoin(this.state.rametronStake, 0)} />
              <Detail title={`${t('HR_TRANSACTIONS')}`} value={<TxnNumber num={txnNum} />} />

            </div>
            <div className="column">
              <Detail title= {`${t('METATRON STAKE')}`} value={formatCoin(this.state.metatronStake, 0)} />
              <Detail title={`${t('CIRCULATING SUPPLY')}`}  value={formatNumber(config.circulatingSupply)} />
            </div>
            <div className="column">

              <Detail title= {`${t('ZYTATRON STAKE')}`} value={formatCoin(this.state.zetatronStake)} />
              <Detail title={`${t(`TOTAL_SUPPLY`)}`} value={formatNumber(1500000000)} />

            </div>
            <div className="column">
              <Detail title={`${t('META_ZYTA_TOTAL_STAKED')}`} value={<StakedPercent staked={totalStaked} totalSupply={1500000000} />} />
              <Detail title={`${t(`MARKET_CAP`)}`} value={formatCurrency((config.circulatingSupply*this.state.lbankPrince), 0)} />

            </div>
          </div>
        </div>
       
            <div className={"chart-container homechart "}>
              <div className="row">
                <div className="col-md-12">
                  <div style={{textAlign:'center',fontSize:'23px'}} className="title"> <img style={{paddingRight:'11px' }} src="./images/PTX LOGO.svg" alt=""  />{t('PTX_TRANSACTION_HISTORY')}</div>
                  <PandoChart chartType={'line'} labels={txTs} data={txNumber} clickType={''} />
                </div>

              </div>


            </div>
            {/* <div style={{textAlign:'center',fontSize:'23px',height:'396px'}} className={"chart-container mt-5"}  >
            <img style={{paddingRight:'11px' }} src="./images/Icon ionic-ios-git-network.svg" alt="" />
              <Link to="#">{`${t('RAMETRON NETWORKS')}`} </Link>
              <div className="row mt-2 ">

                <div className="col-md-12">
                 
                  

                </div>
              </div>


            </div> */}

         




      </React.Fragment>
    );
  }
}

const Detail = ({ title, value }) => {
  return (
    <div className="detail">
      <div className="title">{title}</div>
      <div className={cx("value", { price: title.includes('Price') })}>{value}</div>
    </div>
  );
}

const TxnNumber = ({ num }) => {
  const duration = 24 * 60 * 60;
  const tps = num / duration;
  return (
    <React.Fragment>
      {`${formatNumber(num)}`}
      {/* <div className="tps">[{tps.toFixed(2)} TPS]</div> */}
    </React.Fragment>
  );
}

const StakedPercent = ({ staked, totalSupply }) => {
  return (
    <React.Fragment>
      {`${new BigNumber(staked).dividedBy(totalSupply / 100).toFixed(2)}%`}
    </React.Fragment>
  );
}