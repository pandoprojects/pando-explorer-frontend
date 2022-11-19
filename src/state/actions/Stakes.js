import Api from '../../services/Api'
import { reduxFetch } from './Api'
import {
    FETCH_STAKES,
    FETCH_STAKES_START
} from "../types/Stakes";
import Wallet from "../../services/Wallet";
import Pando from "../../services/Pando";

export function fetchStakes() {
    let address = Wallet.getWalletAddress();

    return reduxFetch(FETCH_STAKES, function () {
        return Api.fetchStakes(address)
    });
}
