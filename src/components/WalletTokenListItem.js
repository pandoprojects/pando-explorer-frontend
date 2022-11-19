import React from "react";
import './WalletTokenListItem.css';
import { BigNumber } from 'bignumber.js';
import Wallet from '../services/Wallet';
import api from '../services/Api';


class WalletTokenListItem extends React.Component {
    constructor() {
        super();
        this.state = {
            balance: 0,
            stakeDetails: { totalStakeAmount: 0, totalStake: 0 },
            transactionData: '',
        };
    }

    render() {
        let tokenBalance = (this.props.tokenBalance || "0");
        tokenBalance = new BigNumber(tokenBalance).toString();
        return (
            <ul className="nav dashboard-item">
                <li className="WalletTokenListItem" activeclassname="WalletTokenListItem--is-active">
                    <div className="WalletTokenListItem__token-container">
                        <div className="WalletTokenListItem__active-indicator" />
                        <img src="/img/tokens/p.svg"
                            className="WalletTokenListItem__token-icon"
                        />
                        <div className="WalletTokenListItem__token-balance-container">
                            <div className="WalletTokenListItem__token-name">
                                <h5>Token Available</h5>
                            </div>
                            <div className="WalletTokenListItem__token-balance">
                                <h5>
                                    {(this.state.balance)}
                                </h5>

                            </div>
                        </div>
                    </div>
                </li>
                <li
                    className="WalletTokenListItem"
                    activeclassname="WalletTokenListItem--is-active">
                    <div className="WalletTokenListItem__token-container">
                        <div className="WalletTokenListItem__active-indicator" />
                        <img src="/img/tokens/t1.svg"
                            className="WalletTokenListItem__token-icon"
                        />
                        <div className="WalletTokenListItem__token-balance-container">
                            <div className="WalletTokenListItem__token-name">
                                <h5>Total Transaction</h5>
                            </div>
                            <div className="WalletTokenListItem__token-balance">
                                <h5>
                                    {this.state?.transactionData ? (this.state?.transactionData) : 0}
                                </h5>

                            </div>
                        </div>
                    </div>
                </li>
                <li
                    className="WalletTokenListItem"
                    activeclassname="WalletTokenListItem--is-active">
                    <div className="WalletTokenListItem__token-container">
                        <div className="WalletTokenListItem__active-indicator" />
                        <img src="/img/tokens/stake.svg"
                            className="WalletTokenListItem__token-icon"
                        />
                        <div className="WalletTokenListItem__token-balance-container">
                            <div className="WalletTokenListItem__token-name">
                                <h5>No. of Stake</h5>
                            </div>
                            <div className="WalletTokenListItem__token-balance">
                                <h5>
                                    {this.state.stakeDetails.totalStake}
                                </h5>

                            </div>
                        </div>
                    </div>
                </li>
                <li
                    className="WalletTokenListItem"
                    activeclassname="WalletTokenListItem--is-active">
                    <div className="WalletTokenListItem__token-container">
                        <div className="WalletTokenListItem__active-indicator" />
                        <img src="/img/tokens/s-am.svg"

                            className="WalletTokenListItem__token-icon"
                        />
                        <div className="WalletTokenListItem__token-balance-container">
                            <div className="WalletTokenListItem__token-name">
                                <h5>Total Stake Amount</h5>
                            </div>
                            <div className="WalletTokenListItem__token-balance">
                                <h5>
                                    {this.state.stakeDetails.totalStakeAmount}

                                </h5>

                            </div>
                        </div>
                    </div>
                </li>



            </ul>

        );
    }
    componentDidMount() {
        // this.gettheData()
        // this.timer = setInterval(() => {
        //     this.gettheData()
        // }, 10000)
    }
    componentWillUnmount() {
        // clearInterval(this.timer);
    }



    gettheData() {
        let address = Wallet.getWalletAddress();
        api.checkBalance(address).then(res => {
            if (res.data.success) {
                const newObj = Object.fromEntries(
                    Object.entries(res.data.data.result.coins).map(([k, v]) => [k.toLowerCase(), v])
                  );
                let bal = String(newObj.ptxwei / 1000000000000000000);
                if (bal.includes('.')) {
                    let splitNum = bal?.split('.');
                    this.setState({ balance: `${splitNum[0]}.${splitNum[1].slice(0, 4)}` });
                } else {
                    this.setState({ balance: bal });
                }

            }
        });
        api.fetchStakes(Wallet.getWalletAddress()).then((data) => {
            this.setState({ stackes: data.body.sourceRecords })
            let totalStake = 0;
            let stakrle = 0
            for (let i of data.body.sourceRecords) {
                totalStake = totalStake + (i.amount / 1000000000000000000)
                stakrle++
            }


            api.getStakeHistory(Wallet.getWalletAddress()).then((res) => {
                let amount = 0
                if (res.data && res.data.length) {
                    for (let i of res.data) {
                        amount = i.stakeAmount + amount
                        stakrle++;
                    }
                    totalStake = amount + totalStake;

                    this.setState({
                        stakeDetails: {
                            totalStakeAmount: totalStake,
                            totalStake: stakrle
                        }
                    })
                } else {
                    this.setState({
                        stakeDetails: {
                            totalStakeAmount: totalStake,
                            totalStake: stakrle
                        }
                    })
                }

            })

        })
        // api.getdasboardcount(address).then((stateData) => {
        //     if (stateData.data.success) {
        //         this.setState({ stakeDetails: stateData.data.data });
        //     }
        // })
        api.getTransactionHistory(address).then((data) => {
            if (data.data.success) {
                // let uniqueSet = new Set(data.data.data.map(JSON.stringify));
                // let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                this.setState({ transactionData: data.data.data.total });
            } else {

            }
        })
    }
}

export default WalletTokenListItem;
