import React from 'react'
import './DepositStakeModal.css';
import Modal from '../components/Modal'
import DepositStakeTxForm from '../components/transactions/DepositStakeTxForm'
import Pando from "../services/Pando";
import GradientButton from "../components/buttons/GradientButton";
import Networks, { canGuardianNodeStake } from "../constants/Networks";
import PandoJS from "../libs/pandojs.esm";
import StakePurposeSelector, { StakePurposeSelectorItem } from '../components/StakePurposeSelector';
import { withTranslation } from 'react-i18next';

class DepositStakeModal extends React.Component {
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
                <div className="DepositStakeModal">
                    <div className="DepositStakeModal__title">
                    {/* <img src="../img/logo/Group 131.svg"/> */}
                        {t(`DEPOSIT_STAKE`)}
                    </div>
                    {
                        (purpose !== null) &&
                        <DepositStakeTxForm purpose={purpose}
                            key={purpose} />
                    }
                    {
                        purpose === null &&
                        <div className={"StakePurposeContainer"}>
                            <div className={"StakePurposeContainer__instructions"}>
                                {t(`PLEASE_CHOOSE_THE_STAKING_PURPOSE`)}
                            </div>
                            <StakePurposeSelector t={t}>
                                <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForValidator}
                                    title={t(`ZYTATRON NODE`)}
                                    subtitle={"DEPOSIT_STAKE_TO_A_ZYTATRON_NODE"}
                                    isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForValidator)}
                                    onClick={this.handlePurposeClick}
                                    t={t}
                                />
                                <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForGuardian}
                                    title={t(`METATRON NODE`)}
                                    subtitle={"DEPOSIT_STAKE_TO_YOUR_METATRON_NODE"}
                                    isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForGuardian)}
                                    isDisabled={isGuardianNodeStakingDisabled}
                                    onClick={this.handlePurposeClick}
                                    t={t}
                                />
                              

                                <div className="dropdown rtdepositestake for-active">
                                <div className="dd-button dropdown-toggle" type="button" id="dropdownMenuButtonrt" data-toggle="dropdown" aria-expanded="false">
                                
                                <div>
                                {(() => {
                                  if (this.state.selectedPurpose == 2) {
                                    return (
                                        <div className="internaldepositeclass">
                                            <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronEnterprise}
                                           title={t(`RAMETRON_NODE_ENTERPRISE`)}
                                            subtitle={"DEPOSIT_STAKE_TO_YOUR_RAMETRON_NODE"}
                                            isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronEnterprise)}
                                            onClick={this.handlePurposeClick}
                                            t={t}
                                        />
                                      </div>
                                    )
                                  } else if (this.state.selectedPurpose == 3) {
                                    return (
                                        <div className="internaldepositeclass">
                                           <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronPro}
                                             title={t(`RAMETRON_NODE_PRO`)}
                                            subtitle={"DEPOSIT_STAKE_TO_YOUR_RAMETRON_NODE"}
                                            isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronPro)}
                                            onClick={this.handlePurposeClick}
                                            t={t}
                                  />
                                      </div>
                                    )
                                  }  else if (this.state.selectedPurpose == 4) {
                                    return (
                                        <div className="internaldepositeclass">
                                      <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronLite}
                                      title={t(`RAMETRON_NODE_LITE`)}
                                      subtitle={"DEPOSIT_STAKE_TO_YOUR_RAMETRON_NODE"}
                                      isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronLite)}
                                      onClick={this.handlePurposeClick}
                                      t={t}
                                  />
                                      </div>
                                    )
                                  }
                                  else if (this.state.selectedPurpose == 5) {
                                    return (
                                        <div className="internaldepositeclass">
                                      <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronMobile}
                                       title={t(`RAMETRON_NODE_MOBILE`)}
                                      subtitle={"DEPOSIT_STAKE_TO_YOUR_RAMETRON_NODE"}
                                      isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronMobile)}
                                      onClick={this.handlePurposeClick}
                                      t={t}
                                  />
                                      </div>
                                    )
                                  }
                                  else{    
                                     return (
                                    <div className="internaldepositeclass">
                                    <StakePurposeSelectorItem
                                    title={"RAMETRON_NODE"}
                                    subtitle={"DEPOSIT_STAKE_TO_YOUR_RAMETRON_NODE"}
                                    t={t}
                                />
                                    </div>
                                     )
                                  }
                                })()}
                              </div>
                              
                                   
                             
                                    <input type="checkbox" className="dd-input" id="test" />
                                    <img src="../img/logo/Icon awesome-angle-down.svg" alt="" className="imgClass"/>
                                </div>
                                <ul className="dd-menu dropdown-menu">
                               
                                   {/* <li>
                                        <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronEnterprise}
                                        title={"RAMETRON_NODE_ENTERPRISE"}
                                       
                                        isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronEnterprise)}
                                        onClick={this.handlePurposeClick}
                                        t={t}
                                    />
                                   </li>

                                   
                                   <li>
                                        <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronPro}
                                        title={"RAMETRON_NODE_PRO"}
                                       
                                        isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronPro)}
                                        onClick={this.handlePurposeClick}
                                        t={t}
                                    />
                                   </li> */}

                                   
                                   <li>
                                        <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronLite}
                                        title={"RAMETRON_NODE_LITE"}
                                     
                                        isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronLite)}
                                        onClick={this.handlePurposeClick}
                                        t={t}
                                    />
                                   </li>

                                   
                                   <li>
                                        <StakePurposeSelectorItem purpose={PandoJS.StakePurposes.StakeForRametronMobile}
                                        title={"RAMETRON_NODE_MOBILE"}
                                      
                                        isSelected={(selectedPurpose === PandoJS.StakePurposes.StakeForRametronMobile)}
                                        onClick={this.handlePurposeClick}
                                        t={t}
                                    />
                                   </li>
                                </ul>
                                          
                                
                            </div>

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
export default withTranslation()(DepositStakeModal)
