import React from "react";
import './WalletPage.css';
import { connect } from 'react-redux'
import WalletTokenList from '../components/WalletTokenList'
import { fetchWalletBalances } from "../state/actions/Wallet";
import { fetchPandoTransactions } from "../state/actions/Transactions";
import { getERC20Transactions, getEthereumTransactions, getPandoNetworkTransactions } from "../state/selectors/Transactions";
import TokenTypes from "../constants/TokenTypes";
import { showModal } from "../state/actions/Modals";
import ModalTypes from "../constants/ModalTypes";
import { withTranslation } from "react-i18next";

class WalletPage extends React.Component {
    constructor() {
        super();

        this.pollWalletBalancesIntervalId = null;

        this.fetchBalances = this.fetchBalances.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.handleReceiveClick = this.handleReceiveClick.bind(this);
    }

    fetchTransactions(tokenType) {
        if (tokenType === TokenTypes.PANDO || tokenType === TokenTypes.PTX) {
            this.props.dispatch(fetchPandoTransactions());
        }
    }

    fetchBalances() {
        this.props.dispatch(fetchWalletBalances());
    }

    startPollingWalletBalances() {
        //Fetch it immediately
        this.fetchBalances();

        // this.pollWalletBalancesIntervalId = setInterval(this.fetchBalances, 15000);
    }

    stopPollingWalletBalances() {
        if (this.pollWalletBalancesIntervalId) {
            clearInterval(this.pollWalletBalancesIntervalId);
        }
    }

    handleSendClick() {
        this.props.dispatch(showModal({
            type: ModalTypes.SEND,
            props: {
                tokenType: this.props.match.params.tokenType
            }
        }));
    }

    handleReceiveClick() {
        this.props.dispatch(showModal({
            type: ModalTypes.RECEIVE,
        }));
    }

    componentDidMount() {
        let tokenType = this.props.match.params.tokenType;
        this.startPollingWalletBalances();
        this.fetchTransactions(tokenType);
    }

    componentWillUnmount() {
        this.stopPollingWalletBalances();
    }

    componentWillReceiveProps(nextProps) {
        let nextTokenType = nextProps.match.params.tokenType;

        if (this.props.match.params.tokenType !== nextTokenType) {
            this.fetchTransactions(nextTokenType);
        }
    }

    render() {
        const { t } = this.props
        return (
            <div className="WalletPage">
                <div className="WalletPage__master-view">
                    <WalletTokenList t={t} balancesByType={this.props.balancesByType} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let tokenType = ownProps.match.params.tokenType;
    let localTransactionsByHash = (state.transactions.localTransactionsByHash || {});
    let transactions = [];
    let isLoadingTransactions = false;

    if (tokenType === TokenTypes.ERC20_PANDO) {
        transactions = getERC20Transactions(state);
        isLoadingTransactions = state.transactions.isFetchingERC20Transactions;
    }
    else if (tokenType === TokenTypes.ETHEREUM) {
        transactions = getEthereumTransactions(state);
        isLoadingTransactions = state.transactions.isFetchingEthereumTransactions;
    }
    else if (tokenType === TokenTypes.ERC20_PANDO || tokenType === TokenTypes.PTX) {
        transactions = getPandoNetworkTransactions(state);
        isLoadingTransactions = state.transactions.isFetchingTransactions;
    }

    return {
        balancesByType: Object.assign({}, state.wallet.balancesByType, state.wallet.ethereumBalancesByType),

        localTransactionsAmount: Object.keys(localTransactionsByHash).length,

        transactions: transactions,

        isLoadingTransactions: isLoadingTransactions
    };
};

export default withTranslation()(connect(mapStateToProps)(WalletPage));
