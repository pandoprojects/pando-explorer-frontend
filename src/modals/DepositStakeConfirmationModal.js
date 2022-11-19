import React from 'react'
import './TxConfirmationModal.css';
import './DepositStakeConfirmationModal.css';
import connect from "react-redux/es/connect/connect";
import Modal from '../components/Modal'
import GradientButton from "../components/buttons/GradientButton";
import Wallet, { WalletUnlockStrategy } from '../services/Wallet'
import { createDepositStakeTransaction } from "../state/actions/Transactions";
import { tokenTypeToTokenName } from "../constants/TokenTypes";
import { numberWithCommas } from "../utils/Utils";
import PandoJS from '../libs/pandojs.esm';
import API from '../services/Api'
import Alerts from "../services/Alerts";
import { store } from "../state";
import { hideModal, hideModals } from "../state/actions/Modals";
import Router from '../services/Router'
import { withTranslation } from 'react-i18next';
import pando from '../services/Pando'





class DepositStakeConfirmationModal extends React.Component {
    constructor() {
        super();
        this.state = {
            password: '',
            isloading: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    handleConfirmClick = () => {
      
        this.setState({ isloading: true });
        let keyStoreData = null;
        let unlockStrategy = Wallet.getUnlockStrategy();
        let unLockKey = Wallet.getUnlockKey();
        let message;
        
        try {
            
            if (WalletUnlockStrategy.KEYSTORE_FILE === unlockStrategy) {
                keyStoreData = Wallet.decryptFromKeystore(Wallet.getKeystore(), this.state.password);
            } else if (WalletUnlockStrategy.PRIVATE_KEY === unlockStrategy) {
                keyStoreData = Wallet.walletFromPrivateKey(unLockKey)
            } else if (WalletUnlockStrategy.MNEMONIC_PHRASE === unlockStrategy) {
                keyStoreData = Wallet.walletFromMnemonic(unLockKey)
            }
        } catch (e) {
            
            this.setState({ isloading: false });
            message ='Wrong password';
            Alerts.showError(message);
        }

        const body = {
            "tokenType": "PTX",
            "from": this.props.transaction.from,
            "holder": this.props.transaction.holder,
            "amount": this.props.transaction.amount,
            "transactionFee": 3000000000000000,
            "purpose": this.props.transaction.purpose
        }
        if (message !== 'Wrong password')
         {
            API.getSequence(body.from).then((seqres) => {
                if (seqres && seqres.type === 'account') {
                    let sequence = Number(seqres.body.sequence) + 1;
                    let s = pando.unsignedDepositStakeTx(body, sequence)

                    pando.signTransaction(s, keyStoreData.privateKey).then((data) => {
                        API.sendTransaction(data).then((res) => {
                            if (res.success) {
                                this.setState({ isloading: false });
                                Alerts.showSuccess('Stake Successful!');
                                setTimeout(() => {

                                    Router.push('/wallet/tokens/pando')
                                    store.dispatch(hideModals());
                                    document.getElementById("Refresh").click();
                                }, 1000)
                            }
                            else {
                                this.setState({ isloading: false });
                                Alerts.showError('SOMETHING WENT WRONG');
                            }
                        }).catch((err) => {
                            this.setState({ isloading: false });
                            Alerts.showError('SOMETHING WENT WRONG');
                        })
                    })
                }
            })
                .catch((err) => {
                    this.setState({ isloading: false });
                    Alerts.showError('SOMETHING WENT WRONG');
                })
        }


    }







    render() {
        let passwordRow;
        let { transaction, t } = this.props;
        let { tokenType, amount, holder, transactionFee, purpose } = transaction;
        let isValid = Wallet.getWalletHardware();
        let isLoading = this.props.isCreatingTransaction;
        let renderDataRow = (title, value) => {
            return (
                <div className="TxConfirmationModal__row">
                    <div className="TxConfirmationModal__row-title">
                        {title}
                    </div>
                    <div className="TxConfirmationModal__row-value">
                        {value}
                    </div>
                </div>
            );
        };
        let detailRows = (
            <React.Fragment>
                {renderDataRow("From", this.props.walletAddress)}
            </React.Fragment>
        );




        passwordRow = (
            <div className="TxConfirmationModal__password-container">
                <div className="TxConfirmationModal__password-title">{t(`ENTER_YOUR_WALLET_PASSWORD_TO_SIGN_THIS_TRANSACTION`)}</div>
                <input className="ChoosePasswordCard__password-input"
                    placeholder={t(`ENTER_WALLET_PASSWORD`)}
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );


        let holderTitle = null;
        if (purpose === PandoJS.StakePurposes.StakeForValidator) {
            holderTitle = t(`ZYTATRON_NODE_HOLDER_(ADDRESS)`)
        }
        else if (purpose === PandoJS.StakePurposes.StakeForGuardian) {
            holderTitle = t(`METATRON_NODE_HOLDER_(NODE_SUMMARY)`)
        } else {
            holderTitle = t(`RAMETRON_NODE_HOLDER(SUMMARY)`)
        }
        let pwdDisable;
        if (this.state.password?.length === 0) {
            pwdDisable = true;
        } else {
            pwdDisable = false;

        }



        return (
            <Modal>
                <div className="TxConfirmationModal">
                    <div className="TxConfirmationModal__title">
                        {t(`CONFIRM_TRANSACTION`)}
                    </div>

                    <div className="TxConfirmationModal__amount-title">{t(`YOU_ARE_DEPOSITING`)}</div>
                    <div className="TxConfirmationModal__amount">{numberWithCommas(amount)}</div>
                    <div className="TxConfirmationModal__token-name">{tokenTypeToTokenName(tokenType)}</div>
                    <div className="TxConfirmationModal__holder-title">{holderTitle}</div>
                    <div className="TxConfirmationModal__holder">{holder}</div>

                    <div className="TxConfirmationModal__rows">
                        {detailRows}
                        {passwordRow}
                    </div>

                    <GradientButton title="Confirm & Deposit Stake"
                        disabled={this.state.isloading || isValid === false || pwdDisable}
                        onClick={this.handleConfirmClick}
                        loading={this.state.isloading}
                    />
                </div>
            </Modal>
        )
    }
}


const mapStateToProps = state => {
    return {
        walletAddress: state.wallet.address,
        isCreatingTransaction: state.transactions.isCreatingTransaction,
    };
};


export default withTranslation()(connect(mapStateToProps)(DepositStakeConfirmationModal));
