import Pando from './services/Pando';
import Networks, { canViewSmartContracts } from './constants/Networks';
import Pandojs from "./libs/pandojs.esm";

export function isStakingAvailable() {
    return true;
}

export function canStakeFromHardwareWallet() {
    return true;
}

export function areSmartContractsAvailable() {
    const network = Pando.getChainID();

    return canViewSmartContracts(network);
}

export function getMinStakeAmount(purpose) {
    const network = Pando.getChainID();

    if (purpose === Pandojs.StakePurposes.StakeForValidator) {
        return 250000.0;
    }

    //Unknown
    return 250;
}
