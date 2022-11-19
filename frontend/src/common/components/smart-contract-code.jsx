import React, { useRef, useState, useEffect } from "react";
import get from 'lodash/get';
import LoadingPanel from '../components/loading-panel';
import { soljsonReleases } from '../constants'
import AceEditor from '../components/ace-editor';
import { getHex, getArguments } from '../helpers/utils';
import { smartContractService } from '../services/smartContract';
import { withTranslation } from "react-i18next";



class SmartContractCode extends React.PureComponent {
  setStates = (keys, vals) => {
    let newState = {}
    keys.forEach((key, i) => {
      newState[key] = vals[i]
    })
    this.setState(newState);
  }
  render() {
    let { address, smartContract, isReleasesReady, isLoading, fetchSmartContract ,t} = this.props;
    isReleasesReady = true;
    const showView = get(smartContract, 'source_code.length')
    return (
      isLoading ? <LoadingPanel /> :
        showView ? <CodeViewer contract={smartContract}  t={t}/> : <CodeUploader isReleasesReady={isReleasesReady}
          smartContract={smartContract} address={address} fetchSmartContract={fetchSmartContract} t={t} />
    ) 
  }
}

const Options = props => {
  const { t } = props;

  // let releases = window.soljsonReleases;
  let releases = soljsonReleases;
  return (
    <>
      <option value='' key='empty'>{t(`Please select`)}</option>
      {Object.keys(releases).map(key => {
        let text = releases[key].match(/^soljson-(.*).js$/)[1];
        return (<option value={key} key={key}>{text}</option>)
      })}
    </>
  )
}
const CodeUploader = props => {
  const { isReleasesReady, address, fetchSmartContract, t } = props;
  const [isCodeEmpty, setIsCodeEmpty] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [uploaderSourceCode, setUploaderSourceCode] = useState('');
  const [uploaderAbi, setUploaderAbi] = useState('');
  const [uploaderVersion, setUploaderVersion] = useState('');
  const [uploaderOptimizer, setUploaderOptimizer] = useState(0);
  const sourceCodeRef = useRef(null);
  const versionRef = useRef(null);
  const optimizerRef = useRef(null);
  const abiRef = useRef(null);
  useEffect(() => {
    if (sourceCodeRef.current) {
      sourceCodeRef.current.value = uploaderSourceCode;
      abiRef.current.value = uploaderAbi;
      optimizerRef.current.value = uploaderOptimizer;
    }
    if (versionRef.current) versionRef.current.value = uploaderVersion;
  })
  const reset = () => {
    sourceCodeRef.current.value = '';
    abiRef.current.value = '';
  }
  const submit = () => {
    const sourceCode = sourceCodeRef.current.value;
    const version = versionRef.current.value;
    const versionFullname = soljsonReleases[version]
    const abi = abiRef.current.value;
    const optimizer = optimizerRef.current.value;
    const byteCode = get(props, 'smartContract.bytecode');
    setUploaderSourceCode(sourceCode);
    setUploaderAbi(abi);
    setUploaderVersion(version);
    setUploaderOptimizer(optimizer);
    if (sourceCode === '') {
      setIsCodeEmpty(true);
      sourceCodeRef.current.focus();
      return;
    } else if (isCodeEmpty) {
      setIsCodeEmpty(false);
    }
    if (version === '') {
      versionRef.current.classList.add('isEmpty');
      versionRef.current.focus();
      return;
    }
    setIsVerifying(true);

    smartContractService.verifySourceCode(address, sourceCode, abi, version, versionFullname, optimizer)
      .then(res => {
        setIsVerifying(false);
    
        let isVerified = get(res, 'data.result.verified')
        let error = get(res, 'data.err_msg')
   
        if (isVerified === true) { fetchSmartContract(address) }
        else if (error) { setErrMsg(error) }
        else setErrMsg('Code does not match.')
      }).catch(e => {
        setIsVerifying(false);
        setErrMsg('Something wrong in the verification process.')
        console.log('error:', e)
      })
  }
  const resetBorder = e => {
    if (e.target.value === '') {
      e.target.classList.add('isEmpty')
    } else {
      e.target.classList.remove('isEmpty')
    }
  }
  return (isVerifying ?
    <>
      <div className="code-loading-text">{t(`Verifying your source code`)}......</div>
      <LoadingPanel />
    </>
    :
    <>
      <div className="selects-container">
        {isReleasesReady ? <div className="select__container">
          <label>{t(`Please select Compiler Version`)}</label>
          <div className="select__selector">
            <select ref={versionRef} defaultValue='' onChange={resetBorder}>
              <Options t={t}/>
            </select>
          </div>
        </div> : ''}
        <div className="select__container optimizer">
          <label>
            <div className="select__tooltip question-mark">
              <div className="select__tooltip--text">
              {t(`Select the option you used when compiling this contract`)}.
              </div>
            </div>
            {t(`Optimization`)}
          </label>
          <div className="select__selector optimizer">
            <select ref={optimizerRef} defaultValue={0}>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>
        </div>
      </div>
      <label htmlFor="txtSourceCode">
        <b>{t(`Enter the Solidity Contract Code below`)} &nbsp;</b>
        <span className="text-danger">*</span>
        <span className="text-danger">{isCodeEmpty ? 'source code is reqired. ' : ''}{t(`Only Single File Supported`)}</span>
      </label>
      <textarea className='code-area' placeholder="Enter your code here." name="txtSourceCode" ref={sourceCodeRef} required />
      <label>{t(`Constructor Arguments ABI-encoded (for contracts that were created with constructor parameters)`)}</label>
      <textarea className='abi-area' placeholder="Enter your code here." ref={abiRef} />
      {errMsg.length ? <div className='code-error-text text-danger'>{t(`Validation failed with an error`)}: {errMsg}</div> : null}
      <div className="code-buttons">
        <div onClick={submit}>{t(`Verify and Publish`)}</div>
        <div className='reset' onClick={reset}>{t(`Reset`)}</div>
      </div>
    </>
  )
}
const CodeViewer = props => {
  const { contract,t  } = props;
  let args = get(contract, 'constructor_arguments');
  const hasConstructorArguments = args ? args.length > 0 : false;
  const jsonAbi = contract.abi.map(obj => JSON.stringify(obj))
  return (
    <>
      <div className="contract-info">
        <div className="contract-info__block">
          <div className="contract-info__title verified">{t(`Contract Source Code Verified`)}</div>
          <div className="contract-info__general">
            <div className="contract-info__raws">
              <div className="contract-info__cell">
                <div>{t(`Contract Name`)}:</div>
                <div>{contract.name}</div>
              </div>
              <div className="contract-info__cell">
                <div>{t(`Compiler Version`)}:</div>
                <div>{contract.compiler_version}</div>
              </div>
            </div>
            <div className="contract-info__raws">
              <div className="contract-info__cell">
                <div>{t(`Optimization Enabled`)}:</div>
                <div><b>{contract.optimizer === 'enabled' ? 'Yes' : 'No'}</b> with <b>200</b> runs</div>
              </div>
              <div className="contract-info__cell">
                <div>{t(`Other Settings`)}:</div>
                <div><b>{t(`default`)}</b> evmVersion</div>
              </div>
            </div>
          </div>
        </div>
        <div className="contract-info__block">
          <div className="contract-info__title source-code">{t(`Contract Source Code (Solidity)`)}</div>
          <AceEditor value={contract.source_code} name="contract_source_code" />
        </div>
        <div className="contract-info__block">
          <div className="contract-info__title abi">{t(`Contract ABI`)}</div>
          <AceEditor value={'[' + jsonAbi + ']'} name="contract_abie" height="200px" showGutter={false} />
        </div>
        <div className="contract-info__block">
          <div className="contract-info__title bytecode">{t(`Contract Creation Code`)}</div>
          <AceEditor value={getHex(contract.bytecode)} name="contract_bytecode" height="200px" showGutter={false} />
        </div>
        {hasConstructorArguments ? <div className="contract-info__block">
          <div className="contract-info__title arguments">{t(`Constructor Arguments`)}
            <div className="contract-info__title--sub">({t(`ABI-Encoded and is the last bytes of the Contract Creation Code above`)})</div>
          </div>
          <AceEditor value={getArguments(contract.constructor_arguments)} name="contract_bytecode" height="200px" showGutter={false} />
        </div> : null}
      </div>
    </>)
}

export default withTranslation()(SmartContractCode)
