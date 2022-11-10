import TNS from 'tns-resolver';
import config from '../config';

const endpoint = config.ethRPCEndpoint || ""; //eth libary for chain url

const tns = new TNS({ customRpcEndpoint: endpoint });

export default tns;