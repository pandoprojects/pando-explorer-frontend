import { httpClient } from './http';
import Raven from 'raven-js';
import config from '../../config'



const API_URI = `${config.restApi.host}:${config.restApi.port}/api`;
const RTAPI_URI = `${config.rtservices}`;

export const apiService = {
  get(uri, config = {}) {
    return new Promise((resolve, reject) => {
      return httpClient
        .get(`${API_URI}/${uri}`, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            resolve(err.response);
          } else {
            console.log(`ERROR: ${`${API_URI}/${uri}`}.${err}`);
            Raven.captureException(err);
            reject(err);
          }
        });
    });
  },
  delete(uri, config = {}, options = {}) {
    return new Promise((resolve, reject) => {
      httpClient
        .delete(`${API_URI}/${uri}`, config)
        .then(resolve)
        .catch((err) => {
          console.log(`ERROR: ${`${API_URI}/${uri}`}.${err}`);
          Raven.captureException(err);
          reject(err);
        });
    });
  },
  fut(uri, config = {}) {
    return new Promise((resolve, reject) => {
      return httpClient
        .get(`${uri}`, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            resolve(err.response);
          } else {
            console.log(`ERROR: ${`${uri}`}.${err}`);
            Raven.captureException(err);
            reject(err);
          }
        });
    });
  },
  post(uri, data = {}, config = {}, options = {}) {
    return new Promise((resolve, reject) => {
      httpClient
        .post(`${API_URI}/${uri}`, data, config)
        .then(resolve)
        .catch((err) => {
          console.log(`ERROR: ${`${API_URI}/${uri}`}.${err}`);
          Raven.captureException(err);
          reject(err);
        });
    });
  },
  put(uri, data = {}, config = {}, options = {}) {
    return new Promise((resolve, reject) => {
      httpClient
        .put(`${API_URI}/${uri}`, data, config)
        .then(resolve)
        .catch((err) => {
          console.log(`ERROR: ${`${API_URI}/${uri}`}.${err}`);
          Raven.captureException(err);
          reject(err);
        });
    });
  }
};


export const rtapiService = {
  get(uri, config = {}) {
    return new Promise((resolve, reject) => {
      return httpClient
        .get(`${RTAPI_URI}/${uri}`, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            resolve(err.response);
          } else {
            console.log(`ERROR: ${`${RTAPI_URI}/${uri}`}.${err}`);
            Raven.captureException(err);
            reject(err);
          }
        });
    });
  },
  delete(uri, config = {'Authorization':config.auth}, options = {}) {
    return new Promise((resolve, reject) => {
      httpClient
        .delete(`${RTAPI_URI}/${uri}`, config)
        .then(resolve)
        .catch((err) => {
          console.log(`ERROR: ${`${RTAPI_URI}/${uri}`}.${err}`);
          Raven.captureException(err);
          reject(err);
        });
    });
  },
  fut(uri, config = {'Authorization':config.auth}) {
    return new Promise((resolve, reject) => {
      return httpClient
        .get(`${uri}`, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            resolve(err.response);
          } else {
            console.log(`ERROR: ${`${uri}`}.${err}`);
            Raven.captureException(err);
            reject(err);
          }
        });
    });
  },
  post(uri, data = {}, config = {'Authorization':config.auth}, options = {}) {
    return new Promise((resolve, reject) => {
      httpClient
        .post(`${RTAPI_URI}/${uri}`, data, config)
        .then(resolve)
        .catch((err) => {
          console.log(`ERROR: ${`${RTAPI_URI}/${uri}`}.${err}`);
          Raven.captureException(err);
          reject(err);
        });
    });
  },
  put(uri, data = {}, config = {'Authorization':config.auth}, options = {}) {
    return new Promise((resolve, reject) => {
      httpClient
        .put(`${RTAPI_URI}/${uri}`, data, config)
        .then(resolve)
        .catch((err) => {
          console.log(`ERROR: ${`${RTAPI_URI}/${uri}`}.${err}`);
          Raven.captureException(err);
          reject(err);
        });
    });
  }
};
