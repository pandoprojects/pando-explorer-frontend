import { BigNumber } from 'bignumber.js';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import truncate from 'lodash/truncate';
import isNumber from 'lodash/isNumber';
import capitalize from 'lodash/capitalize';
import chain from 'lodash/chain';
// import 
import moment from 'moment';
import { timeCoin } from './utils';
import { TxnTypes, TxnTypeText, TxnStatus, WEI, TxnPurpose } from './../constants';
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });


export function totalCoinValue(set, key = 'ptxwei') {
  return reduce(set, (acc, v) => acc + parseInt(get(v, `coins.${key}`, 0)), 0)
}

export function from(txn, trunc = null, address = null, set = null) {
  let addr;
  if (set && set.has(txn.hash)) {
    addr = address;
  } else {
    if (set) set.add(txn.hash);
    let path, isSelf = false;
    if ([TxnTypes.RESERVE_FUND, TxnTypes.SERVICE_PAYMENT].includes(txn.type)) {
      path = 'data.source.address';
    } else if (txn.type === TxnTypes.SPLIT_CONTRACT) {
      path = 'data.initiator.address';
    } else if (txn.type === TxnTypes.COINBASE) {
      path = 'data.proposer.address';
    } else if (txn.type === TxnTypes.DEPOSIT_STAKE || txn.type === TxnTypes.DEPOSIT_STAKE_TX_V2) {
      path = 'data.source.address'
    } else if (txn.type === TxnTypes.WITHDRAW_STAKE) {
      path = 'data.holder.address'
    } else if (txn.type === TxnTypes.SMART_CONTRACT) {
      path = 'data.from.address'
    } else if (txn.type === TxnTypes.STAKE_REWARD_DISTRIBUTION) {
      path = 'data.holder.address'
    } else {
    
      let inputs = get(txn, 'data.inputs');
      if(inputs){
      isSelf = inputs.some(input => {
        return input.address === address
      });
    }
      path = 'data.inputs[0].address';
    }
    addr = isSelf ? address : get(txn, path);
  }

  if (trunc && trunc > 0) {
    addr = truncate(addr, { length: trunc });
  }

  return addr;
}

export function to(txn, trunc = null, address = null) {
  let path, isSelf;
  if (txn.type === TxnTypes.SERVICE_PAYMENT) {
    path = 'data.target.address';
  } else if (txn.type === TxnTypes.RESERVE_FUND) {
    return '';
  } else if (txn.type === TxnTypes.WITHDRAW_STAKE) {
    path = 'data.source.address';
  } else if (txn.type === TxnTypes.DEPOSIT_STAKE || txn.type === TxnTypes.DEPOSIT_STAKE_TX_V2) {
    path = 'data.holder.address';
  } else if (txn.type === TxnTypes.SPLIT_CONTRACT) {
    const splits = get(txn, 'data.splits');
    isSelf = splits.some(split => {
      return split.Address === address;
    })
    path = 'data.splits[0].Address';
  } else if (txn.type === TxnTypes.SMART_CONTRACT) {
    path = 'data.to.address'
  } else if (txn.type === TxnTypes.STAKE_REWARD_DISTRIBUTION) {
    path = 'data.beneficiary.address'
  } else {
    const outputs = get(txn, 'data.outputs');
    if(outputs){
    isSelf = outputs.some(output => {
      return output.address === address;
    })
  }
    path = 'data.outputs[0].address';
  }
  let addr = isSelf ? address : get(txn, path);
  if (trunc && trunc > 0) {
    addr = truncate(addr, { length: trunc });
  }
  return addr;
}

export function type(txn) {
  if (txn.status === TxnStatus.PENDING) {
    return status(txn);
  }
  return TxnTypeText[txn.type];
}

export function purpose(txn) {
  return TxnPurpose[txn];
}


export function status(txn) {
  if (!txn.status) {
    return "Finalized";
  }
  return capitalize(txn.status);
}



export function fee(txn) {
  let f = get(txn, 'data.fee.ptxwei');
  f = BigNumber(f).dividedBy(WEI);
  return f.toString();
}

export function gasPrice(txn) {
  let f = get(txn, 'data.gas_price');
  f = BigNumber(f).dividedBy(WEI);
  return f.toString();
}

