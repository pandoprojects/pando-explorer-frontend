import React from "react";
import './UnlockWalletPage.css';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import GradientButton from '../components/buttons/GradientButton'
import HardwareOptionButton from '../components/buttons/HardwareOptionButton';
import Wallet, { EthereumOtherDerivationPath } from '../services/Wallet'
import { WalletUnlockStrategy, EthereumDerivationPath, EthereumLedgerLiveDerivationPath } from '../services/Wallet'
import { unlockWallet } from "../state/actions/Wallet";
import { getHardwareWalletAddresses } from "../state/actions/Wallet";
import { NavLink } from 'react-router-dom'
import DropZone from '../components/DropZone';
import { SET_WALLET_ADDRESS } from "../state/types/Wallet";
import { withTranslation } from "react-i18next";



const classNames = require('classnames');

class UnlockWalletViaPrivateKey extends React.Component {
    constructor() {
        super();

        this.state = {
            privateKey: "",
            password: "",
            loading: false
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUnlockClick = this.handleUnlockClick.bind(this);
    }
    componentDidMount() {

    }

    isValid() {
        return this.state.privateKey.length > 0 && this.state.password.length > 0;
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleUnlockClick();
        }
    }

    unlockWallet() {
        Wallet.setUnlockKey(this.state.privateKey);
        this.props.unlockWallet(WalletUnlockStrategy.PRIVATE_KEY, this.state.password, { privateKey: this.state.privateKey });
        this.setState({ loading: false });
    }

    prepareForUnlock() {
        this.setState({ loading: true });
        setTimeout(() => {
            this.unlockWallet()
        }, 500);
    }

    handleUnlockClick() {
        if (this.isValid()) {
            this.prepareForUnlock();
        }
    }

    render() {
        const { t } = this.props
        let isDisabled = (this.state.loading || this.isValid() === false);

        return (
            <div>
            <div className="UnlockWalletViaPrivateKey">
                <div className="UnlockWalletViaPrivateKey__title">
                    {t(`PLEASE_ENTER_YOUR_PRIVATE_KEY`)}
                </div>

                <textarea style ={{height:51}}className="UnlockWalletViaPrivateKey__private-key form-control mt-2"
                    name="privateKey"
                    placeholder={t(`PLEASE_ENTER_YOUR_PRIVATE_KEY`)}
                    value={this.state.privateKey}
                    onChange={this.handleChange}
                />

                <div className="UnlockWalletViaPrivateKey__private-key-instructions thin">
                    {t(`PLEASE_ENTER_YOUR_PRIVATE_KEY_IN_HEX_FORMAT`)}
                </div>

                <input className="UnlockWalletViaPrivateKey__password-input form-control mt-2"
                    placeholder={t(`ENTER_TEMPORARY_SESSION_PASSWORD`)}
                    name="password"
                    type="password"
                    value={this.state.password}
                    ref={this.passwordInput}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />

                <div className="UnlockWalletCard__warning thin">
                    {t(`BEFORE_YOU_ENTER_YOUR_PRIVATE_KEY`)}
                </div>
            </div>
             <div className="UnlockWalletViaPrivateKey__footer mt-3">
             <GradientButton title={t(`UNLOCK_WALLET`)}
                 loading={this.state.loading}
                 onClick={this.handleUnlockClick}
                 disabled={isDisabled}
             />
         </div>
         </div>
        );
    }
}

class UnlockWalletViaMnemonicPhrase extends React.Component {
    constructor() {
        super();

        this.state = {
            mnemonic: "",
            password: "",
            loading: false
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUnlockClick = this.handleUnlockClick.bind(this);
    }

    componentDidMount() {

    }
    isValid() {
        return this.state.mnemonic.length > 0 && this.state.password.length > 0;
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({ [name]: value });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleUnlockClick();
        }
    }

    unlockWallet() {
        Wallet.setUnlockKey(this.state.mnemonic);

        this.props.unlockWallet(WalletUnlockStrategy.MNEMONIC_PHRASE, this.state.password, { mnemonic: this.state.mnemonic });

        this.setState({ loading: false });
    }

    prepareForUnlock() {
        this.setState({ loading: true });
        setTimeout(() => {
            this.unlockWallet()
        }, 500);
    }

    handleUnlockClick() {
        if (this.isValid()) {
            this.prepareForUnlock();
        }
    }

