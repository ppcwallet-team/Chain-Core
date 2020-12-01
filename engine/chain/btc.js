import Core from './core';
import Bitcore from 'bitcore-lib';

export default class BTC extends Core{

	constructor(){
		super('btc');
	}

	getPrivateKey(mnemonic){
		mnemonic = this.formatMnemonic(mnemonic);
		const hdPrivateKey = this.getHDPrivateKey(mnemonic);
		const derived = hdPrivateKey.derive("m/44'/0'/0'/0/0");
		return derived.privateKey.toWIF();
	}

	getAddress(privateKey){
		var privateKeySet = new Bitcore.PrivateKey.fromWIF(this.getPrivateKeyCheck(privateKey));
		return privateKeySet.toAddress().toString();
	}

	validateAddress(address){
		return Bitcore.Address.isValid(address);
	}

	validatePrivateKey(privateKey){
		return Bitcore.PrivateKey.isValid(this.getPrivateKeyCheck(privateKey));
	}

	signMessage(privateKey, message){
		return message;
	}

	createTransaction(data) {
		if(typeof data == 'string') data = JSON.parse(data);
		let privateKey = data['privateKey'] || data['mnemonic'];
		let coin = data['coin'];
		let amount = data['amount'] || data['value'] || 0;
		let privateKeySet = new Bitcore.PrivateKey(this.getPrivateKeyCheck(privateKey));
		let fromAddress = privateKeySet.toAddress().toString();

		let toAddress = [];
		let amounts = [];
		if(typeof data['toAddress'] == 'object'){
			for(var i = 0; i < data['toAddress'].length; i++){
				toAddress.push(Bitcore.Address.fromString(data['toAddress'][i]));
				amounts.push(Bitcore.Unit.fromBTC(amount[i]).toSatoshis());
			}
		} else {
			toAddress.push(Bitcore.Address.fromString(data['toAddress']));
			amounts.push(Bitcore.Unit.fromBTC(amount).toSatoshis());
		}
		let fee = Bitcore.Unit.fromBTC(data['fees']).toSatoshis();
		let utxo = data['utxos'];

		if(coin == 'usdt'){
			var buffer = new Buffer(20);
	        buffer.write('omni', 0, 4);
	        buffer.writeUIntBE(31, 8, 4);
	        buffer.writeUIntBE(amounts[0], 12, 8);
	        var d = buffer.toString('hex');
	        if(!d.startsWith('6f6d6e69000000000000001f')){
	            d = '6f6d6e69000000000000001f' + d.substring(24, 40);
	            buffer = Buffer.from(d, 'hex');
	        }
	        const transaction = new Bitcore.Transaction()
					.from(utxo)
					.to(toAddress[0], Bitcore.Unit.fromBTC(0.00000546).toSatoshis())
					.fee(fee)
					.change(fromAddress)
					.addData(buffer);
			const sign = transaction.sign(privateKeySet);
			return sign.toString();
		} else {
			let transaction = new Bitcore.Transaction().from(utxo);
			for(var i = 0; i < toAddress.length; i++){
				transaction.to(toAddress[i], amounts[i]);
			}
			transaction.fee(fee);
			transaction.change(fromAddress);
			const sign = transaction.sign(privateKeySet);
			return sign.toString();
		}
	}

	formatDapp(data){
		if(typeof data == 'string') data = JSON.parse(data);
		const result = {
			'contractAddress': '',
			'from': data.from,
			'to': data.to,
			'action': 'transfer',
			'amount': (data.amount || data.value || 0).toString(),
			'symbol': (data.coin || 'btc').toLowerCase()
		};
		return JSON.stringify(result);
	}



}
