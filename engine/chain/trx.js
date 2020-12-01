import Core from './core';
import TronWeb from 'tronweb';
import Ethers from 'ethers';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('https://api.trongrid.io/');
const solidityNode = new HttpProvider('https://api.trongrid.io/');
const eventServer = 'https://api.trongrid.io/';

export default class TRX extends Core{

	constructor(){
		super('trx');
		this.tronWeb = new TronWeb(fullNode, solidityNode, eventServer, 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0');
		window._tronWeb = this.tronWeb;
	}	
	
	getPrivateKey(mnemonic){
		mnemonic = this.formatMnemonic(mnemonic);
		const hdPrivateKey = this.getHDPrivateKey(mnemonic);
		const derived = hdPrivateKey.derive("m/44'/195'/0'/0/0");
		const privateKey = derived.privateKey.toString('hex');
		return privateKey;
	}

	getAddress(privateKey){
		return TronWeb.address.fromPrivateKey(this.getPrivateKeyCheck(privateKey));
	}

	validateAddress(address){
		return TronWeb.isAddress(address);
	}

    validatePrivateKey(privateKey){
        const address = this.getAddress(privateKey);
        if(address) return true;
        return false;
    }

	signMessage(privateKey, message){
		message = message.replace(/^0x/,'');
        const wallet = new Ethers.Wallet('0x' + this.getPrivateKeyCheck(privateKey));
        return wallet.signMessageTRX(message);
	}

	createTransaction(data) {
		if(typeof data == 'string') data = JSON.parse(data);
		const privateKey = this.getPrivateKeyCheck(data['privateKey'] || data['mnemonic']);
		let transaction = null;
		if(data['transaction']) transaction = data['transaction'];
		if(data['raw_data']) {
			transaction = {
				"txID": data['txID'],
				"raw_data": data['raw_data'],
				"raw_data_hex": data['raw_data_hex']
			};
		}
		if(typeof transaction == 'string') transaction = JSON.parse(transaction);
		const sign = this.tronWeb.utils.crypto.signTransaction(privateKey, transaction);
		return sign.signature[0];
	}

	formatDapp(data){
		if(typeof data == 'string') data = JSON.parse(data);
		let raw_data = null;
		if(data['data']){
			let dappData = data['data'];
			if(typeof dappData == 'string') dappData = JSON.parse(dappData);
			if(dappData['raw_data']){
				raw_data = dappData['raw_data'];
			}
		}
		if(data['raw_data']){
			raw_data = data['raw_data'];
		}
		if(typeof raw_data == 'string') raw_data = JSON.parse(raw_data);

		if(raw_data){
			let contracts = raw_data.contract;
			if(contracts && contracts.length > 0){
				let contract = contracts[0];
				const result = {
					'contractAddress': this.tronWeb.address.fromHex(contract.parameter.value.contract_address),
					'from': this.tronWeb.address.fromHex(contract.parameter.value.owner_address),
					'to': this.tronWeb.address.fromHex(contract.parameter.value.to_address || contract.parameter.value.contract_address),
					'memo': '',
					'action': contract.type,
					'amount': (parseFloat(contract.parameter.value.call_value || contract.parameter.value.amount || 0) / Math.pow(10, 6)).toString(),
					'symbol': 'trx'
				};
				return JSON.stringify(result);
			}
		}

		if(data['to']){
			return JSON.stringify({
				'contractAddress': data.contractAddress || '',
				'from': data.from,
				'to': data.to,
				'memo': data.memo || '',
				'action': 'transfer',
				'amount': parseFloat(data['amount'] || data['value'] || 0).toString(),
				'symbol': (data.coin || 'trx').toLowerCase()
			});
		}

		throw new Error('unknown dapp data');
	}

}
