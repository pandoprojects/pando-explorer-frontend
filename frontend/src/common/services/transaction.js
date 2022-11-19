import { apiService } from './api';
import { TxnTypes } from '../constants';

export const transactionsService = {

  getOneTransactionByUuid(uuid) {
    if (!uuid) {
      throw Error('Missing argument');
    }
    return apiService.get(`transaction/${uuid}`, {});
  },

  getTopTransactions() {
    return apiService.get(`transactions/range`, { params: { pageNumber: 1, limit: 10 } });
  },

  getTransactionsByPage(pageNumber, limit = 10) {
    return apiService.get('transactions/range', { params: { pageNumber, limit } });
  },
  getTotalTransactionNumber(hour) {
    return apiService.get(`transactions/number/${hour}`);
  },
  getTransactionsByAddress(address, pageNumber = 1,types) 
  {
    let isEqualType = true;
    let type = -1; //Return all types
    let includeService = true;
    let limitNumber = 50
    if (!includeService) {
      type = TxnTypes.SERVICE_PAYMENT; //Exclude this
    }
    types =JSON.stringify(types)
    return apiService.get(`accounttx/${address}?types=`+types, { params: { type, pageNumber, limitNumber, isEqualType } });
  },
  getTransactionHistory() {
    return apiService.get(`transactions/history`);
  },

  
};
