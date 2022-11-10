import _ from 'lodash';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import { GWEI } from '../constants';

export function averageFee(block) {
  BigNumber.set({ DECIMAL_PLACES: 1 });
  return _.reduce(block.txs, (bn, t) => bn.plus(new BigNumber(_.get(t, 'raw.fee.ptxwei', 0))), new BigNumber(0))
    .dividedBy(block.num_txs)
    .dividedBy(GWEI)
    .toString(10);
}


export function hash(block, trunc = null) {
  let a = _.get(block, 'hash')
  if (trunc && trunc > 0) {
    a = _.truncate(a, { length: 40 });
  }
  return a;
}

export function age(block) {
  return moment(parseInt(block.timestamp) * 1000).fromNow(true);
}

export function date(block) {
  return moment(parseInt(block.timestamp) * 1000).format("MM/DD/YY hh:mma");
}

export function prevBlock(block) {
  return block.parent_hash;
}