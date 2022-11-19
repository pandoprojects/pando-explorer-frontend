import React from 'react'
import './WithdrawStakeModal.css';
import Modal from '../components/Modal'
import WithdrawStakeTxForm from '../components/transactions/WithdrawStakeTxForm'
import Pando from "../services/Pando";
import GradientButton from "../components/buttons/GradientButton";
import Networks, { canGuardianNodeStake } from "../constants/Networks";
import PandoJS from "../libs/pandojs.esm";
import StakePurposeSelector, { StakePurposeSelectorItem } from '../components/StakePurposeSelector';
import { withTranslation } from 'react-i18next';

class WithdrawStakeModal extends React.Component {
    constructor() {
        super();

        this.state = {
            purpose: null,
            selectedPurpose: null
        };
    }

    handleContinueClick = () => {
        this.setState({
            purpose: this.state.selectedPurpose
        });
    };

    handlePurposeClick = (purpose) => {
        this.setState({
            selectedPurpose: purpose
        });
    };

    render() {
        const { purpose, selectedPurpose } = this.state;
        const chainId = Pando.getChainID();
        const isGuardianNodeStakingDisabled = !canGuardianNodeStake(chainId);
        const { t } = this.props

        return (
            <Modal>
                <div className="WithdrawStakeModal">
                    <div className="WithdrawStakeModal__title">
                    {/* <img src="../img/logo/Group 131.svg"/>  */}
                        {t(`WITHDRAW_STAKE`)}
                    </div>
                    {
                        (purpose !== null) &&
                        <WithdrawStakeTxForm purpose={purpose}
                            key={purpose} />
                    }
                    { 
                        purpose === null &&
                        <div className={"StakePurposeContainer"}>
                            <div className={"StakePurposeContainer__instructions"}>
                                {t(`PLEASE_CHOOSE_THE_STAKING_PURPOSE`)}
                            </div>
                            <StakePurposeSelector>
                                <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForValidator}
                                    t={t}
                                    title={"ZYTATRON_NODE"}
                                    subtitle={"WITHDRAW_STAKE_FROM_A_ZYTATRON_NODE"}
                                    isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForValidator)}
                                    onClick={this.handlePurposeClick}
                                />
                                <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForGuardian}
                                    t={t}
                                    title={"METATRON_NODE"}
                                    subtitle={"WITHDRAW_STAKE_FROM_YOUR_METATRON_NODE"}
                                    isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForGuardian)}
                                    isDisabled={isGuardianNodeStakingDisabled}
                                    onClick={this.handlePurposeClick}
                                />
                                <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronEnterprise}
                                    t={t}
                                    title={"RAMETRON_NODE"}
                                    subtitle={"WITHDRAW_STAKE_FROM_YOUR_RAMETRON_NODE"}
                                    isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronEnterprise)}
                                    isDisabled={isGuardianNodeStakingDisabled}
                                    onClick={this.handlePurposeClick}
                                />
                            </StakePurposeSelector>
                            <div className={"StakePurposeContainer__footer"}>
                                <GradientButton title={t(`CONTINUE`)} className="GradientButton"
                                    disabled={(selectedPurpose === null)}
                                    onClick={this.handleContinueClick}
                                />
                            </div>
                        </div>
                    }
                </div>
            </Modal>
        )
    }
}
export default withTranslation()(WithdrawStakeModal)
