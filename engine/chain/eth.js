import Core from './core';
import Ethers from 'ethers';

export default class ETH extends Core{

	constructor(){
		super('eth');
		window._Ethers = Ethers;
	}	
	
	getPrivateKey(mnemonic){
		mnemonic = this.formatMnemonic(mnemonic);
		const wallet = Ethers.Wallet.fromMnemonic(mnemonic);
		return wallet.privateKey.toString();
	}

	getAddress(privateKey){
		const wallet = new Ethers.Wallet(this.getPrivateKeyCheck(privateKey));
		return wallet.address.toString();
	}

	validateAddress(address){
		try {
			Ethers.utils.getAddress(address);
			return true;
		} catch(e){
			return false;
		}
	}

	validatePrivateKey(privateKey){
		try {
			new Ethers.Wallet(privateKey);
			return true;
		} catch(e){
			return false;
		}
	}

	signMessage(privateKey, message){
		const wallet = new Ethers.Wallet(this.getPrivateKeyCheck(privateKey));
		if(typeof message == 'string' && (message.startsWith('"') || message.startsWith('{'))) {
			message = JSON.parse(message);
			if(typeof message == 'object')	 message = message.data;
		}
		return wallet.signMessage(message);
	}

	createTransaction(data) {
		if(typeof data == 'string') data = JSON.parse(data);
		let wallet = new Ethers.Wallet(this.getPrivateKeyCheck(data['privateKey'] || data['mnemonic']));
		let from = wallet.address.toString();
		let to = data['tokenAddress'] || data['toAddress'] || data['to'];
		let amount = data['amount'] || data['value'] || 0;
		if(typeof amount == 'string' && amount.startsWith('0x')){
			amount = Ethers.utils.parseEther(Ethers.utils.formatUnits(amount).toString());
		} else {
			amount = Ethers.utils.parseEther(amount.toString());
		}
		let nonce = Ethers.utils.hexlify(parseInt(data.nonce));
		let dataTemp = data['data'] || '0x';
		let gasLimit = parseInt(data['gasLimit']) || 21000;
		let gasPrice = Math.round(parseFloat(data['gasPrice']) * Math.pow(10, 18));
		const transaction = {
			nonce: nonce,
			from: from,
			to: to,
			value: amount,
			data: dataTemp,
			gasLimit: gasLimit,
			gasPrice: gasPrice,
			chainId: data['chainId'] || 1
		};
		const sig = wallet.sign(transaction);
		return sig.toString();
	}

	formatDapp(data){
		if(typeof data == 'string') data = JSON.parse(data);
		let amount = data['amount'] || data['value'] || 0;
		if(typeof amount == 'string' && amount.startsWith('0x')){
			amount = parseFloat(Ethers.utils.formatUnits(amount));
		} else {
			amount = parseFloat(amount);
			if(amount > 100000){
				amount = parseFloat(Ethers.utils.formatEther(amount));
			}
		}
		const result = {
			'contractAddress': data.contractAddress || '',
			'from': data.from,
			'to': data.to,
			'memo': '',
			'action': 'transfer',
			'amount': amount.toString(),
			'symbol': (data.coin || 'eth').toLowerCase()
		};
		return JSON.stringify(result);
	}

}
