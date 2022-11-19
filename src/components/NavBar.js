import _ from 'lodash';
import { connect } from 'react-redux'
import React from "react";
import './NavBar.css';
import Wallet from "../services/Wallet";
import { store } from '../state';
import { logout } from "../state/actions/Wallet";
import { copyToClipboard } from "../utils/Utils";
import Alerts from "../services/Alerts";
import { showModal } from "../state/actions/Modals";
import ModalTypes from "../constants/ModalTypes";
import { withTranslation } from 'react-i18next';
import { Languages, lang } from '../constants/languageModal'
import { Link } from "react-router-dom";
import config from '../Config';

const classNames = require('classnames');


//  This component is all about the navbar and its functionlity like language change,logout button,copy address
class NavBar extends React.Component {
    constructor() {
        super();

        this.logout = this.logout.bind(this);
        this.copyAddress = this.copyAddress.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
        this.state = { lang: lang, languages: Languages, selectedLanguage: '' }
    }

    componentDidMount() {
        this.setState({ selectedLanguage: this.props.i18n.language })
    }

    logout() {
        //apiService.lockWallet({ address: Wallet.getWalletAddress() });
        store.dispatch(logout());
    }

    copyAddress() {
        let address = Wallet.getWalletAddress();

        copyToClipboard(address);

        Alerts.showSuccess("Your address has been copied");
    }

    onNetworkBadgeClick = () => {
        let address = Wallet.getWalletAddress();

        if (address) {
            alert("You cannot change networks while a wallet is unlocked.")
        }
        else {
            store.dispatch(showModal({
                type: ModalTypes.NETWORK_SELECTOR,
            }));
        }
    };


    changeLanguage = (lang) => {
        for (const key in this.state.languages) {
            if (key === lang) {
                this.setState({ selectedLanguage: lang })
                this.props.i18n.changeLanguage(this.state.languages[key])
            }
        }

    }
    


    render() {
        const { network, i18n, t } = this.props;
        const address = Wallet.getWalletAddress();
        return (
            <div>
                <div className={`NavBar NavBar--is-centered`}>

                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                        <Link to="/"><img className="NavBar__logo cursor-pointer" src={'/img/logo/pando_wallet_logo@2x.svg'} /></Link>

                    </div>
{/*  */}
                    <div className="dropdown" >
                        <div className="ver-fac">
                        <div className="networktype">{config.name}
                            <div className="footercustoma">
                                <a href={config.githubURL} target="_blank">Version {config.version}</a>
                            </div>
                        </div>
                        {/* <div className="networktype fauc">
                            <div className="footercustoma">
                            <a href="https://forms.gle/Wt6Zje4J5rm1yUfJ9" target="_blank">Faucet <span>Request</span></a>
                            </div>
                        </div> */}
                        </div>
                        <div className="dd-button dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">

                            {this.state.selectedLanguage}

                            <img src="../img/logo/Icon awesome-angle-down.svg " alt="" className="imgClass" />
                            <input type="checkbox" className="dd-input" id="test" />

                        </div>

                        <ul className="dd-menu dropdown-menu">

                            {this.state.lang && this.state.lang.map((val, index) => (
                                <li key={index} onClick={() => this.changeLanguage(val)} >{val}</li>
                            ))}
                        </ul>


                    </div>
                  
                </div>
                

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        network: state.wallet.network
    };
};

export default withTranslation()(connect(mapStateToProps)(NavBar));
// 