export function getptxBurnt(txn) {
  let ptxwei = 0;
  if (txn.type === 7) {
    const gasUsed = txn.receipt.GasUsed;
    const gasPrice = txn.data.gas_price;
    ptxwei = timeCoin(gasUsed, gasPrice);
  } else {
    ptxwei = txn.data && txn.data.fee ? txn.data.fee.ptxwei : 0;
  }
  return BigNumber(ptxwei).dividedBy(WEI).toString();
}

export function value(txn) {
  let values = [
    totalCoinValue(get(txn, 'data.inputs'), 'ptxwei'),
    totalCoinValue(get(txn, 'data.inputs'), 'pandowei')];
  return chain(values)
    .map(v => v ? new BigNumber(v).dividedBy(WEI) : "0")
    .filter(Boolean)
    .map(v => v.toString(10))
    .value();
}

export function hash(txn, trunc = null) {
  let a = get(txn, 'hash')
  if (trunc && trunc > 0) {
    a = truncate(a, { length: trunc });
  }
  return a;
}

export function age(txn) {
  if (!txn.timestamp || !isNumber(parseInt(txn.timestamp)))
    return null;
  return moment(parseInt(txn.timestamp) * 1000).fromNow(true);
}

export function date(txn) {
  if (!txn.timestamp || !isNumber(parseInt(txn.timestamp)))
    return null;
  return moment(parseInt(txn.timestamp) * 1000).format("MM/DD/YY hh:mma");
}

export function coins(txn, account = null) {
  let coins = { 'pandowei': 0, 'ptxwei': 0 };
  let outputs = null, inputs = null, index = 0;
  switch (txn.type) {
    case TxnTypes.COINBASE:


      outputs = get(txn, 'data.outputs');

      for (let i of outputs) {

        i.coins = Object.fromEntries(
          Object.entries(i.coins).map(([k, v]) => [k.toLowerCase(), v])
        );

      }
      if (!account || txn.data.proposer.address === account.address) {
        coins = {
          'pandowei': totalCoinValue(get(txn, 'data.outputs'), 'pandowei').toFixed(),
          'ptxwei': totalCoinValue(get(txn, 'data.outputs'), 'ptxwei').toFixed()
        }
      } else if (outputs.some(output => { return output.address === account.address; })) {
        index = outputs.findIndex(e => e.address === account.address);
        // coins = outputs[index].coins;
        coins = Object.fromEntries(
          Object.entries(outputs[index].coins).map(([k, v]) => [k.toLowerCase(), v])
        );

      }
      break;
    case TxnTypes.TRANSFER:
      outputs = get(txn, 'data.outputs');
      inputs = get(txn, 'data.inputs')
      for(let i of outputs)
      {

       i.coins = Object.fromEntries(
         Object.entries(i.coins).map(([k, v]) => [k.toLowerCase(), v])
     );
     
      }
      for(let i of inputs)
      {

       i.coins = Object.fromEntries(
         Object.entries(i.coins).map(([k, v]) => [k.toLowerCase(), v])
     );
     
      }
      if (!account) {
        coins = {
          'pandowei': totalCoinValue(get(txn, 'data.inputs'), 'pandowei').toFixed(),
          'ptxwei': totalCoinValue(get(txn, 'data.inputs'), 'ptxwei').toFixed()
        }
      } else if (inputs.some(input => { return input.address === account.address; })) {
        index = inputs.findIndex(e => e.address === account.address);
        coins = inputs[index].coins;
      } else if (outputs.some(output => { return output.address === account.address; })) {
        index = outputs.findIndex(e => e.address === account.address);
        coins = Object.fromEntries(
          Object.entries(outputs[index].coins).map(([k, v]) => [k.toLowerCase(), v])
        );
      }
      break
    case TxnTypes.SLASH:
    case TxnTypes.RELEASE_FUND:
    case TxnTypes.SPLIT_CONTRACT:
      break;
    case TxnTypes.SMART_CONTRACT:
      coins = txn.data.from.coins;
      break;
    case TxnTypes.RESERVE_FUND:
    case TxnTypes.SERVICE_PAYMENT:
    case TxnTypes.DEPOSIT_STAKE:
    case TxnTypes.WITHDRAW_STAKE:
    case TxnTypes.DEPOSIT_STAKE_TX_V2:
      if(txn.data.source){
      coins = txn.data.source.coins;
    }
      break;
    default:
      break;
  }
  return coins;
}