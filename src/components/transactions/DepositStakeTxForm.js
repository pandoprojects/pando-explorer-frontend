import React from 'react'
import './TxForm.css';
import './DepositStakeTxForm.css';
import _ from 'lodash'
import { connect } from 'react-redux'
import Pando from '../../services/Pando'
import TokenTypes from "../../constants/TokenTypes";
import FormInputContainer from '../FormInputContainer'
import GradientButton from '../buttons/GradientButton';
import { numberWithCommas } from '../../utils/Utils'
import { BigNumber } from 'bignumber.js';
import { store } from "../../state";
import { showModal } from "../../state/actions/Modals";
import ModalTypes from "../../constants/ModalTypes";
import Pandojs from '../../libs/pandojs.esm';
import { getMinStakeAmount } from "../../Flags";
import API from '../../services/Api';
import Wallet from '../../services/Wallet';
import { withTranslation } from 'react-i18next';
import config from '../../Config';
const TRANSACTION_FEE = config.transactionFee;


// This component is used for the functionality in the Deposit stake button under the stake menu
class DepositStakeTxForm extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            tokenType: (props.defaultTokenType || TokenTypes.PANDO),
            holder: '',
            amount: '',
            sequence: '',
            transactionFee: Pando.getTransactionFee(),

            invalidHolder: false,
            insufficientFunds: false,
            invalidAmount: false,
            invalidDecimalPlaces: false,
            RametronAmmountError: false,
            invalidRametronError: false,
            remetronStek: '',
            invalidAmmount: true,
            walletAmount: 0,
            metaZetaInvalid: false,
            tempArray: [],
            multipleHolder: false,
           


        };

        this.handleChange = this.handleChange.bind(this);
        this.handleEntireBalanceClick = this.handleEntireBalanceClick.bind(this);
    }

    getBalanceOfTokenType(tokenType) {
        if (this.props.purpose === 0) {
            return 10000000;

        } else if (this.props.purpose === 1) {
            return 10000;

        }
        else if (this.props.purpose === 2) {
            return 35000;

        }
        else if (this.props.purpose === 3) {
            return 10000;

        }
        else if (this.props.purpose === 4) {
            return 1000;

        }

        else {
            return 250
        }
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        if (name === 'tokenType') {
            //Reset user entered data to ensure they don't send the incorrect amount after changing currency
            let defaults = {
                holder: '',
                amount: '',
                sequence: '',

                transactionFee: TRANSACTION_FEE,

                invalidHolder: false,
                invalidDecimalPlaces: false,
                invalidAmount: false,
                insufficientFunds: false,
                RametronAmmountError: false
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

    handleDepositStakeClick = () => {

        store.dispatch(showModal({
            type: ModalTypes.DEPOSIT_STAKE_CONFIRMATION,
            props: {
                network: Pando.getChainID(),
                transaction: {
                    purpose: this.props.purpose,
                    tokenType: this.state.tokenType,
                    sequence: this.state.sequence,
                    from: this.props.walletAddress,
                    holder: this.state.holder,
                    amount: this.state.amount,
                    transactionFee: this.state.transactionFee
                }
            }
        }));



    };

    isValid() {

        return (
            this.state.holder.length > 0 &&
            this.state?.amount.length > 0 &&
            this.state.invalidHolder === false &&
            this.state.insufficientFunds === false &&
            this.state.invalidDecimalPlaces === false &&
            this.state.invalidAmount === false &&
            this.state.invalidRametronError === false

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
    }

    validate() {
        if (this.state.holder.length > 0) {
            this.validateHolder();
        }

        if (this.state.amount.length > 0) {
            this.validateAmount();
        }
    }

    async validateHolder() {
        let tempholder = this.state.holder
        const { purpose } = this.props;
        let isValid = false;

        if (purpose === Pandojs.StakePurposes.StakeForValidator) {
            isValid = Pando.isAddress(this.state.holder);
        }
        else if (purpose === Pandojs.StakePurposes.StakeForGuardian) {
            isValid = Pando.isHolderSummary(this.state.holder);
        }
        else {
            let tempisValid = Pando.isHolderSummary(this.state.holder);
            isValid = false
            let isPurposeExixt = false
            let recordExist = false
            if (tempisValid) {
                if (!tempholder.startsWith('0x')) {
                    tempholder = '0x' + tempholder
                }
                let tempsummry = tempholder.substring(0, 42);
                let found = false
                for (let i of this.state.tempArray) {
                    if (i.holder.toLowerCase() === tempsummry.toLowerCase()) {
                        recordExist = true
                    }
                    if (i.purpose === purpose) {
                        isPurposeExixt = true
                        if (i.holder.toLowerCase() === tempsummry.toLowerCase()) {
                            found = true
                            break;
                        }
                    }
                }
                if (found) {
                    isValid = true
                }
                else {
                     isValid = false
                }
             
                if (!isPurposeExixt) {
                    if(recordExist){
                        isValid = false
                    }
                    else{
                        isValid = true
                    }
                   
                }
                
             
            }
            this.setState({ multipleHolder:  (isValid === false)});

        }
        this.setState({ invalidHolder: (isValid === false) });

    }

    async validateAmount() {
        const { purpose } = this.props;
        let amountFloat = parseFloat(this.state.amount);
        let pandpBalance = this.getBalanceOfTokenType(TokenTypes.PANDO);
        let balance = null;

        if (this.state.tokenType === TokenTypes.PANDO) {
            balance = pandpBalance;
        }
        if (amountFloat < balance) {
            this.setState({
                insufficientFunds: true,
                invalidAmount: true,
                invalidDecimalPlaces: false
            });
        } else {
            this.setState({
                insufficientFunds: false,
                invalidAmount: false,
                invalidDecimalPlaces: false
            });
        }


        if (amountFloat > this.state.walletAmount) {
            this.setState({ metaZetaInvalid: true })
        } else {
            this.setState({ metaZetaInvalid: false })

        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.holder !== prevState.holder) {
            this.validateHolder();
        }

        if (this.state.amount !== prevState.amount || this.state.gasPrice !== prevState.gasPrice) {
            this.validateAmount();
        }
    }
    componentDidMount() {
        let address = Wallet.getWalletAddress();
        API.getStakeType(address).then((his) => {
            if (his.body && his.body.length) {
                let tarr = []
                for (let i of his.body) {
                    if (i.data.purpose > 1) {
                        let tempItem = { 'holder': i.data.holder.address, purpose: i.data.purpose }
                        tarr.push(tempItem)
                    }
                }
                this.setState({ tempArray: tarr })

            }
        })

        API.getWalletBalance(address).then(res => {

            if (res.body && res.body.balance ) {
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

    preventDecimal(e) {
        if (e.keyCode == 190 || e.keyCode == 110) {
            e.preventDefault();
            return false;
        }
    }

    render() {
        const { purpose, t } = this.props;
        let hasHolder = (this.state.holder !== null && this.state.holder !== '' && this.state.invalidHolder === false);
        let pandoTitle = `PTX (${this.getBalanceOfTokenType(TokenTypes.PANDO)} Minimum)`;
        let transactionFeeValueContent = (
            <React.Fragment>
                <span>{t(`TRANSACTION_FEE`)}</span>
            </React.Fragment>
        );
        let amountTitleContent = (
            <React.Fragment>
                <span>{t(`AMOUNT`)}</span>

            </React.Fragment>

        );

        let isValid = this.isValid();
        let toError = null;
        let amountError = null;

        if (this.state.invalidHolder) {
            if (purpose === Pandojs.StakePurposes.StakeForValidator) {
                toError = t(`INVALID_HOLDER_ADDRESS`);
            }
            else if(purpose === Pandojs.StakePurposes.StakeForGuardian) {
                toError = t(`INVALID_HOLDER_SUMMARY`);
            }
            else {
                
                if(this.state.multipleHolder){
                    toError = t(`INVALID_HOLDER_SUMMARY`) +' ( Note: can not deposit to multiple and already used holder summary for Rametron node type)';
                }
                else{
                toError = t(`INVALID_HOLDER_SUMMARY`);
            }
            }
        }

        if (this.state.insufficientFunds) {
            amountError = `${t(`INVALID_AMOUNT_MUST_BE_AT_LEAST`)} ${this.getBalanceOfTokenType(TokenTypes.PANDO)
                } PTX`;

        }
        else if (this.state.invalidDecimalPlaces) {
            amountError = t(`INVALID_DENOMINATION`);
        }
        else if (this.state.RametronAmmountError) {
            amountError = t(`INSUFFICIENT_RAMETRON`);

        }
        else if (this.state.invalidAmount) {
            amountError = `${t(`INVALID_AMOUNT_MUST_BE_AT_LEAST`)} ${numberWithCommas(getMinStakeAmount(purpose))} PTX`;
        } else if (this.state.invalidRametronError) {
            amountError = `Invalid denomination, minimum top is ${this.getBalanceOfTokenType(TokenTypes.PTX)} PTX`

        }

        let holderTitle = "";
        let holderPlaceholder = "";

        if (purpose === Pandojs.StakePurposes.StakeForValidator) {
            holderTitle = t(`ZYTATRON_NODE_HOLDER_(ADDRESS)`);
            holderPlaceholder = t(`ENTER_ZYTATRON_NODE_ADDRESS`);
        }
        else if (purpose === Pandojs.StakePurposes.StakeForGuardian) {
            holderTitle = t(`METATRON_NODE_HOLDER_(NODE_SUMMARY)`);
            holderPlaceholder = t(`ENTER_METATRON_NODE_SUMMARY`);

        } else {
            holderTitle = t(`RAMETRON_NODE_HOLDER(SUMMARY)`);
            holderPlaceholder = t(`ENTER_RAMETRON_NODE_SUMMARY`);

        }



        return (
            <div className="TxForm">
                <FormInputContainer title="Token">
                    <select className="BottomBorderInput" value={this.state.tokenType} onChange={this.handleChange}
                        name="tokenType">
                        <option value={TokenTypes.PANDO}>{pandoTitle}</option>
                    </select>
                </FormInputContainer>
                <FormInputContainer title={holderTitle}
                    error={toError}>
                    <input className="BottomBorderInput"
                        autoComplete="off"
                        name="holder"
                        placeholder={holderPlaceholder}
                        value={this.state.holder}
                        onChange={this.handleChange} />
                </FormInputContainer>
                <FormInputContainer title={amountTitleContent}
                    error={amountError}>
                    <input className="BottomBorderInput" value={this.state.amount}
                        name="amount"
                        autoComplete="off"
                        placeholder="Enter amount to stake"
                        onChange={this.handleChange}
                        type="number"
                        min="1"
                        onKeyDown={this.preventDecimal}
                    />

                </FormInputContainer>
                {/* {purpose === 1 ?
                    <FormInputContainer className="metatron-note" title={t(`PLEASE_RUN_METATRON_ON_YOUR_CLI_TO_GET_NODE`)}
                    >

                    </FormInputContainer>
                    : null}

                {purpose === 2 ?

                    <div className="TxForm__fee-container">
                        <div className="">
                            <ValueWithTitle title={transactionFeeValueContent}
                                value={(0.01 * this.state.amount).toFixed(4)} />
                        </div>
                    </div>
                    : null


                } */}
                {/* {this.state.insufficientFunds ? <span className="text-danger">{t(`USER_WALLET_MUST_HAVE_SUFFICIENT_AMOUNT_ALONG`)}</span> : null} */}
                <GradientButton title={t(`DEPOSIT_STAKE`)} className="GradientButton"
                    disabled={isValid === false || this.state.invalidAmmount || this.state.amount < 1 || this.state.insufficientFunds || this.state.invalidRametronError || this.state.metaZetaInvalid}
                    onClick={this.handleDepositStakeClick} />

                {this.state.invalidAmmount ?
                    <span className="text-danger thin">{t(`INSUFFICIENT_BALANCE`)}</span>
                    : ''

                }
                {this.state.metaZetaInvalid ?
                    <span className="text-danger thin">{t(`USER_WALLET_MUST_HAVE_SUFFICIENT_AMOUNT`)}</span>
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

export default withTranslation()(connect(mapStateToProps)(DepositStakeTxForm));