    render() {
        const { t } = this.props
        let isDisabled = (this.state.loading || this.isValid() === false);

        return (
            <div>
            <div className="UnlockWalletViaMnemonicPhrase">
                <div className="UnlockWalletViaMnemonicPhrase__title">
                    {t(`PLEASE_ENTER_YOUR_12_WORD_PHRASE`)}
                </div>

                <textarea className="UnlockWalletViaMnemonicPhrase__mnemonic form-control mt-2"
                    name="mnemonic"
                    placeholder={t(`PLEASE_ENTER_YOUR_12_WORD_PHRASE`)}
                    value={this.state.mnemonic}
                    onChange={this.handleChange}
                />

                <div className="UnlockWalletViaMnemonicPhrase__mnemonic-instructions thin">
                    {t(`PLEASE_SEPARATE_EACH_MNEMONIC_PHRASE_WITH_A_SPACE`)}
                </div>

                <input className="UnlockWalletViaMnemonicPhrase__password-input form-control mt-2"
                    placeholder={t(`ENTER_TEMPORARY_SESSION_PASSWORD`)}
                    name="password"
                    type="password"
                    value={this.state.password}
                    ref={this.passwordInput}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    rows="1"
                />
                <div className="UnlockWalletCard__warning thin">
                    {t(`BEFORE_YOU_ENTER_YOUR_MNEMONIC_PHRASE`)}
                </div>
            </div>
            <div className="UnlockWalletViaMnemonicPhrase__footer mt-3">
            <GradientButton title={t(`UNLOCK_WALLET`)}
                loading={this.state.loading}
                onClick={this.handleUnlockClick}
                disabled={isDisabled}
            />
        </div>
        </div>
        );
    }
}

class UnlockWalletViaKeystoreFile extends React.Component {
    constructor() {
        super();

        this.fileInput = React.createRef();
        this.passwordInput = React.createRef();

        this.droppedFile = null;


        this.state = {
            password: "",
            loading: false
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUnlockClick = this.handleUnlockClick.bind(this);
        this.handleKeystoreFileDrop = this.handleKeystoreFileDrop.bind(this);
    }
    componentDidMount() {
    }


    isValid() {
        let keystoreFile = this.keystoreFile();
        return keystoreFile !== null && this.state.password.length > 0;
    }

    keystoreFile() {
        let fileInput = this.fileInput.current;
        let fileFromInput = (fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null);

        //If a dropped file is available, use it
        return (this.droppedFile ? this.droppedFile : fileFromInput);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
        if (name === "file") {
            //Clear the dropped file
            this.droppedFile = null;

            this.passwordInput.current.focus();
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleUnlockClick();
        }
    }

    handleKeystoreFileDrop(file) {
        this.droppedFile = file;

        this.setState({ droppedFile: true }, () => {
            //To prevent lost focusing, focus after rendering
            this.passwordInput.current.focus();
        });
    }

    unlockWallet(keystore) {
       
        Wallet.setUnlockKey(this.state.password);
        this.props.unlockWallet(WalletUnlockStrategy.KEYSTORE_FILE, this.state.password, { keystore: keystore });
        this.setState({ loading: false });
    }

    onKeystoreFileLoad(e) {
        let keystoreData = e.target.result;
        let json = JSON.parse(keystoreData)
        setTimeout(() => {
            this.unlockWallet(keystoreData)
        }, 500);
    }

    prepareForUnlock() {
        let fileToLoad = this.keystoreFile();
        let fileReader = new FileReader();
        this.setState({ loading: true });
        fileReader.onload = this.onKeystoreFileLoad.bind(this);
        fileReader.readAsText(fileToLoad, "UTF-8");
    }

    handleUnlockClick() {
        if (this.isValid()) {
            this.prepareForUnlock();
        }
    }

    render() {
        const { t } = this.props
        let keystoreFile = this.keystoreFile();
        let fileInputClassName = classNames("UnlockWalletViaKeystoreFile__file-input", {
            "UnlockWalletViaKeystoreFile__file-input--has-file": (keystoreFile !== null)
        });
        let isDisabled = (this.state.loading || this.isValid() === false);

        return (
            <div>
            <div className="UnlockWalletViaKeystoreFile ijoss">
                <DropZone title="Drop keystore here"
                    icon="/img/icons/pando-file@2x.png"
                    onDrop={this.handleKeystoreFileDrop} />
                <div className="UnlockWalletViaKeystoreFile__title">
                    {t(`PLEASE_SELECT_YOUR_KEYSTORE_FILE`)}
                </div>

                <label htmlFor="file-upload" className={fileInputClassName}>
                    <input id="file-upload"
                        type="file"
                        name="file"
                        ref={this.fileInput}
                        onChange={this.handleChange} />
                    {((keystoreFile === null) ? `${t(`CHOOSE_KEYSTORE_FILE`)}` : `${t(`KEYSTORE_FILE_SET`)}`)}
                </label>

                <input className="UnlockWalletViaKeystoreFile__password-input form-control mt-3"
                    placeholder={t('ENTER_YOUR_WALLET_PASSWORD')}
                    name="password"
                    type="password"
                    value={this.state.password}
                    ref={this.passwordInput}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />

                

            </div>
            <div className="UnlockWalletViaKeystoreFile__footer mt-5" style={{marginBotton: "30"}}>
            <div className="UnlockWallets">
                <GradientButton title={t(`UNLOCK_WALLET`)}
                    loading={this.state.loading}
                    onClick={this.handleUnlockClick}
                    disabled={isDisabled}
                /></div>
        </div>
        </div>

        );
    }
}

class UnlockWalletViaColdWallet extends React.Component {
    constructor() {
        super();

        this.state = {
            hardware: '',
            loading: false,
            derivationPath: EthereumDerivationPath
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChooseHardwareClick = this.handleChooseHardwareClick.bind(this);
        this.handleTrezorClick = this.handleTrezorClick.bind(this);
        this.handleLedgerClick = this.handleLedgerClick.bind(this);
        this.handleDerivationPathChange = this.handleDerivationPathChange.bind(this);
    }
    componentDidMount() {

    }

    isValid() {
        return this.state.hardware.length > 0;
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({ [name]: value });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleUnlockClick();
        }
    }

