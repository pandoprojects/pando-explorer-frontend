import { apiService,rtapiService } from './api';
import config from '../../config'
export const rtservices = {
  getPublicNodes() {
    return rtapiService.get(`get_publicNode`, { headers: { 'Authorization':config.auth}}).then((res) => res);
  },
  getTransactionHistory(address, startDate, endDate) {
    if (!address) {
      throw Error('Missing argument');
    }
    return rtapiService.get(`accountTx/history/${address}`, { params: { startDate, endDate } });
  }
};
