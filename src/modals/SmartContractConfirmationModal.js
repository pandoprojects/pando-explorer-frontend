import React from 'react'
import './TxConfirmationModal.css';
import './SmartContractConfirmationModal.css';
import connect from "react-redux/es/connect/connect";
import Modal from '../components/Modal'
import GradientButton from "../components/buttons/GradientButton";
import Wallet, { WalletUnlockStrategy } from '../services/Wallet'
import { createSmartContractTransaction } from "../state/actions/Transactions";
import { tokenTypeToTokenName } from "../constants/TokenTypes";
import { numberWithCommas } from "../utils/Utils";
import PandoJS from '../libs/pandojs.esm';
import ContractModes from "../constants/ContractModes";
import Pando from '../services/Pando';
import apiService from '../services/Api';
import Alerts from '../services/Alerts';
import { hideModal,hideModals } from "../state/actions/Modals";
import { store } from "../state";
import Router from '../services/Router'

export class SmartContractConfirmationModal extends React.Component {
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
        
        let keyStoreData = null;
        let unlockStrategy = Wallet.getUnlockStrategy();
        let unLockKey = Wallet.getUnlockKey();
        this.setState({ isloading: true });
        const { data, from, gasLimit, to, transactionFee, value } = this.props.transaction
        const contractAbi  = this.props.contractAbi
        const body = {
            from: from,
            to: to ? to : null,
            data: data,
            value: value,
            transactionFee: transactionFee,
            gasLimit: gasLimit

        }
        
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
            message = "Wrong password";
            Alerts.showError(message);
        }
        
        if (message !== 'Wrong password') {
            apiService.getSequence(body.from).then((seqres) => {
                
                if (seqres && seqres.type === 'account') {
                    let sequence = Number(seqres.body.sequence) + 1;
                    const tx = Pando.unsignedSmartContractTx(body, sequence);
                    
                    const rawTxBytes = PandoJS.TxSigner.serializeTx(tx);
                    const callResponse = apiService.callSmartContracts({ sctx_bytes: rawTxBytes.toString('hex').slice(2) }).then((data) => {
                    if(data.success && data.data.result.contract_address)
                    {
                        let contractAddress = data.data.result.contract_address
                        Pando.signTransaction(tx, keyStoreData.privateKey).then((seq) => {
                        apiService.sendTransaction(seq).then((data) => {
                            if (data.success) {
                                Alerts.showSuccess('Contract deployed successful!');
                                this.setState({ isloading: false });
                                setTimeout(()=>{
                                    const contractABIB64 = btoa(contractAbi);
                                    store.dispatch(hideModals());
                                    document.getElementById("Refresh").click();
                                    Router.push(`./interact?address=${contractAddress}&abi=${contractABIB64}`);
                              },2000)
                            }
                            else{
                                this.setState({ isloading: false });
                                Alerts.showError('Something went wrong, Please check input values!');
                            }
                        }).catch((err) => {
                         
                            this.setState({ isloading: false });
                            Alerts.showError('Something went wrong, Please check input values!');
                        })

                    })
                }
                else{
                    this.setState({ isloading: false });
                    Alerts.showError('Something went wrong, Please check input values!');
                }
                }).catch((err) => {
                    this.setState({ isloading: false });
                    Alerts.showError('Something went wrong, Please check input value!');
                })
                }
            })
        }
        // this.props.dispatch(createSmartContractTransaction(this.props.network, this.props.contractMode, this.props.contractAbi, this.props.transaction, this.state.password));
    };

    render() {
      
        let { transaction, contractMode, contractAbi } = this.props;
        let { to, from, data, gasLimit, transactionFee, value } = transaction;
        let isValid = Wallet.getWalletHardware() || this.state.password.length > 0;
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
                {to && renderDataRow("To", to)}
                {renderDataRow("Data", (
                    <div style={{
                        maxWidth: 315,
                        overflowY: 'auto',
                        height: "100",
                        maxHeight: 100,
                        overflowWrap: "break-word"
                    }}>
                        {data}
                    </div>
                ))}
                {renderDataRow("Transaction Fee", transactionFee + " PTX")}
                {renderDataRow("Gas Limit", gasLimit)}
            </React.Fragment>
        );
        let title = null;
        let actionButtonTitle = null;

        if (contractMode === ContractModes.DEPLOY) {
            title = "You are deploying a smart contract";
            actionButtonTitle = "Confirm & Deploy";
        } else if (contractMode === ContractModes.EXECUTE) {
            title = "You are executing a smart contract";
            actionButtonTitle = "Confirm & Execute";
        } else if (contractMode === ContractModes.CALL) {
            title = "You are calling a smart contract";
            actionButtonTitle = "Confirm & Call";
        }
        let pwdDisable;
        if (this.state.password?.length === 0) {
            pwdDisable = true;
        } else {
            pwdDisable = false;

        }

        let passwordRow = null;

        if (!Wallet.getWalletHardware()) {
            passwordRow = (
                <div className="TxConfirmationModal__password-container">
                    <div className="TxConfirmationModal__password-title">Enter your wallet password to sign this
                        transaction
                    </div>
                    <input className="ChoosePasswordCard__password-input"
                        placeholder="Enter wallet password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
            );
        }

        return (
            <Modal>
                <div className="TxConfirmationModal">
                    <div className="TxConfirmationModal__title">
                        Confirm Transaction
                    </div>
                    <div className="TxConfirmationModal__amount-title">
                        {title}
                    </div>

                    <div className="TxConfirmationModal__rows">
                        {detailRows}
                    </div>

                    {passwordRow}

                    <GradientButton title={actionButtonTitle}
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

export default connect(mapStateToProps)(SmartContractConfirmationModal);
