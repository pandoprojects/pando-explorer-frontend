import _ from 'lodash';
import React from "react";
import './SettingsPage.css';
import PageHeader from "../components/PageHeader";
import GradientButton from "../components/buttons/GradientButton";
import Wallet from '../services/Wallet';
import { downloadFile } from "../utils/Utils";
import Alerts from '../services/Alerts';
import apiService from '../services/Api';
import Router from '../services/Router';
import { store } from "../state";
import { logout } from "../state/actions/Wallet";
import { withTranslation } from 'react-i18next';
class ExportKeystoreContent extends React.Component {
    constructor() {
        super();

        this.defaultState = {
            currentPassword: '',
            password: '',
            passwordConfirmation: '',

            loading: false,

            error: null
        };

        this.state = this.defaultState;

        this.handleChange = this.handleChange.bind(this);
        this.prepareForExport = this.prepareForExport.bind(this);
        this.exportKeystore = this.exportKeystore.bind(this);
        this.logout = this.logout.bind(this);
    }

    validate() {
        if (this.state.password.length > 0 &&
            this.state.passwordConfirmation.length > 0 &&
            this.state.password !== this.state.passwordConfirmation) {
            this.setState({ error: `${this.props.t(`YOUR_PASSWORDS_DO_NOT_MATCH`)}` });
        }
        else {
            this.setState({ error: "" });
        }
    }

    isValid() {
        return (this.state.password.length > 0 &&
            this.state.passwordConfirmation.length > 0 &&
            this.state.password === this.state.passwordConfirmation);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({ [name]: value }, this.validate);
    }

    exportKeystore() {
        try {
            let keystore = Wallet.exportKeystore(this.state.currentPassword, this.state.password);
            downloadFile(keystore.address + '.keystore', JSON.stringify(keystore));
            this.setState(this.defaultState);
        }
        catch (e) {
            this.setState({
                loading: false
            });

            Alerts.showError(e.message);
        }

    }
    logout() {
        //apiService.lockWallet({ address: Wallet.getWalletAddress() });
        window.localStorage.clear();
        store.dispatch(logout());
    }


    prepareForExport() {
        if (navigator.onLine) {
            this.setState({
                loading: true
            });

            setTimeout(this.exportKeystore, 1000);
        } else {
            Router.push(`/offline`)


        }
    }

    render() {
        const { t } = this.props
        return (
            <div className="ExportKeystoreContent">
                <div className="InputTitle "style={{ color: 'white'}} >{t(`CURRENT_PASSWORD`)}</div>
                <input className="RoundedInput form-control" 
                    placeholder={t(`ENTER_CURRENT_PASSWORD`)}
                    name="currentPassword"
                    maxLength="24" size="24"
                    type="password"
                    value={this.state.currentPassword}
                    onChange={this.handleChange}
                />
                 
                <div className="InputTitle" style={{ color: 'white', }}>{t(`SET_A_NEW_PASSWORD`)}</div>
                <input className="RoundedInput form-control"
                    placeholder={t(`SET_A_NEW_PASSWORD`)}
                    maxLength="24" size="24"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <div className="InputTitle" style={{ color: 'white' }}>{t(`CONFIRM_NEW_PASSWORD`)}</div>
                <input className="RoundedInput form-control"
                    placeholder={t(`RE_ENTER_PASSWORD`)}
                    maxLength="24" size="24"
                    name="passwordConfirmation"
                    type="password"
                    value={this.state.passwordConfirmation}
                    onChange={this.handleChange}
                />
                <div className="InputError">
                    {this.state.error}
                </div>

                <GradientButton  title={t(`EXPORT_KEYSTORE`)}className="GradientButton"
                    onClick={this.prepareForExport}
                    
                    loading={this.state.loading}
                    disabled={(this.state.loading || this.isValid() === false)}
                />
            </div>






        );
    }
}

class SettingsSection extends React.Component {
    render() {
        return (
            <div className="SettingsSection">
                <div className="SettingsSection__title">
                    {this.props.title}
                </div>

                <div className="SettingsSection__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class SettingsPage extends React.Component {
    render() {
        const { t } = this.props
        // let canExport = _.isNil(Wallet.getWallet() || window.localStorage.getItem('wallet'));

        return (
            <div className="SettingsPage">
                <div className="SettingsPage__detail-view">
                    <PageHeader title={t(`SETTINGS`)}
                        sticky={false}
                    />

                    {

                        <SettingsSection style={{width: "23%"}} title={t(`EXPORT_KEYSTORE`)}>
                            <ExportKeystoreContent t={t} />
                        </SettingsSection>
                    }
                </div>
            </div>
        );
    }
}

export default withTranslation()(SettingsPage);
