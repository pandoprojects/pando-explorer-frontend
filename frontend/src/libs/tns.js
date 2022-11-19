import TNS from 'tns-resolver';
import config from '../config';

const endpoint = config.ethRPCEndpoint || "https://eth-rpc-api.pandoproject.org/rpc";

const tns = new TNS({ customRpcEndpoint: endpoint });

export default tns;