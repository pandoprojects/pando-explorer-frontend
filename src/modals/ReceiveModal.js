import React from 'react'
import './ReceiveModal.css';
import Modal from '../components/Modal'
import Wallet from '../services/Wallet'
import GhostButton from '../components/buttons/GhostButton'
import { copyToClipboard } from "../utils/Utils";
import Alerts from '../services/Alerts'
import { getNetworkFaucetId, getNetworkName } from "../constants/Networks";
import Pando from "../services/Pando";
import Api from "../services/Api";
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

class ReceiveModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    handleCopyAddressClick = () => {
        let address = Wallet.getWalletAddress();

        copyToClipboard(address);

        Alerts.showSuccess(this.props.t(`YOUR_ADDRESS_HAS_BEEN_COPIED`));
    };

    handleFaucetClick = async () => {
        this.setState({
            isLoading: true
        });

        try {
            const response = await Api.callFaucet(Wallet.getWalletAddress(), getNetworkFaucetId(Pando.getChainID()));
            const responseJSON = await response.json();

            if (_.get(responseJSON, 'message')) {
                Alerts.showSuccess("Your PTX has been sent.");
            }
        } catch (e) {
            Alerts.showError("You have exceeded the faucet limit");
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        const { isLoading } = this.state;
        let { t } = this.props
        let address = Wallet.getWalletAddress();
        let qrCodeURL = `https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=${address}&choe=UTF-8&chld=L|0`;
        let hasFaucet = (_.isNil(getNetworkFaucetId(Pando.getChainID())) === false);

        return (
            <Modal>
                <div className="ReceiveModal">
                    <div className="ReceiveModal__title">
                    <img src={'/img/icons/receive@2x.svg'}/> <br/>

                    {/* <img src="/img/icons/receive@2x.svg" alt="" />
                    <img src="../icon" alt="" srcset="" /> */}

                        {t(`RECEIVE`)}
                    </div>
                    <div className="ReceiveModal__public-address-title thin">
                        {t(`MY_PUBLIC_ADDRESS`)}
                    </div>
                    <div className="ReceiveModal__public-address">
                       <p> {address} </p>
                        <div className="ReceiveModal__buttons">
                        <GhostButton 
                            iconUrl="/img/icons/copy@2x.svg"
                            onClick={this.handleCopyAddressClick}
                        />
                    </div>
                    </div>
                   

                    <img src={qrCodeURL}
                        className="ReceiveModal__qr"
                    />

                    {/* {
                        hasFaucet &&
                        <div className="ReceiveModal__faucet">
                            <GhostButton title="Faucet"
                                         disabled={isLoading}
                                         loading={isLoading}
                                         className={"ReceiveModal__faucet-button"}
                                         iconUrl="/img/tab-bar/receive@2x.png"
                                         onClick={this.handleFaucetClick}
                            />
                            <div className="ReceiveModal__faucet-message">
                                Receive a small amount of PTX on {getNetworkName(Pando.getChainID())}
                            </div>
                        </div>
                    } */}
                </div>
            </Modal>
        )
    }
}
export default withTranslation()(ReceiveModal)
