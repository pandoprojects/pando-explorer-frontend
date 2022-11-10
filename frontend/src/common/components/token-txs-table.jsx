import React, { useEffect } from 'react';
import { Link } from "react-router";
import { formatQuantity } from '../helpers/utils';
import { TokenIcons } from '../constants';
import { hash, age } from '../helpers/transactions';
import cx from 'classnames';
import map from 'lodash/map';
import get from 'lodash/get';
import _truncate from 'lodash/truncate';
import { formatCoin } from '../helpers/utils';


const TokenTxsTable = ({ transactions, type, className, address, tabType, tokenMap, handleHashScroll }) => {
  const NUM_TRANSACTIONS = type === 'PTX' ? 30 : 25;
  useEffect(() => {
    if (handleHashScroll) handleHashScroll();
  }, [transactions])
  return (
    <table className={cx("data txn-table2", className)}>
      <thead>
        <tr>
          <th className="hash">Txn Hash</th>
          <th className="age">Age</th>
          <th className="from">From</th>
          {tabType !== "token" && <th className="icon"></th>}
          <th className="to">To</th>
          {type === 'PNC-721' && <th className="tokenId">TokenId</th>}
          {(type === 'PNC-20' || type === 'PTX') && <th className="quantity">Quantity</th>}
          {type !== 'PTX' && tabType !== 'token' && <th>Token</th>}
        </tr>
      </thead>
      <tbody>
        {map(transactions, (txn, i) => {
          const source = !address ? 'none' : address === txn.from ? 'from' : 'to';
          const name = get(tokenMap, `${txn.contract_address}.name`) || txn.name || "";
          const decimals = get(tokenMap, `${txn.contract_address}.decimals`);
          const quantity = decimals ? formatQuantity(txn.value, decimals) : txn.value;
          return (
            <tr key={i}>
              <td className="hash overflow"><Link to={`/txs/${txn.hash}`}>{hash(txn, 30)}</Link></td>
              <React.Fragment>
                <td className="age">{age(txn)}</td>
                <td className={cx({ 'dim': source === 'to' }, "from")}>
                  <AddressTNS hash={txn.from} tns={txn.fromTns} truncate={NUM_TRANSACTIONS} />
                </td>
                {tabType !== "token" && <td className={cx(source, "icon")}></td>}
                <td className={cx({ 'dim': source === 'from' }, "to")}>
                  <AddressTNS hash={txn.to} tns={txn.toTns} truncate={NUM_TRANSACTIONS} />
                </td>
                {type === 'PNC-721' && <td className="tokenId">
                  <Link to={`/token/${txn.contract_address}?a=${txn.token_id}`}>{txn.token_id}</Link>
                </td>}
                {type === 'PTX' && <td className="quantity">
                  <div className="currency tfuel">
                    {formatCoin(txn.value, 2)}
                  </div>
                </td>}
                {type === 'PNC-20' && <td className="quantity">{quantity}</td>}
                {type !== 'PTX' && tabType !== 'token' && <TokenName name={name} address={txn.contract_address} />}

              </React.Fragment>
            </tr>);
        })}
      </tbody>
    </table>
  );
}

const AddressTNS = ({ hash, tns, truncate = false }) => {
  if (tns) {
    return (
      // <div className="value tooltip">
      //   <div className="tooltip--text">
      //     <p>{tns}</p>
      //     <p>({hash})</p>
      //   </div>
        
      //   <Link to={`/account/${hash}`}>{truncate ? _truncate(tns, { length: truncate }) : tns}</Link>
        
      // </div>
      <Link to={`/account/${hash}`}>{truncate ? _truncate(tns, { length: truncate }) : tns}</Link>
      );
      
  }
  return (<Link to={`/account/${hash}`}>{truncate ? _truncate(hash, { length: truncate }) : hash}</Link>)
}

const TokenName = (props) => {
  const { name, address } = props;
  const isTruncated = name.length > 12;
  const tokenName = isTruncated ? _truncate(name, { length: 12 }) : name;
  return <td className="token">
    {isTruncated ?
      <div className={cx("tooltip", TokenIcons[name], { "currency": name })}>
        <Link to={`/token/${address}`}>{tokenName}</Link>
        <div className='tooltip--text'>{name}</div>
      </div> :
      <div className={cx(TokenIcons[name], { "currency": name })}>
        <Link to={`/token/${address}`}>{tokenName}</Link>
      </div>
    }
  </td>
}

export default TokenTxsTable;