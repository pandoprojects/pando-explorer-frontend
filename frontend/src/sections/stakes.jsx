import React, { Component } from "react";
import { stakeService } from '../common/services/stake';
import PandoChart from '../common/components/chart';
import { formatNumber, formatCurrency, sumCoin } from '../common/helpers/utils';
import StakesTable from "../common/components/stakes-table";
import LoadingPanel from '../common/components/loading-panel';
import BigNumber from 'bignumber.js';
import { withTranslation } from "react-i18next";


class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stakes: [],
      totalStaked: 0,
      holders: [],
      percentage: [],
      sortedStakesByHolder: [],
      sortedStakesBySource: [],
      rametron: {},
      loading: true
    };
  }

  componentDidMount() {
    this.getAllStakes();
  }

  getAllStakes() {
    this.setState({ loading: true });
    stakeService.getAllStake()
      .then(res => {
       
        let insit = []
        for (let i of res.data.body) {
          if (!(!!i.currentTime) || i.currentTime == 'dsdsds') {
            let temp = { type: i.type, holder: i.holder, source: i.source, amount: i.amount, withdrawn: i.withdrawn, return_height: i.return_height }

            insit.push(temp)
          }
        }
       
        const stakeList = insit

        let sum = stakeList.reduce((sum, info) => { return sumCoin(sum, info.amount) }, 0);
        let holderObj = stakeList.reduce((map, obj) => {
          if (!map[obj.holder]) {
            map[obj.holder] = {
              type: obj.type,
              amount: 0
            };
          }
          map[obj.holder].amount = sumCoin(map[obj.holder].amount, obj.amount).toFixed()
          return map;
        }, {});
        let sourceObj = stakeList.reduce((map, obj) => {
          if (!map[obj.source]) {
            map[obj.source] = {
              amount: 0
            };
          }
          map[obj.source].amount = sumCoin(map[obj.source].amount, obj.amount).toFixed()
          return map;
        }, {});
        let sortedStakesByHolder = Array.from(Object.keys(holderObj), key => {
          return { 'holder': key, 'amount': holderObj[key].amount, 'type': holderObj[key].type }
        }).sort((a, b) => {
          return b.amount - a.amount
        })
        let sortedStakesBySource = Array.from(Object.keys(sourceObj), key => {
          return { 'source': key, 'amount': sourceObj[key].amount }
        }).sort((a, b) => {
          return b.amount - a.amount
        })
        let sumPercent = 0;
        let topList = sortedStakesByHolder.slice(0, 8).map(stake => {
          let obj = {};
          obj.holder = stake.holder;
          obj.percentage = new BigNumber(stake.amount).dividedBy(sum / 100).toFixed(2);
          sumPercent += obj.percentage - '0';
          return obj;
        }).concat({ holder: 'Rest Nodes', 'percentage': (100 - sumPercent).toFixed(2) })
        this.setState({
          stakes: stakeList,
          totalStaked: sum,
          holders: topList.map(obj => { return obj.holder }),
          percentage: topList.map(obj => { return (obj.percentage - '0') }),
          sortedStakesByHolder: sortedStakesByHolder,
          sortedStakesBySource: sortedStakesBySource,
          loading: false
        });

      })
      .catch(err => {

      });
  }

  render() {
    const { t } = this.props
    const { holders, percentage, sortedStakesByHolder, sortedStakesBySource, totalStaked } = this.state;
    let isTablet = window.screen.width <= 768;
    const truncate = isTablet ? 10 : 20;
    return (
      <div className="content stakes">
        
        {this.state.loading ?
          <LoadingPanel/>
          :
          <>
          
          <div className="chart-container hyg">
          <div style={{marginTop:'2px',height:'14%',padding:'11px',bottom:'19px'}} className="page-title stakes">{t(`TOTAL_STAKED`)}
              <PandoChart chartType={'doughnut'} labels={holders} data={percentage} clickType={'account'} />
            </div>
          </div>
            
            <div className="legend">{t(`PTX Network Nodes`)}</div>
            <div className="table-container">
              <StakesTable type='wallet' stakes={sortedStakesBySource} totalStaked={totalStaked} truncate={truncate} rametron={this.state.rametron} />
            </div>
          </>
        }

      </div>
    );
  }
}

export default withTranslation()(Blocks)