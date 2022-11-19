import axios from 'axios';
import { CryptoService } from '../services/crypto.service';
import * as  moment from 'moment';
import config from '../Config';


const BASE_URL = config.BASE_URL
const explorerApiUri = config.explorerApiUri

const DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

//
//Helpers
//

export function isResponseSuccessful(response) {
    let { status } = response;

    return (status === 200 || status === 201 || status === 202 || status === 204);
}

function objectToQueryString(object) {
    if (!object) {
        return "";
    }

    let queryString = Object.keys(object).map(function (key) {
        let val = object[key];
        if (val) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
        }
    }).join('&');

    if (queryString.length > 0) {
        return "?" + queryString;
    }
    else {
        return "";
    }
}

//
//Builders
//

function buildHeaders(additionalHeaders) {
    //TODO inject auth headers here...
    return Object.assign(DEFAULT_HEADERS, additionalHeaders);
}

function buildURL(path, queryParams) {
    let url = null;

    if (path.startsWith("http://") || path.startsWith("https://")) {
        url = path + objectToQueryString(queryParams);
    }
    else {
        url = BASE_URL + path + objectToQueryString(queryParams);
    }

    return url;
}

function sendRequest(path, method, additionalHeaders, queryParams, body) {
    let url = buildURL(path, queryParams);
    let headers = buildHeaders(additionalHeaders);

    let opts = {
        method: method,
        headers: headers,
    };

    if (body) {
        opts['body'] = JSON.stringify(body);
    }

    return fetch(url, opts);
}


//
//Convenience requests
//

function GET(path, headers, queryParams) {
    return sendRequest(path, "GET", headers, queryParams);
}

function PUT(path, headers, queryParams, body) {
    return sendRequest(path, "PUT", headers, queryParams, body);
}

function POST(path, headers, queryParams, body) {

    return sendRequest(path, "POST", headers, queryParams, body);
}

function DELETE(path, headers, queryParams, body) {
    return sendRequest(path, "DELETE", headers, queryParams, body);
}

export default class Api {

    //
    //Wallet
    //

    static fetchWallet(address, queryParams) {
        //let path = `wallet/${address}`;
        //return GET(path, null, queryParams);
    }

    //
    //Transactions
    //

    static createTransaction(body, queryParams) {
        let path = `tx`;
        return POST(path, null, queryParams, body);
    }

    static fetchTransaction(transactionID, queryParams) {
        let path = `tx/${transactionID}`;
        return GET(path, null, queryParams);
    }

    static fetchTransactions(address, queryParams) {
        let path = `tx/${address}/list`;
        return GET(path, null, queryParams);
    }

    //
    //Sequence
    //

    static fetchSequence(address, queryParams) {
        let path = `sequence/${address}`;
        return GET(path, null, queryParams);
    }

    //
    //Stakes
    //

    static fetchStakes(address) {
        return axios.get(`${explorerApiUri}/stake/${address}`).then(data => data.data);

      }

    static getWalletBalance(address) {
        return axios.get(`${explorerApiUri}/account/update/${address}`).then((data) => data.data)
    }
    static fetchRewards(address) {
        return axios.get(`${explorerApiUri}/rewards/${address}`).then(data => data.data);

    }

    static getTransactionHistory(address) {//to be changed
        return axios.get(`${explorerApiUri}/accountTx/${address}?type=2?pageNumber=1&limitNumber=100`).then((data) => data.data)
    }

    



    static getSequence(address) {
        return axios.get(`${explorerApiUri}/account/update/${address}`).then(data => data.data);

    }


    static getStakeType(address) {
        return axios.get(`${explorerApiUri}/staketype/${address}`).then(data => data.data);
      
    }





    //
    //Smart Contract
    //

    static callSmartContract(body, queryParams) {
        let path = "smart-contract/call";

        return POST(path, null, queryParams, body);
    }


    static executeSmartContract(body, queryParams) {
        let path = "tx";

        return POST(path, null, queryParams, body);
    }

    static checkBalance(wallet) {
        const body = {
            jsonrpc: "2.0",
            method: "pando.GetAccount",
            params: [
                { address: wallet }
            ],
            id: 1
        }
        return axios.post(BASE_URL + `/node`, body);

    }

    static createTranscation(body) {
        const body1 = {
            "jsonrpc": "2.0",
            "method": "pandocli.Send",
            "params": [body],
            "id": 1
        }
        return axios.post(BASE_URL + `/cli`, body1)
    }

    static callSmartContracts(byteCode) {
        
        const body = {
            "jsonrpc": "2.0",
            "method": "pando.CallSmartContract",
            "params": byteCode,
            "id": 1
        }
        return axios.post(BASE_URL+'/node', body).then((data) => data.data);
    }

    static sendTransaction(byteCode) {
        const body = {
            "jsonrpc": "2.0",
            "method": "pando.BroadcastRawTransaction",
            "params": [{ "tx_bytes": byteCode }],
            "id": 1
        }
        return axios.post(BASE_URL+'/node', body).then((data) => data.data);
    }

}
