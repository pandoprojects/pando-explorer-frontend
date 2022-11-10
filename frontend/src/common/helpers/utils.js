import _ from 'lodash';
import BigNumber from 'bignumber.js';

import { WEI } from '../constants';

export function truncateMiddle(str, maxLength = 20, separator = '...') {
  if (str && str.length <= 20)
    return str

  let diff = maxLength - separator.length;
  let front = Math.ceil(diff / 2);
  let back = Math.floor(diff / 2);
  return str.substr(0, front) + separator + str.substr(str.length - back);
}

export function formatNumber(num, length = 0) {

  return num.toFixed(length).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function formatCurrency(num, length = 2) {
  return '$' + num.toFixed(length).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function formatCoin(weiAmount, length = 4) {

  return new BigNumber(Number(weiAmount)).dividedBy(WEI).decimalPlaces(length).toFormat({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  });
}

export function priceCoin(weiAmount, price) {
  return new BigNumber(weiAmount).dividedBy(WEI).multipliedBy(price).decimalPlaces(2).toFormat({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  });
}



export function timeCoin(amountA, amountB) {
  return new BigNumber(amountA).times(amountB);
}

export function sumCoin(weiAmountA, weiAmountB) {
  return BigNumber.sum(new BigNumber(weiAmountA), new BigNumber(weiAmountB));
}

export function getQueryParam(search, name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function getPando(weiAmount) {
  return new BigNumber(weiAmount).dividedBy(WEI).toFixed();
}

export function getHex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return '0x' + arr1.join('');
}
export function getArguments(str) {
  let res = str;
  const num = Math.floor(str.length / 64);
  res += `\n\n---------------Encoded View---------------\n${num} Constructor Argument${num > 1 ? 's' : ''} found :\n`;
  for (let i = 0; i < num; i++) {
    res += `Arg [${i}] : ` + str.substring(i * 64, (i + 1) * 64) + '\n';
  }
  return res;
}

export function formatQuantity(amount, decimals, length = 4) {
  decimals = decimals || 0;
  let wei = new BigNumber(10).exponentiatedBy(decimals);
  return new BigNumber(amount).dividedBy(wei).decimalPlaces(length).toFormat({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  });
}
