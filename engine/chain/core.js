import Mnemonic from '../util/mnemonic';

export default class Core {

	constructor(_name){
		this.name = _name;
	}

	generateMnemonic(){
		return Mnemonic.generate();
	}

	getHDPrivateKey(mnemonic){
		return Mnemonic.getHDPrivateKey(mnemonic);
	}

	getSeedHex(mnemonic){
		return Mnemonic.seedHex(mnemonic);
	}

	getPrivateKeyCheck(privateKey){
		if(privateKey.indexOf(' ') > 0) {
			return this.getPrivateKey(privateKey);
		}
		return privateKey;
	}

	//以下需要实现
	getPrivateKey(mnemonic){
		//根据助记词获取私钥
		return '';
	}

	getPublicKey(privateKey){
		return;
	}

	getAddress(privateKey){
		//根据私钥获取地址
		return '';
	}

	validateAddress(address){
		//验证是否为合法地址
		return false;
	}

	validatePrivateKey(privateKey){
		//验证是否为合法私钥
		return false;
	}

	validateMnemonic(mnemonic){
		//验证助记词是否合法
		if(!mnemonic) return false;
		mnemonic = mnemonic.trim();
		return Mnemonic.validateMnemonic(mnemonic);
	}

	formatMnemonic(mnemonic){
		if(!mnemonic) return "";
		mnemonic = mnemonic.trim();
		let arrs = mnemonic.split(' ');
		let res = [];
		for(var i = 0; i < arrs.length; i++){
			if(arrs[i]) res.push(arrs[i]);
		}
		return res.join(' ');
	}

	signMessage(privateKey, message){
		//签名消息
		return message;
	}

	createTransaction(data){
		//签名交易
		return '';
	}

	formatDapp(data){
		//解析Dapp的数据
		if(typeof data == 'string') data = JSON.parse(data);
		return data;
	}
}



