const aes = require('aes-js');
import ConfigBase from '../configBase';

const key = aes.utils.utf8.toBytes(ConfigBase.AES_KEY);

if (key.length !== 32) {
    throw new Error('Invalid key size for AES. It must have 256-bit / 32 bytes');
}

export function encrypt(text: string): string {
    const bytesInfo = aes.utils.utf8.toBytes(text);
    const aesCtr = new aes.ModeOfOperation.ctr(key);
    const encryptedBytes = aesCtr.encrypt(bytesInfo);
    return aes.utils.hex.fromBytes(encryptedBytes);
}

export function decrypt(encryptedHex: string): string {
    const encryptedBytes = aes.utils.hex.toBytes(encryptedHex);
    const aesCtr = new aes.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedBytes);
}