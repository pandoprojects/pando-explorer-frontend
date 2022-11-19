import React from "react";
import './CreateWalletPage.css';
import { Link } from "react-router-dom";
import GradientButton from '../components/buttons/GradientButton'
import Wallet from '../services/Wallet'
import TemporaryState from '../services/TemporaryState'
import { downloadFile } from '../utils/Utils'
import { store } from "../state";
import { showModal } from "../state/actions/Modals";
import ModalTypes from "../constants/ModalTypes";
import Router from '../services/Router'
import { withTranslation } from "react-i18next";
import { copyToClipboard } from "../utils/Utils";
import Alerts from '../services/Alerts';


class WalletCreationCompleteCard extends React.Component {
    render() {
        const { t } = this.props
        return (
            <div className="WalletCreationCompleteCard">
                <div className="container">

                    <div className="row">
                        <div className="col-md-12 text-center">
                            <img src="/img/tab-bar/WALLET.png" className="imgcss" />

                        </div>
                        <div className="col-md-12 text-center text-light class-compketealwfedws">
                            <h3> {t(`YOURE_READY`)}</h3>
                            <p>{t(`LETS_GET_STARTED_WITH_YOUR_NEW_PANDO_WALLET`)}</p>
                            <GradientButton title={t(`UNLOCK_WALLET`)} style={{
                                height: '60',
                                width: '32',
                                margin: "104"
                            }} className="GradientButton"
                                href="/unlock"
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

class MnemonicCard extends React.Component {
    constructor() {
        super();

        this.showPrivateKey = this.showPrivateKey.bind(this);
    }

    copyAddress = () => {
        copyToClipboard(this.props.wallet.mnemonic);
        Alerts.showSuccess(this.props.t(`YOUR_ADDRESS_HAS_BEEN_COPIED`));
    }

    showPrivateKey() {
        store.dispatch(showModal({
            type: ModalTypes.PRIVATE_KEY,
            props: {
                privateKey: this.props.wallet.privateKey
            }
        }));
    }

    render() {
        const { t } = this.props
        let { mnemonic, privateKey } = this.props.wallet;

        return (
            <div>
            <div className="MnemonicCard">
                <div className="MnemonicCard__content">
                    <img src="/img/tab-bar/MNEMONIC2.svg" className="" height="70" />

                    <div className="MnemonicCard__header">
                        <div className="MnemonicCard__title">
                            {t(`MNEMONIC_PHRASE`)}
                        </div>
                        {/* <div className="MnemonicWarningCard__subtitle">
                           

                            {t(`12_WORDS_WHICH_ALLOW_YOU_TO_RECOVER_YOUR_WALLET`)}
                        </div> */}
                    </div>

                    <div className="MnemonicCard__body">
                        <div className="MnemonicCard__instructions">
                            {t(`BACK_UP_THE_TEXT_BELOW`)}
                        </div>

                        <div className="MnemonicCard__phrase-container">
                        <a className="NavBar__wallet-copy-address-icon"onClick={this.copyAddress}>
                                <img src="/img/icons/COPY.svg" />
                            </a>
                            <p>
                           
                                {/*cat house phone trip design donkey coffee office hat charger heart rate*/}
                                {mnemonic}
                                
                            </p>
                        </div>

                        <a className="MnemonicCard__view-private-key"
                            onClick={this.showPrivateKey}>{t(`VIEW_MY_PRIVATE_KEY`)}</a>
                    </div>

                </div>
            </div>
            <div className="MnemonicCard__footer">
            <GradientButton title={t(`Continue`)} className="GradientButton"
                onClick={this.props.onContinue}
            />
        </div>
        </div>
        );
    }
}

class MnemonicWarningCard extends React.Component {
    render() {
        const { t } = this.props
        return (
            <div>
            <div className="MnemonicWarningCard">
                <div className="MnemonicWarningCard__content">
                    <img src="/img/tab-bar/MNEMONIC2.svg" className="mt-4" height="70" />

                    <div className="MnemonicWarningCard__header">
                        <div className="MnemonicWarningCard__title">
                            {t(`MNEMONIC_PHRASE`)}
                        </div>
                        <div className="MnemonicWarningCard__subtitle">
                            {t(`12_WORDS_WHICH_ALLOW_YOU_TO_RECOVER_YOUR_WALLET`)}
                        </div>
                    </div>

                    <img className="MnemonicWarningCard__icon" src={'/img/icons/mnemonic phrase.png'} />

                    <div className="MnemonicWarningCard__warning">
                        <div className="MnemonicWarningCard__warning-title">
                            {t(`WARNING`)}
                        </div>
                        <div className="MnemonicWarningCard__warning-body">
                            {t(`WE_ARE_ABOUT_TO_SHOW_YOUR_MNEMONIC`)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="MnemonicWarningCard__footer">
                        <GradientButton title={t(`CONTINUE`)} className="GradientButton"
                            onClick={this.props.onContinue}
                        />
                    </div>
            </div>
        );
    }
}

//TODO rename to create keystore card
class ChoosePasswordCard extends React.Component {

    constructor() {
        super();

        this.state = {
            password: '',
            passwordConfirmation: '',
            agreedToTerms: false,
            // isWeekPassword: false
        }
    }

    handleChange(event) {
        let name = event.target.name;
        let type = event.target.type;
        // var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[^_`{|}~]{8,}$/;
        // var test = reg.test(event.target.value);
        // if (test) {
        //     this.setState({ isWeekPassword: false })
        // } else {
        //     this.setState({ isWeekPassword: true })


        // }
        let value = (type === "password" ? event.target.value : event.target.checked);

        this.setState({ [name]: value }, this.validate);
    }

    createWallet() {
       
        let data = Wallet.createWallet(this.state.password);
        if (data) {
            TemporaryState.setWalletData(data);
            // apiService.uploadKey(data.keystore).then((res) => res);
            downloadFile(data.wallet.address + '.keystore', JSON.stringify(data.keystore));

            //Sometimes the browser pauses when downloading a file, to reduce jitters add a pause
            setTimeout(() => {
                this.setState({ loading: false });

                this.props.onContinue();
            }, 500);
        }
    }

    prepareForWalletCreation() {
        if (navigator.onLine) {
            this.setState({ loading: true });

            setTimeout(() => {
                this.createWallet();
            }, 1000);
        } else {
            Router.push(`/offline`)


        }
    }

    isValid() {
        return (
            this.state.agreedToTerms === true &&
            this.state.password.length > 0 &&
            this.state.password === this.state.passwordConfirmation);
    }

    validate() {
        if (this.state.password.length > 0 &&
            this.state.passwordConfirmation.length > 0 &&
            this.state.password !== this.state.passwordConfirmation) {
            this.setState({ error: this.props.t(`YOUR_PASSWORDS_DO_NOT_MATCH`) });
        }
        else {
            this.setState({ error: "" });
        }
    }

    render() {
        const { t } = this.props
        return (
            <div>
            <div className="ChoosePasswordCard">
                <div className="ChoosePasswordCard__content">
                    <img src="/img/tab-bar/KEYSTORE1.svg" className="m-2" height="70" />
                    <div className="ChoosePasswordCard__header">
                        <div className="ChoosePasswordCard__title">
                            {t(`CREATE_KEYSTORE`)}

                        </div>
                        <div className="ChoosePasswordCard__subtitle">
                            {t(`THIS_PASSWORD_WILL_ENCRYPT_YOUR_PRIVATE_KEY`)}
                        </div>
                    </div>
                    <div className="ChoosePasswordCard__inputs">
                        <label className="lab">{t(`NEW PASSWORD`)}</label>
                        <input className="ChoosePasswordCard__password-input form-control"
                            placeholder={t(`SET_A_NEW_PASSWORD`)}
                            maxLength="24" size="24" minLength="8"
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange.bind(this)}
                        />
                        <small className="text-danger thin">{t(`PASSWORD_MUST_NOT_EXCEED_BY_24_CHARACTERS`)}</small>
                        <label className="lab">{t(`CONFIRM PASSWORD`)}</label>
                        <input className="ChoosePasswordCard__password-input form-control"
                            placeholder={t(`RE_ENTER_PASSWORD`)}
                            maxLength="24" size="24" minLength="8"
                            name="passwordConfirmation"
                            type="password"
                            value={this.state.passwordConfirmation}
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    <div className="ChoosePasswordCard__error">
                        {this.state.error}
                        {/* {this.state.isWeekPassword ? 'Password should be Minimum eight characters long and alphanumeric with special characters having upper and lower case' : ''} */}
                    </div>
                    <div className="ChoosePasswordCard__message-wrapper">
                        <input id="agreedToTerms"
                            type="checkbox"
                            name="agreedToTerms"
                            checked={this.state.agreedToTerms}
                            onChange={this.handleChange.bind(this)} />
                        <label className="ChoosePasswordCard__message"
                            htmlFor="agreedToTerms">
                            <span className="thin">
                                {t(`I_AGREE_THAT_PANDOLAB`)}
                            </span>
                        </label>
                    </div>

                   
                </div>
            </div>
             <div className="ChoosePasswordCard__footer">
             <GradientButton title={t(`DOWNLOAD_KEYSTORE`)} className="GradientButton"
                 onClick={this.prepareForWalletCreation.bind(this)}
                 loading={this.state.loading}
                 disabled={(this.state.loading || this.isValid() === false)}
             />
         </div>
         </div>
        );
    }
}

const CREATE_WALLET_STEP_CREATE_KEYSTORE = 0;
const CREATE_WALLET_STEP_MNEMONIC_WARNING = 1;
const CREATE_WALLET_STEP_MNEMONIC = 2;
const CREATE_WALLET_STEP_COMPLETE = 3;

class CreateWalletPage extends React.Component {
    constructor() {
        super();

        this.state = {
            currentStep: CREATE_WALLET_STEP_CREATE_KEYSTORE
        }
    }

    continue() {
        this.setState({ currentStep: this.state.currentStep + 1 });
    }

    render() {
        const { t } = this.props;
        let walletData = TemporaryState.getWalletData();
        let card = null;
        let footer = null;
        let pageTitle = (this.state.currentStep === CREATE_WALLET_STEP_COMPLETE ? "" : `${t(`CREATE_NEW_WALLET`)}`);

        if (this.state.currentStep === CREATE_WALLET_STEP_CREATE_KEYSTORE) {
            card = (
                <ChoosePasswordCard t={t} onContinue={this.continue.bind(this)} />
            );
        }
        else if (this.state.currentStep === CREATE_WALLET_STEP_MNEMONIC_WARNING) {
            card = (
                <MnemonicWarningCard t={t} onContinue={this.continue.bind(this)} />
            );
        }
        else if (this.state.currentStep === CREATE_WALLET_STEP_MNEMONIC) {
            card = (
                <MnemonicCard t={t} onContinue={this.continue.bind(this)}
                    wallet={walletData.wallet}
                />
            );
        }
        else if (this.state.currentStep === CREATE_WALLET_STEP_COMPLETE) {
            card = (
                <WalletCreationCompleteCard t={t} onContinue={this.continue.bind(this)} />
            );
        }


        if (this.state.currentStep !== CREATE_WALLET_STEP_COMPLETE) {
            footer = (
                <div className="CreateWalletPage__subtitle">
                    <span>{t(`ALREADY_HAVE_A_WALLET`)}</span>
                    <Link to="/unlock">{t(`UNLOCK_WALLET`)}</Link>
                </div>
            );
        }

        return (
            <div className="CreateWalletPage container">
                <div className="CreateWalletPage__wrapper">
                    <div className="CreateWalletPage__title">

                        {pageTitle}
                        <img src="../img/icons/Group 81.svg" alt="" srcset="" />
                    </div>

                    {card}

                    {footer}
                </div>
            </div>
        );
    }
}

export default withTranslation()(CreateWalletPage);