import React, { Component } from "react";

import { stakeService } from '../common/services/stake';
import PandoChart from '../common/components/chart';
import { formatNumber, formatCurrency, sumCoin } from '../common/helpers/utils';
import StakesTable from "../common/components/stakes-table";
import LoadingPanel from '../common/components/loading-panel';

import BigNumber from 'bignumber.js';


export default class Nodes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stakes: [],
            totalStaked: 0,
            holders: [],
            percentage: [],
            sortedStakesByHolder: [],
            sortedStakesBySource: [],
            AllZetaHolder: [],
            AllMetaHolder: [],
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
                    // if (!(!!i.currentTime) || i.currentTime == 'dsdsds') {
                        let temp = { _id:i.type+'_'+i.holder, type: i.type, holder: i.holder, source: i.source, amount: i.amount, withdrawn: i.withdrawn, return_height: i.return_height }

                        insit.push(temp)
                    // }
                }
                //   insit = insit.filter((thing, index, self) =>
                //     index === self.findIndex((t) => (
                //       t.type === thing.type && t.holder === thing.holder && thing.source === thing.source && thing.amount === thing.amount && thing.return_height === thing.return_height
                //     ))
                //   )

                const stakeList = insit

                let sum = stakeList.reduce((sum, info) => { return sumCoin(sum, info.amount) }, 0);
                let holderObj = stakeList.reduce((map, obj) => {
                    //console.log(obj.holder)
                    if (!map[obj._id]) {
                        map[obj._id] = {
                            type: obj.type,
                            amount: 0,
                            address:obj.holder
                        };
                    }
                    map[obj._id].amount = sumCoin(map[obj._id].amount, obj.amount).toFixed()
                    return map;
                }, {});
                
                
                let sortedStakesByHolder = Array.from(Object.keys(holderObj), key => {
                    return { 'holder': holderObj[key].address, 'amount': holderObj[key].amount, 'type': holderObj[key].type }
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
                    loading: false
                });
            })
            .catch(err => {

            });
    }

    render() {
        const { holders, percentage, sortedStakesByHolder, sortedStakesBySource, totalStaked, AllMetaHolder, AllZetaHolder, stakes } = this.state;
        // console.log(this.state);

        let isTablet = window.screen.width <= 768;
        const truncate = isTablet ? 10 : 20;
        return (
            <div className="content stakes">
                {this.state.loading ?
                    <LoadingPanel />
                    :
                    <>
                        <button className="btn btn-success custom-btn cont-u8" title="Refresh" onClick={() => this.getAllStakes()}  ><img src="/images/Layer 2.svg" alt="" /></button>

                        <div className="table-container">
                            <StakesTable type='validators' stakes={sortedStakesByHolder} totalStaked={totalStaked} truncate={truncate} />
                        </div>
                        <div className="table-container">

                            <StakesTable type='guardian' stakes={sortedStakesByHolder} totalStaked={totalStaked} truncate={truncate} />
                        </div>

                        <div className="table-container">

                            <StakesTable type='rametron' stakes={sortedStakesByHolder} totalStaked={totalStaked} truncate={truncate} />
                        </div>
                    </>
                } 
                {/*  */}



            </div>

        );
    }
}