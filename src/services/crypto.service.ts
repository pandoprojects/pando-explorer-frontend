import * as  CryptoJS from 'crypto-js';

let pandoSecret = '$2a$12$z/V4YyYyRK6RoLmuo9p9wuVB2d.l9J2ER8Zz46pED2ttNE9dGq44a';
let nonce = '$2a$12$hNblr0KN9pll8.Te4eT0uufxifcHvO/4UfGtdgTzQGerKJ5rbNjUW';

export const CryptoService = {
    encryptHmacSHA256,
    nonce
}



function encryptHmacSHA256(text: any) {
    let hash = CryptoJS.HmacSHA512(text, pandoSecret);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64
}


