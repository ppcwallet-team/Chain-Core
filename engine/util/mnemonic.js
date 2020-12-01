import bip39 from 'bip39'
import BM from 'bitcore-mnemonic'

export default class Mnemonic {

	static generate() {
        return bip39.generateMnemonic();
    }

    static getHDPrivateKey(mnemonic){
    	const code = new BM(mnemonic);
    	return code.toHDPrivateKey();
    }

    static seedHex(mnemonic){
    	return bip39.mnemonicToSeedHex(mnemonic);
    }

    static validateMnemonic(mnemonic){
        return bip39.validateMnemonic(mnemonic);
    }
    
}
