import { zipMap } from "../utils/Utils";
import _ from "lodash";


const Networks = {
    __deprecated__ETHEREUM: 'ethereum',

    PANDO_NETWORK: 'pandonet',

};

export const NetworksWithDescriptions = [
    {
        id: Networks.PANDO_NETWORK,
        name: "Pando Net",
        description: "Pando net ",
        faucetId: "smart_contract"
    }
];

export const NetworksById = zipMap(NetworksWithDescriptions.map(({ id }) => id), NetworksWithDescriptions);

export const NetworkExplorerUrls = {

    [Networks.PANDO_NETWORK]: 'https://explorer.pandoproject.org/'
};

export function isEthereumNetwork(network) {
    return (network === Networks.__deprecated__ETHEREUM);
}

export function isPandoNetwork(network) {
    return (network !== Networks.__deprecated__ETHEREUM);
}

export function canGuardianNodeStake(network) {
    return true;
}

export function canViewSmartContracts(network) {
    return (network === Networks.PANDO_NETWORK);
}

export function getNetworkName(networkId) {
    return _.get(NetworksById, [networkId, 'name']);
}

export function getNetworkFaucetId(networkId) {
    return _.get(NetworksById, [networkId, 'faucetId']);
}

export default Networks;
