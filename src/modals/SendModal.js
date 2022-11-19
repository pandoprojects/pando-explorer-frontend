import React from 'react'
import './SendModal.css';
import Modal from '../components/Modal'
import EthereumNetworkTxForm from '../components/EthereumNetworkTxForm'
import SendTxForm from '../components/transactions/SendTxForm'
import TokenTypes from "../constants/TokenTypes";
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

class SendModal extends React.Component {
    render() {
        const { t } = this.props
        let tokenType = (this.props.tokenType || TokenTypes.PANDO);
        let showPandoForm = (tokenType === TokenTypes.PANDO || tokenType === TokenTypes.PTX);
        let form = null;

        if (showPandoForm) {
            form = <SendTxForm defaultTokenType={tokenType} t={t} />;
        }
        else {
            form = <EthereumNetworkTxForm defaultTokenType={tokenType} t={t} />;
        }

        return (
            <Modal>
                <div className="SendModal">
                    <div className="SendModal__title">
                 <img src={'/img/icons/send-active@2x.svg'}/> <br/>
                        {t(`SEND`)}
                    </div>

                    {form}

                </div>
            </Modal>
        )
    }
}

export default withTranslation()(SendModal)
