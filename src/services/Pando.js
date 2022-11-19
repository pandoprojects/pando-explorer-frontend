import { BigNumber } from 'bignumber.js';
import Ethereum from "./Ethereum";
import PandoJS from '../libs/pandojs.esm';
import Config from '../Config';
import RLP from 'eth-lib/lib/rlp';
import Bytes from 'eth-lib/lib/bytes';
import { NetworkExplorerUrls } from '../constants/Networks';

export default class Pando {
    static _chainId = Config.defaultPandoChainID;

    static setChainID(newChainID) {
        this._chainId = newChainID;
    }

    static getChainID() {
        return this._chainId;
    }

    static getTransactionExplorerUrl(transaction) {
        const chainId = this.getChainID();
        const urlBase = NetworkExplorerUrls[chainId];

        return `${urlBase}/txs/${transaction.hash}`;
    }

    static getTransactionFee() {
        //10^12 PTOWei
        return 0.3;
    }

    static getSmartContractGasPrice(){
        return 0.00004;
    }

    static unsignedSendTx(txData, sequence, type = 1) {
        let { tokenType, from, to, amount, transactionFee } = txData;
       
        transactionFee = transactionFee
        transactionFee = 3;
          
        const ten18 = (new BigNumber(10)).pow(18);
        const ten16 = (new BigNumber(10)).pow(16);
        const pandoWeiToSend = (tokenType === 'PTX' ? (new BigNumber(0)).multipliedBy(ten18) : (new BigNumber(0)));
        const ptoWeiToSend = (tokenType === 'PTX' ? (new BigNumber(amount)).multipliedBy(ten18) : (new BigNumber(0)));
        const feeInPTOWei = (new BigNumber(transactionFee)).multipliedBy(ten16); // Any fee >= 10^12 PTOWei should work, higher fee yields higher priority
        const senderAddr = from;
        const receiverAddr = to;
        const senderSequence = sequence;
        const outputs = [
            {
                address: receiverAddr,
                pandowei: pandoWeiToSend,
                ptxwei: ptoWeiToSend,
            }
        ];
        let tx;
      
            tx = new PandoJS.SendTx(senderAddr, outputs, feeInPTOWei, senderSequence);
        


        return tx;

    }

    static unsignedDepositStakeTx(txData, sequence) {

        let { tokenType, from, holder, amount, transactionFee, purpose } = txData;
       
       
        const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1  = 10^18 , 1 Gamma = 10^ 
        const pandoWeiToSend = (tokenType === 'PTX' ? (new BigNumber(amount)).multipliedBy(ten18) : (new BigNumber(0)));
        const feeInPTOWei = transactionFee // Any fee >= 10^12  should work, higher fee yields higher priority
        const source = from;
        const senderSequence = sequence;

        let tx = null;

        if (purpose === PandoJS.StakePurposes.StakeForValidator) {
            tx = new PandoJS.DepositStakeTx(source, holder, pandoWeiToSend, feeInPTOWei, purpose, senderSequence);
        }
        else{
            tx = new PandoJS.DepositStakeV2Tx(source, holder, pandoWeiToSend, feeInPTOWei, purpose, senderSequence);
        }

        return tx;
    }

    static unsignedWithdrawStakeTx(txData, sequence) {
        let { tokenType, from, holder, transactionFee, purpose } = txData;
        const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1  = 10^18 , 1 Gamma = 10^ 
        const feeInPTOWei = transactionFee; // Any fee >= 10^12  should work, higher fee yields higher priority
        const source = from;
        const senderSequence = sequence;

        let tx = new PandoJS.WithdrawStakeTx(source, holder, feeInPTOWei, purpose, senderSequence);

        return tx;
    }

    static unsignedSmartContractTx(txData, sequence) {
      
        let { from, to, data, value, transactionFee, gasLimit } = txData;
       
            
        const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1  = 10^18 , 1 Gamma = 10^ 
        const feeInPTOWei = (new BigNumber(transactionFee)).multipliedBy(ten18); // Any fee >= 10^12  should work, higher fee yields higher priority
        const senderSequence = sequence;
        const gasPrice = feeInPTOWei;

        let tx = new PandoJS.SmartContractTx(from, to, gasLimit, gasPrice, data, value, senderSequence);

        return tx;
    }

    static isAddress(address) {
        return Ethereum.isAddress(address);
    }

    static isHolderSummary(holderSummary) {
        if (holderSummary) {
            let expectedLen = 458;

            if (holderSummary.startsWith('0x')) {
                expectedLen = expectedLen + 2;
            }

            return (holderSummary.length === expectedLen);
        }
        else {
            return false;
        }
    }

    static async signTransaction(unsignedTx, privateKey) {

        let chainID = Pando.getChainID();
        // let unsignedTx = Pando.unsignedSendTx(txData, sequence);
        let signedRawTxBytes = PandoJS.TxSigner.signAndSerializeTx(chainID, unsignedTx, privateKey);
        let signedTxRaw = signedRawTxBytes.toString('hex');

        //Remove the '0x' until the RPC endpoint supports '0x' prefixes
        signedTxRaw = signedTxRaw.substring(2);

        if (signedTxRaw) {
            return signedTxRaw;
        }
        else {
            throw new Error("Failed to sign transaction.");
        }
    }

    static prepareTxPayload(unsignedTx) {
        let chainID = Pando.getChainID();
        let encodedChainID = RLP.encode(Bytes.fromString(chainID));
        let encodedTxType = RLP.encode(Bytes.fromNumber(unsignedTx.getType()));
        let encodedTx = RLP.encode(unsignedTx.rlpInput());
        let payload = encodedChainID + encodedTxType.slice(2) + encodedTx.slice(2);
        return payload.toString('hex');
    }
}
