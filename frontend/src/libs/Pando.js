import { BigNumber } from 'bignumber.js';
import PandoJS from './pandojs.esm';


export default class Pando {
  static _chainId = 'pandonet';

  static get chainId() {
    return this._chainId;
  }

  static getTransactionFee() {
    //10^12 TFuelWei
    return 0.00003;
  }

  static unsignedSmartContractTx(txData, sequence) {
    let { from, to, data, value, transactionFee, gasLimit } = txData;

    const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 pando = 10^18 pandoWei, 1 Gamma = 10^ TFuelWei
    const feeInPTXWei = (new BigNumber(transactionFee)).multipliedBy(ten18); // Any fee >= 10^12 TFuelWei should work, higher fee yields higher priority
    const senderSequence = sequence;
    const gasPrice = feeInPTXWei;

    let tx = new PandoJS.SmartContractTx(from, to, gasLimit, gasPrice, data, value, senderSequence);

    return tx;
  }
}
