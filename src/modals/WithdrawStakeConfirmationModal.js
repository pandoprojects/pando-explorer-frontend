import React from "react";
import "./TxConfirmationModal.css";
import "./WithdrawStakeConfirmationModal.css";
import connect from "react-redux/es/connect/connect";
import Modal from "../components/Modal";
import GradientButton from "../components/buttons/GradientButton";
import { createWithdrawStakeTransaction } from "../state/actions/Transactions";
import PandoJS from "../libs/pandojs.esm";
import API from "../services/Api";
import Alerts from "../services/Alerts";
import { store } from "../state";
import { hideModals } from "../state/actions/Modals";
import { whenMapDispatchToPropsIsFunction } from "react-redux/es/connect/mapDispatchToProps";
import { withTranslation } from "react-i18next";
import Wallet, { WalletUnlockStrategy } from "../services/Wallet";
import pando from "../services/Pando";
import Router from "../services/Router";


class WithdrawStakeConfirmationModal extends React.Component {
  paybalAmount = 0;
  constructor() {
    super();

    this.state = {
      password: "",
      isloading: false,
      paybaleAmount: 0,
      amount: 0,
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
    let {t} = this.props;
    try {
      if (WalletUnlockStrategy.KEYSTORE_FILE === unlockStrategy) {
        keyStoreData = Wallet.decryptFromKeystore(
          Wallet.getKeystore(),
          this.state.password
        );
      } else if (WalletUnlockStrategy.PRIVATE_KEY === unlockStrategy) {
        keyStoreData = Wallet.walletFromPrivateKey(unLockKey);
      } else if (WalletUnlockStrategy.MNEMONIC_PHRASE === unlockStrategy) {
        keyStoreData = Wallet.walletFromMnemonic(unLockKey);
      }
    } catch (e) {
      this.setState({ isloading: false });
      message = (t(`WRONG PASSWORD`));
      Alerts.showError(message);
    }

    const body = {
      tokenType: "PTX",
      from: this.props.transaction.from,
      holder: this.props.transaction.holder,
      transactionFee: 3000000000000000,
      purpose: this.props.transaction.purpose,
    };
     
    if (message !== "Wrong password") {
      API.getSequence(body.from).then((seqres) => {
        if (seqres && seqres.type === "account") {
          let sequence = Number(seqres.body.sequence) + 1;
          let s = pando.unsignedWithdrawStakeTx(body, sequence);
          pando.signTransaction(s, keyStoreData.privateKey).then((data) => {
            API.sendTransaction(data)
              .then((res) => {
                if (res.success) {
                  this.setState({ isloading: false });
                  Alerts.showSuccess("Withdrawl successful");
                  setTimeout(() => {
                    Router.push('/wallet/tokens/pando')
                    store.dispatch(hideModals());
                    document.getElementById("Refresh").click();
                  }, 1000);
                } else {
                  this.setState({ isloading: false });
                  Alerts.showError(t(`YOU WILL BE ABLE TO WITHDRAW YOUR STAKE AFTER COMPLETING THE LOCKING PERIOD OF ONE YEAR`));
                }
              })
              .catch((err) => {
                this.setState({ isloading: false });
                Alerts.showError(err);
              });
          });
        }
      });
    }
  };

  render() {
    let { purpose, holder, transactionFee, height, amount } =
      this.props.transaction;
      let { t } = this.props;

    let isValid = Wallet.getWalletHardware() || this.state.password.length > 0;
    let isLoading = this.props.isCreatingTransaction;
    let renderDataRow = (title, value) => {
      return (
        <div className="TxConfirmationModal__row">
          <div className="TxConfirmationModal__row-title">{title}</div>
          <div className="TxConfirmationModal__row-value">{value}</div>
        </div>
      );
    };
    let detailRows = (
      <React.Fragment>
        {renderDataRow("Withdraw To", this.props.walletAddress)}
      </React.Fragment>
    );

    let passwordRow = null;

    passwordRow = (
      <div className="TxConfirmationModal__password-container">
        <div className="TxConfirmationModal__password-title">
          {t(`ENTER_YOUR_WALLET_PASSWORD_TO_SIGN_THIS_TRANSACTION`)}
        </div>
        <input
          className="ChoosePasswordCard__password-input"
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
      holderTitle = t(`ZYTATRON_NODE_(HOLDER)`);
    } else if (purpose === PandoJS.StakePurposes.StakeForGuardian) {
      holderTitle = t(`METATRON_NODE_(HOLDER)`);
    } else {
      holderTitle = t(`RAMETRON_NODE_(HOLDER)`);
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

          <div className="TxConfirmationModal__amount-title">
            {t(`YOU_ARE_WITHDRAWING_STAKE_FROM`)}
          </div>
          <div className="TxConfirmationModal__holder-title">{holderTitle}</div>
          <div className="TxConfirmationModal__holder">{holder}</div>

          <div className="TxConfirmationModal__rows">{detailRows}</div>

          {passwordRow}

          <GradientButton
            title = {t(`CONFIRM & WITHDRAW STAKE`)}
            disabled={this.state.isloading || pwdDisable}
            onClick={this.handleConfirmClick}
            loading={this.state.isloading}
          />
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    walletAddress: state.wallet.address,
    isCreatingTransaction: state.transactions.isCreatingTransaction,
  };
};

export default withTranslation()(
  connect(mapStateToProps)(WithdrawStakeConfirmationModal)
);
