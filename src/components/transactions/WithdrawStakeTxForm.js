import React from 'react'
import './TxForm.css';
import './WithdrawStakeTxForm.css';
import _ from 'lodash'
import { connect } from 'react-redux'
import Pando from '../../services/Pando'
import FormInputContainer from '../FormInputContainer'
import GradientButton from '../buttons/GradientButton';
import { store } from "../../state";
import { showModal } from "../../state/actions/Modals";
import ModalTypes from "../../constants/ModalTypes";
import PandoJS from "../../libs/pandojs.esm";
import { withTranslation } from 'react-i18next';



//  this component is associated with the withdraw ptx functionlity  

class WithdrawStakeTxForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            holder: '',
            transactionFee: Pando.getTransactionFee(),

            invalidHolder: false,
            height: 0,
            amount: 0,
            sequence: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({ [name]: value }, () => {
            this.validate();
        });
    }

    handleWithdrawStakeClick = () => {
        store.dispatch(showModal({
            type: ModalTypes.WITHDRAW_STAKE_CONFIRMATION,
            props: {
                network: Pando.getChainID(),
                transaction: {
                    purpose: this.props.purpose,
                    from: this.props.walletAddress,
                    holder: this.state.holder,
                    height: this.state.height,
                    sequence: this.state.sequence

                }
            }
        }));



    };

    isValid() {

        return (
            this.state.holder.length > 0 &&
            this.state.invalidHolder === false
        );


    }

    validate() {
        if (this.state.holder.length > 0) {
            this.validateHolder();
        }
    }

    async validateHolder() {
        let isValid = false;
        isValid = Pando.isAddress(this.state.holder);
        this.setState({ invalidHolder: (isValid === false) });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.holder !== prevState.holder) {
            this.validateHolder();
        }
    }

    render() {
        const { purpose, t } = this.props;
        let transactionFeeValueContent = (
            <React.Fragment>
                <span>{t(`TRANSACTION_FEE`)}</span>
            </React.Fragment>
        );

        let isValid = this.isValid();
        let holderError = null;

        if (this.state.invalidHolder) {
            if (purpose === PandoJS.StakePurposes.StakeForValidator) {
                holderError = t(`INVALID_ZYTATRON_NODE_ADDRESS_(HOLDER)`);
            }
            else if (purpose === PandoJS.StakePurposes.StakeForGuardian) {
                holderError = t(`INVALID_METATRON_NODE_ADDRESS_(HOLDER)`);
            }
            else {
                holderError = t(`INVALID_RAMETRON_NODE_ADDRESS_(HOLDER)`);
            }
        }

        let holderTitle = "";
        let holderPlaceholder = "";
        let heightTitle = '';
        let heightPlaceholder = ''
        let noteTitle = ''
        if (purpose === PandoJS.StakePurposes.StakeForValidator) {
            holderTitle = t(`ZYTATRON_NODE_ADDRESS_(HOLDER)`);
            holderPlaceholder = t(`ENTER_ZYTATRON_NODE_ADDRESS`);
            heightTitle = t(`HEIGHT`);
            heightPlaceholder = t(`ENTER_BLOCK_HEIGHT`);
        }
        else if (purpose === PandoJS.StakePurposes.StakeForGuardian) {
            holderTitle = t(`METATRON_NODE_ADDRESS_(HOLDER)`);
            holderPlaceholder = t(`ENTER_METATRON_NODE_ADDRESS`);
            heightTitle = t(`HEIGHT`);
            heightPlaceholder = t(`ENTER_BLOCK_HEIGHT`);
        }
        else {
            holderTitle = t(`RAMETRON_NODE_ADDRESS_(HOLDER)`);
            holderPlaceholder = t(`ENTER_RAMETRON_NODE_ADDRESS`);
            heightTitle = t(`HEIGHT`);
            heightPlaceholder = t(`ENTER_BLOCK_HEIGHT`);
        }

        return (
            <div className="TxForm">
                <FormInputContainer title={holderTitle}
                    error={holderError}>
                    <input className="BottomBorderInput"
                        name="holder"
                        placeholder={holderPlaceholder}
                        value={this.state.holder}
                        onChange={this.handleChange} />

                </FormInputContainer>
                {
                    <span className="text-light">
                        {noteTitle}
                    </span>
                }
               
                <GradientButton title={t(`WITHDRAW_STAKE`)} className="GradientButton"
                    disabled={isValid === false}
                    onClick={this.handleWithdrawStakeClick}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        walletAddress: state.wallet.address,
    };
};

export default withTranslation()(connect(mapStateToProps)(WithdrawStakeTxForm));
