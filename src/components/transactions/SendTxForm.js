import React from 'react'
import './TxForm.css';
import './SendTxForm.css';
import _ from 'lodash'
import { connect } from 'react-redux'
import Pando from '../../services/Pando'
import TokenTypes from "../../constants/TokenTypes";
import FormInputContainer from '../FormInputContainer'
import GradientButton from '../buttons/GradientButton';
import { hasValidDecimalPlaces } from '../../utils/Utils'
import { BigNumber } from 'bignumber.js';
import { store } from "../../state";
import { showModal } from "../../state/actions/Modals";
import ModalTypes from "../../constants/ModalTypes";
import API from '../../services/Api'
import Wallet from "../../services/Wallet";
import { withTranslation } from 'react-i18next';
import TemporaryState from '../../services/TemporaryState'
import config from "./../../Config"
let walletData = TemporaryState.getWalletData();


const TRANSACTION_FEE = config.currentFee;

// when we send the ptx this component describe its functionality

export class SendTxForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tokenType: (TokenTypes.PANDO),
            to: '',
            amount: '',
            sequence: '',
            transactionFee: TRANSACTION_FEE,
            invalidAddress: false,
            insufficientFunds: false,
            invalidAmount: false,
            invalidDecimalPlaces: false,
            invalidAmmount: true,
            walletAmount: 0,
            zeronotAllow: false,
            isSameAddress: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.handleEntireBalanceClick = this.handleEntireBalanceClick.bind(this);
    }

    getBalanceOfTokenType(tokenType) {
        return _.get(this.props.balancesByType, tokenType, 0);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (name === 'tokenType') {
            //Reset user entered data to ensure they don't send the incorrect amount after changing currency
            let defaults = {
                to: '',
                amount: '',
                sequence: '',
                transactionFee: TRANSACTION_FEE,

                invalidAddress: false,
                invalidDecimalPlaces: false,
                invalidAmount: false,
                insufficientFunds: false,
            };

            this.setState(Object.assign(defaults, { tokenType: value }));
        }
        else {
            if (name === "amount") {
                value = value.replace(/[^0-9.]/g, '');
            }
            this.setState({ [name]: value }, () => {
                this.validate();
            });
        }
    }

    handleSendClick() {
        let to = this.state.to.toLowerCase();
        // API.iswalletExists(this.state.to).then((resp) => {
        //     if (resp.success) {
        if (to.startsWith("0x") === false) {
            to = "0x" + to;
        }
        store.dispatch(showModal({
            type: ModalTypes.SEND_CONFIRMATION,
            props: {
                network: Pando.getChainID(),
                transaction: {
                    tokenType: this.state.tokenType,
                    from: this.props.walletAddress,
                    to: to,
                    amount: this.state.amount,
                    sequence: this.state.sequence,
                    transactionFee: this.state.transactionFee,

                }
            }
        }));



    }

    isValid() {
        return (
            this.state.to.length > 0 &&
            this.state.amount.length > 0 &&
            this.state.invalidAddress === false
        );
    }

    async calculateEntirePTXBalance() {
        let transactionFee = this.state.transactionFee;
        let balance = this.getBalanceOfTokenType(TokenTypes.PTX);

        if (transactionFee) {
            let transactionFeeBN = new BigNumber(transactionFee);
            let ptxBalanceBN = new BigNumber(balance);
            let amountToSendBN = ptxBalanceBN.minus(transactionFeeBN);

            this.setState({
                amount: amountToSendBN.toString()
            });
        }
    }

    async handleEntireBalanceClick() {
        if (this.state.tokenType === TokenTypes.PANDO) {
            let balance = this.getBalanceOfTokenType(TokenTypes.PANDO);

            this.setState({
                amount: balance
            });
        }
        else if (this.state.tokenType === TokenTypes.PTX) {
            let balance = this.getBalanceOfTokenType(TokenTypes.PTX);

            if (parseFloat(balance) !== 0.0) {
                this.setState({
                    amount: balance
                }, () => {
                    this.calculateEntirePTXBalance()
                });
            }
        }
    }

    validate(e) {
        if (this.state.to.length > 0) {
            this.validateAddress();
        }

        if (this.state.amount.length > 0) {
            if (String(this.state.amount).startsWith('0')) {
                this.setState({ zeronotAllow: true });
            } else {
                this.setState({ zeronotAllow: false });
                this.validateAmount();
            }
        }
    }

    async validateAddress() {
        let isAddress = Pando.isAddress(this.state.to);
        this.setState({ invalidAddress: (isAddress === false) });
        let add = Wallet.getWalletAddress();
        if (this.state.to.toLocaleLowerCase() === add.toLocaleLowerCase()) {
            this.setState({ isSameAddress: true });
        } else {
            this.setState({ isSameAddress: false });
        }
    }

    async validateAmount() {
        let amountFloat = parseFloat(this.state.amount);
        let pandoBalance = this.getBalanceOfTokenType(TokenTypes.PANDO);
        let ptxBalance = this.getBalanceOfTokenType(TokenTypes.PTX);
        let balance = this.state.walletAmount;

        if (this.state.tokenType === TokenTypes.PANDO) {
            balance = pandoBalance;
        } else if (this.state.tokenType === TokenTypes.PTX) {
            balance = ptxBalance;
        }
        this.setState({
            insufficientFunds: ((amountFloat + amountFloat * 0.01) > this.state.walletAmount),
            invalidAmount: (amountFloat === 0.0 || amountFloat < 0.0),
            invalidDecimalPlaces: !hasValidDecimalPlaces(this.state.amount, 18)
        });
        if ((amountFloat + amountFloat * 0.01) == this.state.walletAmount) {
            this.setState({
                insufficientFunds: false,
                invalidAmount: (amountFloat === 0.0 || amountFloat < 0.0),
                invalidDecimalPlaces: !hasValidDecimalPlaces(this.state.amount, 18)
            });
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.to !== prevState.to) {
            this.validateAddress();
        }

        if (this.state.amount !== prevState.amount || this.state.gasPrice !== prevState.gasPrice) {
            this.validateAmount();
        }
    }
    componentDidMount() {
        let address = Wallet.getWalletAddress();

        API.getWalletBalance(address).then(res => {

            if (res.body && res.body.balance) {

                const newObj = Object.fromEntries(
                    Object.entries(res.body.balance).map(([k, v]) => [k.toLowerCase(), v])
                  );
                let bal = Number(newObj.ptxwei / 1000000000000000000);


                this.setState({ walletAmount: bal });

                if (bal > 0) {
                    this.setState({ invalidAmmount: false })
                } else {
                    this.setState({ invalidAmmount: true })
                }

            }
            else {
                this.setState({ invalidAmmount: true })
            }

        });


    }

    render() {
        const { t } = this.props
        let hasToAddress = (this.state.to !== null && this.state.to !== '' && this.state.invalidAddress === false);
        let pandoTitle = `Pando Token (PTX)`;
        let transactionFeeValueContent = (
            <React.Fragment>
                <span>{t(`TRANSACTION_FEE`)}</span>
            </React.Fragment>
        );
        let amountTitleContent = (
            <React.Fragment>
                <span>{t(`AMOUNT`)}</span>
                {/* {
                    hasToAddress &&
                    <a className="TxForm__entire-balance"
                        onClick={this.handleEntireBalanceClick}>
                        Entire Balance
                    </a>
                } */}
            </React.Fragment>
        );

        let isValid = this.isValid();

        let amountError = null;
        let toError = null
        if (this.state.invalidAddress) {
            toError = `${t(`INVALID_ADDRESS`)}`
        }
        if (this.state.isSameAddress) {
            toError = `${t(`YOU_ARE_NOT_ALLOW_TO_SEND_TO_YOUR_OWN_WALLET`)}`
        }
        if (this.state.insufficientFunds) {
            amountError = `${t(`INSUFFICIENT_FUNDS`)}`;
        }
        else if (this.state.invalidDecimalPlaces) {
            amountError = `${t(`INVALID_DENOMINATION`)}`;
        }
        else if (this.state.invalidAmount) {
            amountError = `${t(`INVALID_AMOUNT`)}`;
        }

        return (
            <div className="TxForm">
                <FormInputContainer title={t(`TOKEN`)}>
                    <select className="BottomBorderInput thin" value={this.state.tokenType} onChange={this.handleChange}
                        name="tokenType">
                        <option value={TokenTypes.PANDO}>{pandoTitle}</option>
                    </select>
                </FormInputContainer>
                {/* <FormInputContainer title="Sequence"
                >
                    <input className="BottomBorderInput"
                        name="sequence"
                        placeholder="Enter transaction sequence"
                        value={this.state.sequence}
                        onChange={this.handleChange} />
                </FormInputContainer> */}

                <FormInputContainer title={t(`To`)}
                    error={toError}>
                    <input className="BottomBorderInput "
                        name="to"
                        placeholder={t(`ENTER_ADDRESS`)}
                        value={this.state.to}
                        onChange={this.handleChange} autoComplete="off" />

                </FormInputContainer>

                <FormInputContainer title={amountTitleContent} >
                    <input className="BottomBorderInput" type="text" value={this.state.amount}
                        name="amount"
                        placeholder={t(`ENTER_AMOUNT_TO_SEND`)}
                        onChange={this.handleChange} autoComplete="off" />
                </FormInputContainer>
                {this.state.amount <= 1 ?
                    <span className="text-light thin con76">{t(`YOUR_WALLET_MUST_HAVE`)}</span>
                    : ''

                }
                {this.state.insufficientFunds ? <span className="text-danger">{t(`USER_WALLET_MUST_HAVE_SUFFICIENT_AMOUNT`)}</span> : null}
                <GradientButton title={t(`SEND`)} className="GradientButton"
                    disabled={this.state.zeronotAllow || this.state.isSameAddress || isValid === false || this.state.invalidAmmount || this.state.insufficientFunds}
                    onClick={this.handleSendClick}
                />
                {this.state.invalidAmmount ?
                    <span className="text-danger thin">{t(`INSUFFICIENT_BALANCE`)}</span>
                    : ''

                }

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        balancesByType: state.wallet.balancesByType,
        walletAddress: state.wallet.address,
    };
};

export default withTranslation()(connect(mapStateToProps)(SendTxForm));
