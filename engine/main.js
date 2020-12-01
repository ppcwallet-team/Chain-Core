import BTC from './chain/btc';
import ETH from './chain/eth';
import TRUE from './chain/true';
// import TRX from './chain/trx';


window.Core = { BTC, ETH, TRUE
    // TRX
};

class CoinInject {

    constructor() {
        window.__jMessageCallbacks = {};
        window.__jHost = this.jHost;
        window.__jMessage = this.jMessage;
        this._ts = new Date().getTime();
        this._timer = setInterval(this.bind(this.refreshAccount, this), 100);
    }

    bind(fun) {
        var _this = arguments[1], args = [];
        for (var i = 2, il = arguments.length; i < il; i++) {
            args.push(arguments[i]);
        }
        return function () {
            var thisArgs = args.concat();
            for (var i = 0, il = arguments.length; i < il; i++) {
                thisArgs.push(arguments[i]);
            }
            return fun.apply(_this || this, thisArgs);
        }
    }

    refreshAccount() {

    }

    //params: cmd, chain, data
    jHost() {
        console.log("JHOST call Android",JSON.stringify(arguments))
        if (arguments.length < 1) {
            return;
        }

        var cmd = arguments[0];
        var id = new Date().getTime().toString();
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] instanceof Function) {
                window.__jMessageCallbacks[id] = arguments[i];
            } else {
                args.push(arguments[i]);
            }
        }

        if (window.__JSHOST) {
            //(id, chain, data);
            var data = [id].concat(args);
            window.__JSHOST[cmd].apply(this, data);
        } else if (window.webkit && window.webkit.messageHandlers) {
            //[cmd, id, chain, data]
            var data = [cmd, id].concat(args);
            window.webkit.messageHandlers.__JSHOST.postMessage(Json.stringify(data));
        } else {

        }
    }

    //params: id, err, reply
    jMessage() {
        if (arguments.length < 2) {
            return;
        }
        var id = arguments[0].toString();
        var args = [];
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
        }
        if (window.__jMessageCallbacks[id]) {
            window.__jMessageCallbacks[id].apply(this, args);
        }
    }
}

new CoinInject();

function matchCore(coin) {
    coin = coin.toUpperCase();
    if(coin && window.Core[coin]){
        return new window.Core[coin]();
    }
    return null
}

function wrapEntity(code, msg, data = {}) {
    return {
        code: code,
        message: msg,
        data: data
    }
}

/*
 * 100  暂不支持此种类型
 * 110  操作失败
 * 101  privateKey参数异常
 * 102  contract 参数异常
 * 103  data 参数异常
 * 104  mnemonic 参数异常
 */
window.getMnemonic = function (data) {
    console.info("==== chain core generateMnemonic===");
    console.log(typeof data);
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.generateMnemonic());
    } catch (e) {
        return wrapEntity(110, 'failed ' + e.toString());
    }
};

window.getPrivateKey = function (data) {
    console.info("==== chain core getPrivateKey===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || !params['mnemonic']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.getPrivateKey(params['mnemonic']));
    } catch (e) {
        return wrapEntity(110, 'failed ' + e.toString());
    }
};

window.getPublicKey = function (data) {
    console.info("==== chain core getPublicKey===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || (!params['privateKey'] && !params['mnemonic'])){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.getPublicKey(params['privateKey'] || params['mnemonic']));
    } catch (e) {
        return wrapEntity(110, 'failed ' + e.toString());
    }
};

window.getAddress = function (data) {
    console.info("==== chain core getAddress===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || (!params['privateKey'] && !params['mnemonic'])){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.getAddress(params['privateKey'] || params['mnemonic']));
    } catch (e) {
        return wrapEntity(110, 'failed '+e.toString());
    }
}

window.validateAddress = function (data) {
    console.info("==== chain core validateAddress===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || !params['address']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        // return wrapEntity(100, '暂不支持');
        return wrapEntity(0, 'success', true.toString());
    }
    try {
        return wrapEntity(0, 'success', core.validateAddress(params['address']).toString());
    } catch (e) {
        return wrapEntity(110, 'failed '+e.toString());
    }
}

window.validatePrivateKey = function (data) {
    console.info("==== chain core validatePrivateKey===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || !params['privateKey']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.validatePrivateKey(params['privateKey']).toString());
    } catch (e) {
        return wrapEntity(110, 'failed '+e.toString());
    }
}

window.validateMnemonic = function (data) {
    console.info("==== chain core validateMnemonic===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['mnemonic']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore('btc');
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.validateMnemonic(params['mnemonic']).toString());
    } catch (e) {
        return wrapEntity(110, 'failed '+e.toString());
    }
}

window.signMessage = function (data) {
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || !params['privateKey'] || !params['message']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        var privateKey = params['privateKey'];
        if (!privateKey){
            var mnemonic = params['mnemonic'];
            if(!mnemonic){
                return wrapEntity(100, '缺少参数');
            }
            privateKey = core.getPrivateKey(mnemonic);
            params['privateKey'] = privateKey;
        }
        return wrapEntity(0, 'success', core.signMessage(params['privateKey'], params['message']));
    } catch (e) {
        return wrapEntity(110, 'failed '+e.toString());
    }
};

window.signTransaction = function (data) {
    console.info("==== chain core signTransaction===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        var privateKey = params['privateKey'];
        if (!privateKey){
            var mnemonic = params['mnemonic'];
            if(!mnemonic){
                return wrapEntity(100, '缺少参数');
            }
            privateKey = core.getPrivateKey(mnemonic);
            params['privateKey'] = privateKey;
        }
        return wrapEntity(0, 'success', core.createTransaction(params));
    } catch (e) {
        return wrapEntity(110, 'failed ' + e.toString());
    }
};

window.formatDapp = function (data) {
    console.info("==== chain core formatDapp===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract']){
        return wrapEntity(100, '缺少参数');
    }
    if(!params['data']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    try {
        return wrapEntity(0, 'success', core.formatDapp(params['data']));
    } catch (e) {
        return wrapEntity(110, 'failed ' + e.toString());
    }
};

//非标准化的方法，统一函数入口
window.callMethod = function(data){
    console.info("==== chain core callMethod===");
    if (typeof data === 'object'){
        data = JSON.stringify(data);
    }
    if(!data && !data.startsWith('{')){
        return wrapEntity(101, '参数异常');
    }
    var params = JSON.parse(data);
    if(!params['contract'] || !params['method']){
        return wrapEntity(100, '缺少参数');
    }
    var core = matchCore(params['contract']);
    if(!core){
        return wrapEntity(100, '暂不支持');
    }
    if(!core[params['method']]){
        return wrapEntity(100, '没有此方法');
    }
    try {
        return wrapEntity(0, 'success', core[params['method']](params));
    } catch (e) {
        return wrapEntity(110, 'failed ' + e.toString());
    }
}










