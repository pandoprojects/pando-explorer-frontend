import { apiService } from './api';
import { CryptoService } from '../services/crypto.service'
import * as  moment from 'moment'
import axios from 'axios'

export const stakeService = {
  getAllStake() {
    return apiService.get(`stake/all`, {});
  },
  getTotalStake() {
    return apiService.get(`stake/totalAmount`, {})
  },
  getStakeByAddress(address) {
    if (!address) {
      throw Error('Missing argument');
    }
    return apiService.get(`stake/${address}`, {});
  },

  overallBalance(address) {
    if (!address) {
      throw Error('Missing argument');
    }
    return apiService.get(`account/update/${address}`, {}).then((data) => data.data);
  },




  getRametronData(pageNo = 1, pageSize = 20) {
    return apiService.get(`stake/allRametron`).then((data) => data.data)
  },



  rametronTotalStake() {
    return apiService.get(`stake/totalRametron`, {}).then((data) => data.data);
  },

  allZyta() {
    return apiService.get(`stake/allZyta`, {}).then((data) => data.data);
  },
  allMeta() {
    return apiService.get(`stake/allMeta`, {}).then((data) => data.data);;
  },
  allTotal() {
    return apiService.get(`stake/allTotal`, {}).then((data) => data.data);;
  },
  

  

  getNodeStake(ip) {
    let body = {
      ip: ip
    }
    return apiService.post(`stake/node-status`, body).then((data) => data.data)
  },
  lbank() {
    return apiService.get(`lbank/price`).then((data) => data.data)
  },
  marketCap() {
    return apiService.get(`marketCap/price`).then((data) => data.data)
  },
  circulatingSupply() {
    return apiService.get(`circulating/supply`).then((data) => data.data)
  }



};

