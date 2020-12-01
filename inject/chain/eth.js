
/***
 window.ethereum.on("accountsChanged", accounts => {});
 window.ethereum.on("networkChanged", result => {});
 window.ethereum.on("connect", result => {});
 window.ethereum.on("disconnect", result => {});
 window.ethereum.on("message", result => {});

 ***/

import  '../libs/trust-min.js';
const Trust =window.Trust;
const Web3 = window.Web3 ;

export default class ETH {

    //{address, rpcURL}
    constructor(account){
        if(account.address) account.address = account.address.toLowerCase();
        const config = {
            address: account.address,
            chainId: account.chainId || 1,
            rpcUrl: account.rpcURL,
        };
        const provider = new Trust(config);
        provider.postMessage = this.bind(function(handler, id, data) {
            if(this[handler]){
                this[handler](id, data);
            } else {
                console.error('Not support: ', arguments);
            }
        }, this);
        provider.enable = function(){
            return new Promise((resolve, reject) => {
                if(config.address){
                    return resolve([config.address]);
                } else {
                    return reject('Empty eth address.');
                }
            });
        };
        provider.request = this.bind(function(payload){
            return new Promise((resolve, reject) => {
                this.sendAsync(payload, function(err, res){
                    if(err) return reject(err);
                    return resolve(res.result);
                });
            });
        }, provider);
        provider.on = function(name, callback){

        };
        provider.isMetaMask = true;
        provider.selectedAddress = config.address;
        provider.networkVersion = config.chainId.toString();
        this.provider = provider;

        var web3 = new Web3(provider);
        web3.setProvider = function () {
            console.debug('ChainKernel - overrode web3.setProvider');
        }
        web3.eth.contract = function(abi, address){
            return new web3.eth.Contract(abi, address);
        }
        web3.eth.defaultAccount = config.address;
        if(!web3.eth.coinbase) web3.eth.coinbase = config.address;
        web3.eth.getCoinbase = function(cb) {
            return cb(null, config.address)
        }
        web3.eth.getChainId = function(){
            return new Promise((resolve, reject) => {
                return resolve(config.chainId);
            });
        };
        web3.eth.getAccounts = function(){
            return new Promise((resolve, reject) => {
                return resolve([config.address]);
            });
        };
        try {
            web3.eth.accounts = [config.address];
        } catch (e) {
            console.error("add accounts err"+e)
        }
        window.web3 = web3;
        window.ethereum = provider;
        window.isMetaMask = true;
        window.ethereum.isTrust=true;
    }

    bind(fun) {
        var _this = arguments[1], args = [];
        for (var i = 2, il = arguments.length; i < il; i++) {
            args.push(arguments[i]);
        }
        return function(){
            var thisArgs =  args.concat();
            for (var i=0, il = arguments.length; i < il; i++) {
                thisArgs.push(arguments[i]);
            }
            return fun.apply(_this || this, thisArgs);
        }
    }

    post(cmd, id, data){
        __jHost(cmd, 'eth', JSON.stringify(data), this.bind(function(err, reply){
            if(err){
                this.provider.sendError(id, err);
            } else {
                alert(reply)
                this.provider.sendResponse(id, reply);
            }
            return false;
        }, this));
    }

    requestAccounts(id, data){
        this.provider.sendResponse(id, [window.web3.eth.defaultAccount]);
    }

    signTransaction(id, data){
        this.post('dappsSignSend', id, data);
    }

    sign(id, data){
        this.post('dappsSign', id, data);
    }

    signMessage(id, data) {
        this.post('dappsSignMessage', id, data);
    }

    signPersonalMessage(id, data){
        if(typeof data == 'object'){
            data.__type = 'personal';
        } else {
            data = "Personal:" + data;
        }
        this.post('dappsSignMessage', id, data);
    }

    signTypedMessage(id, data){
        this.provider.sendResponse(id, 'cancelled');
    }

}
