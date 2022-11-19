import React from "react";
import './WalletTokenList.css';
import WalletTokenListItem from './WalletTokenListItem'
import TokenTypes from '../constants/TokenTypes'
import { tokenTypeToTokenName } from '../constants/TokenTypes'
import Config from '../Config';
import TransactionHistory from '../pages/transaction-history';
import { StakesTable } from "../components/StakesTable";
import Api from "../services/Api";
import Wallet from "../services/Wallet";

const PandoNetworkTokens = [
    {
        type: TokenTypes.PANDO,
        name: tokenTypeToTokenName(TokenTypes.PANDO),
        iconUrl: `/img/tokens/p.png`,
        href: "/wallet/tokens/" + TokenTypes.PANDO
    }

];

const EthereumNetworkTokens = [
    {
        type: TokenTypes.ERC20_PANDO,
        name: tokenTypeToTokenName(TokenTypes.ERC20_PANDO),
        iconUrl: `/img/tokens/${TokenTypes.ERC20_PANDO}_large@2x.png`,
        href: "/wallet/tokens/" + TokenTypes.ERC20_PANDO
    },
    {
        type: TokenTypes.ETHEREUM,
        name: tokenTypeToTokenName(TokenTypes.ETHEREUM),
        iconUrl: `/img/tokens/${TokenTypes.ETHEREUM}_large@2x.png`,
        href: "/wallet/tokens/" + TokenTypes.ETHEREUM
    }];

const liveTokens = (Config.isPandoNetworkLive ? PandoNetworkTokens : EthereumNetworkTokens);
const allTokens = (Config.isPandoNetworkLive ? PandoNetworkTokens.concat(EthereumNetworkTokens) : EthereumNetworkTokens);

class WalletTokenList extends React.Component {
    constructor() {
        super();

        this.state = {
            showEthereumTokens: false,
            stackes: []
        };


        this.toggleEthereumTokens = this.toggleEthereumTokens.bind(this);
    }

    startPollingStakes() {
        Api.fetchStakes(Wallet.getWalletAddress()).then((data) => {
            this.setState({ stackes: data.body.sourceRecords })
        })

    }
    stopPollingStakes() {
        if (this.pollStakesIntervalId) {
            clearInterval(this.pollStakesIntervalId);
        }
    }

    componentDidMount() {
        this.startPollingStakes()

    }

    componentWillUnmount() {
        this.stopPollingStakes();
    }

    toggleEthereumTokens() {
        this.setState({ showEthereumTokens: !this.state.showEthereumTokens });
    }

    render() {
        const { t } = this.props
        let tokens = (this.state.showEthereumTokens ? allTokens : liveTokens);
        let balancesByType = this.props.balancesByType;
        var content = tokens.map(function (token) {
            let balance = balancesByType[token.type];
        });

        return (
            <div className="WalletTokenList" >
                <div className="token-list">
                    {content}

                </div>

                <TransactionHistory t={t}></TransactionHistory>

            </div>

        );
    }
}

export default WalletTokenList;