    chooseHardware() {
        this.props.getHardwareWalletAddresses(this.state.hardware, 0, this.state.derivationPath);

        if (this.state.hardware === "ledger") {
            //Ledger is very slow...
            setTimeout(function () {
                this.setState({ loading: false });
            }.bind(this), 8000);
        }
        else {
            this.setState({ loading: false });
        }
    }

    prepareForChooseHardware() {
        this.setState({ loading: true });

        setTimeout(() => {
            this.chooseHardware()
        }, 500);
    }

    handleChooseHardwareClick() {
        if (this.isValid()) {
            this.prepareForChooseHardware();
        }
    }

    handleTrezorClick() {
        this.setState({ hardware: 'trezor' })
    }

    handleLedgerClick() {
        this.setState({ hardware: 'ledger' })
    }

    handleDerivationPathChange(e) {
        this.setState({ derivationPath: e.target.value });
    }

    render() {
        const { t } = this.props
        let isDisabled = (this.state.loading || this.isValid() === false);
        let warning = "";

        if (this.state.hardware === "trezor") {
            warning = "Please make sure your Trezor is connected before clicking 'Continue' below.";
        }
        else if (this.state.hardware === "ledger") {
            warning = "Please make sure your Ledger is connected with the Ethereum app open before clicking 'Continue' below.";
        }

        return (
            <div className="UnlockWalletViaColdWallet">
                <div className="UnlockWalletViaColdWallet__title">
                    Please choose a wallet type
                </div>
                <div className="UnlockWalletViaColdWallet__cold-wallet-hardware-select">
                    <div className="row">
                        <div className="col-md-6">
                            <HardwareOptionButton title="Trezor"
                                iconUrl={(this.state.hardware === "trezor" ? "/img/icons/checkmark-green@2x.png" : null)}
                                isSelected={(this.state.hardware === "trezor")}
                                onClick={this.handleTrezorClick}
                            />
                        </div>
                        <div className="col-md-6">
                            <HardwareOptionButton title="Ledger"
                                iconUrl={(this.state.hardware === "ledger" ? "/img/icons/checkmark-green@2x.png" : null)}
                                isSelected={(this.state.hardware === "ledger")}
                                onClick={this.handleLedgerClick}
                            />
                        </div>
                    </div>
                </div>

                <div className="UnlockWalletCard__warning mt-3">
                    {warning}
                </div>

                <div className="UnlockColdWalletLedger__choose-derivation-path mt-3">
                    {
                        (this.state.hardware === "ledger") &&
                        <select value={this.state.derivationPath}
                            onChange={this.handleDerivationPathChange}
                            className={"UnlockColdWalletLedger__select"}
                        >
                            <option value={EthereumDerivationPath}>Ethereum - m/44'/60'/0'/0</option>
                            <option value={EthereumOtherDerivationPath}>Ethereum - m/44'/60'/0'</option>
                            <option value={EthereumLedgerLiveDerivationPath}>Ethereum - Ledger Live - m/44'/60'</option>
                        </select>
                    }
                </div>

                <div className="UnlockWalletViaColdWallet__footer mt-5">
                    <GradientButton title="Continue"
                        loading={this.state.loading}
                        onClick={this.handleChooseHardwareClick}
                        disabled={isDisabled}
                    />
                </div>
            </div>
        );
    }
}



class UnlockWalletCard extends React.Component {
    componentDidMount() {

    }
    render() {
        Wallet.setUnlockStrategy(this.props.unlockStrategy);
        const { t } = this.props
        let unlockWalletStrategyContent = null;

        

        if (this.props.unlockStrategy === WalletUnlockStrategy.KEYSTORE_FILE) {
            unlockWalletStrategyContent = (
                <UnlockWalletViaKeystoreFile unlockWallet={this.props.unlockWallet} t={t} />
            );
        }
        else if (this.props.unlockStrategy === WalletUnlockStrategy.MNEMONIC_PHRASE) {
            unlockWalletStrategyContent = (
                <UnlockWalletViaMnemonicPhrase unlockWallet={this.props.unlockWallet} t={t} />
            );
        }
        else if (this.props.unlockStrategy === WalletUnlockStrategy.PRIVATE_KEY) {
            unlockWalletStrategyContent = (
                <UnlockWalletViaPrivateKey unlockWallet={this.props.unlockWallet} t={t} />
            );
        }
        else if (this.props.unlockStrategy === WalletUnlockStrategy.COLD_WALLET) {
            unlockWalletStrategyContent = (
                <UnlockWalletViaColdWallet getHardwareWalletAddresses={this.props.getHardwareWalletAddresses} t={t} />
            );
        }

        return (
            <div className="container-fliud">

                <div>

                    <div className="row">

                        <div className="col-lg-12 dsda5dwd">
                            <div className="UnlockWalletCard__content">
                                <div className="UnlockWalletCard__header">
                                    <ul className="nav justify-content-between p-4 mt-3 unlock-nav text-center" >
                                  
                                             <li className="Privatekey2nd">
                                                <NavLink exact to={"/unlock/" + WalletUnlockStrategy.MNEMONIC_PHRASE}>
                                                    <img src="/latest/MNEMONIC.svg" ></img>
                                                    <img src="/latest/MNEMONIC2.svg" className="scd-img"></img>
                                                    <p className="mnemonic">
                                                        {t(`MNEMONIC`)}
                                                    </p>
                                                    <div className="bg-shades-new"></div>
                                                </NavLink>
                                            </li>

                                            <li>
                                                <NavLink exact to={"/unlock/" + WalletUnlockStrategy.KEYSTORE_FILE}>
                                                    <img src="/latest/KEYSTORE grey.svg" ></img>
                                                    <img src="/latest/KEYSTORE1.svg" className="scd-img"></img>
                                                    <p className="keystore">
                                                        {t(`KEYSTORE`)}

                                                    </p>
                                                    <div className="bg-shades-new"></div>
                                                </NavLink>
                                            </li>

                                            <li>
                                                <NavLink exact to={"/unlock/" + WalletUnlockStrategy.PRIVATE_KEY}>
                                                    <img src="/latest/private key.svg" />
                                                    <img src="/latest/PRIVATE KEY 2.svg" className="scd-img"></img>
                                                    <p className="PrivateKey">
                                                        {t(`PRIVATE_KEY`)}
                                                    </p>
                                                    <div className="bg-shades-new"></div>
                                                </NavLink>
                                            </li>
                                    



                                    </ul>
                                </div>
                                {unlockWalletStrategyContent}
                            </div>
                        </div>
                    </div>



                    <div className="UnlockWalletPage__subtitle">

                        <span>{t(`DONT_HAVE_A_WALLET`)}</span>
                        <Link to="/create">{t(`CREATE_WALLET`)}</Link>
                    </div>


                </div>



            </div >







        );
    }
}

class UnlockWalletPage extends React.Component {
    constructor() {
        super();

        this.unlockWallet = this.unlockWallet.bind(this);
        this.getHardwareWalletAddresses = this.getHardwareWalletAddresses.bind(this);
    }
    componentDidMount() {

    }
    setWalletAddress(address) {
        return {
            type: SET_WALLET_ADDRESS,
            address: address
        }
    }

    unlockWallet(strategy, password, data) {
        this.props.dispatch(unlockWallet(strategy, password, data));
    }

    getHardwareWalletAddresses(hardware, page, derivationPath) {
        this.props.dispatch(getHardwareWalletAddresses(hardware, page, derivationPath));
    }

    render() {
        const { t } = this.props
        let unlockStrategy = this.props.match.params.unlockStrategy;

        return (
            <div className="UnlockWalletPage">
                <div className="UnlockWalletPage__wrapper">
                    <div className="UnlockWalletPage__title">
                        {t(`UNLOCK_YOUR_WALLET`)}
                        <img src="../img/icons/Group 81.svg" alt=""  />
                    </div>


                    <UnlockWalletCard unlockStrategy={unlockStrategy} t={t}
                        unlockWallet={this.unlockWallet.bind(this)}
                        getHardwareWalletAddresses={this.getHardwareWalletAddresses.bind(this)}
                    />


                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

export default withTranslation()(connect(mapStateToProps)(UnlockWalletPage));
