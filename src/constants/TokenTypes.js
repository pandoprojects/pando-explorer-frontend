const TokenTypes = {
    PANDO: 'PTX'
};


export function tokenTypeToTokenName(tokenType) {
    if (tokenType === TokenTypes.PANDO) {
        return "PTX"
    }
}

export default TokenTypes;