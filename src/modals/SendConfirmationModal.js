import React from 'react'
import './TxConfirmationModal.css';
import './SendConfirmationModal.css';
import connect from "react-redux/es/connect/connect";
import Modal from '../components/Modal'
import GradientButton from "../components/buttons/GradientButton";
import Wallet, { WalletUnlockStrategy } from '../services/Wallet'
import { tokenTypeToTokenName } from "../constants/TokenTypes";
import { numberWithCommas } from "../utils/Utils";
import apiService from '../services/Api';
import { hideModal,hideModals } from "../state/actions/Modals";
import { store } from "../state";
import Alerts from '../services/Alerts';
import Router from '../services/Router';
import { withTranslation } from 'react-i18next';
import pando from '../services/Pando';
import config from '../Config';

class SendConfirmationModal extends React.Component {
    constructor() {
        super();

        this.state = {
            password: '',
            isloading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({ [name]: value });
    }

    handleSendClick() {
        let keyStoreData = null;
        let unlockStrategy = Wallet.getUnlockStrategy();
        let unLockKey = Wallet.getUnlockKey();
        this.setState({ isloading: true });
        let message;
        let { t } = this.props
        const body = {
            "tokenType": "PTX",
            "from": this.props.transaction.from,
            "to": this.props.transaction.to,
            "amount": Number(this.props.transaction.amount),
            "transactionFee": Number(this.props.transaction.amount)
        }
        try {
        
            if (WalletUnlockStrategy.KEYSTORE_FILE === unlockStrategy) {
               
                keyStoreData = Wallet.decryptFromKeystore(Wallet.getKeystore(), this.state.password);
              

            } else if (WalletUnlockStrategy.PRIVATE_KEY === unlockStrategy) {
                keyStoreData = Wallet.walletFromPrivateKey(unLockKey)
            } else if (WalletUnlockStrategy.MNEMONIC_PHRASE === unlockStrategy) {
                keyStoreData = Wallet.walletFromMnemonic(unLockKey)
            }
        }
        catch (e) {
            this.setState({ isloading: false });
            message = t(`WRONG PASSWORD`);
            Alerts.showError(message);
        }
        if (message !== 'Wrong password') {
            let { t } = this.props
            apiService.getSequence(body.from).then((seqres) => {
                if (seqres && seqres.type === 'account') {
                    let sequence = Number(seqres.body.sequence) + 1;
                    const s = pando.unsignedSendTx(body, sequence);
                    pando.signTransaction(s, keyStoreData.privateKey).then((data) => {
                        apiService.sendTransaction(data).then((res) => {
                          
                            if (res.data && res.data.result) {
                                setTimeout(() => {
                                    store.dispatch(hideModals());
                                    this.setState({ isloading: false });
                                    document.getElementById("Refresh").click();
                                    Alerts.showSuccess(t(`TRANSACTION SUCCESSFUL`));
                                    Router.push('/wallet/tokens/pando')
                                },2000)
                               
                            }
                            else {
                              
                                Alerts.showSuccess(t(`TRANSACTION SUCCESSFULINSUFFICIENT FEE. TRANSACTION FEE NEEDS TO BE AT LEAST 0.03 PTX`));;
                                this.setState({ isloading: false });
                                store.dispatch(hideModals());
                            }
                        })

                    })
                }
            })
        }







    }

    render() {
        let { tokenType, amount, to, transactionFee } = this.props.transaction;
        let isValid = Wallet.getWalletHardware() || this.state.password.length > 0;
        let isLoading = this.props.isCreatingTransaction;
        let { t } = this.props
        let currentDemo = config.currentFee
        
        
      
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
        let detailRows = null;

        detailRows = (
            <React.Fragment>
                {renderDataRow("From", this.props.walletAddress)}
                {/* { renderDataRow("Transaction Fee", currentDemo + " PTX")} */}
            </React.Fragment>
        );

        let passwordRow = null;

        if (!Wallet.getWalletHardware()) {
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

                    <div className="TxConfirmationModal__amount-title">{t(`YOU_ARE_SENDING`)}</div>
                    <div className="TxConfirmationModal__amount">{numberWithCommas(amount)}</div>
                    <div className="TxConfirmationModal__token-name">{tokenTypeToTokenName(tokenType)}</div>
                    <div className="TxConfirmationModal__to-title">{t(`TO_RECIPIENT`)}</div>
                    <div className="TxConfirmationModal__to">{to}</div>

                    <div className="TxConfirmationModal__rows">
                        {detailRows}
                    </div>

                    {passwordRow}

                    <GradientButton className="GradientButton" title={t(`SEND`)}
                        disabled={this.state.isloading || pwdDisable}
                        onClick={this.handleSendClick}
                        loading={this.state.isloading}
                    />
                    <div className="TxConfirmationModal__to-title"> {t(`TRANSACTION_FEE`)}</div>
                    <div className="TxConfirmationModal__to"> {currentDemo} PTX</div>


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

export default withTranslation()(connect(mapStateToProps)(SendConfirmationModal));
