import React from 'react'
import './PrivateKeyModal.css';
import Modal from '../components/Modal'
import GradientButton from '../components/buttons/GradientButton'
import { store } from "../state";
import { hideModal } from "../state/actions/Modals";
import { copyToClipboard } from '../utils/Utils';
import Alerts from '../services/Alerts';
import { withTranslation } from "react-i18next";

export  class PrivateKeyModal extends React.Component {
    constructor() {
        super();

        this.close = this.close.bind(this);
    }
    copyAddress = () => {
        copyToClipboard(this.props.privateKey);
        Alerts.showSuccess(this.props.t(`YOUR_ADDRESS_HAS_BEEN_COPIED`));
    }



    close() {
        store.dispatch(hideModal());
    }

    render() {
        return (
            <Modal>
                <div className="PrivateKeyModal">
                    <img src="/latest/PRIVATE KEY 2.svg" className="custompricvetkeyr" height="80" />
                    <div className="PrivateKeyModal__title">
                        Your Private Key
                    </div>
                    <div className="PrivateKeyModal__instructions">
                        Backup the text below on paper or digitally and keep it somewhere safe and secure.
                    </div>
                    <div className="private-ky">
                    <textarea className="PrivateKeyModal__private-key"
                        value={this.props.privateKey}
                        readOnly={true}
                    />

                    <a className="NavBar__wallet-copy-address-icon iconxsxa" onClick={this.copyAddress}>
                        <img src="/img/icons/copy@2x.svg" />
                    </a>
                    </div>

                    <GradientButton className="GradientButton" title="Close"
                        onClick={this.close}
                    />
                </div>
            </Modal>
        )
    }
}
export default withTranslation()(PrivateKeyModal);