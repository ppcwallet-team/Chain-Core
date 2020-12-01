import ETH from './chain/eth.js';

export class BridgeInject {

	constructor(){
		console.log("Inject Success")
		window.__jMessageCallbacks = {};
		window.__jHost = this.jHost;
		window.__jMessage = this.jMessage;
		this._ts = new Date().getTime();
		this._timer = setInterval(this.bind(this.refreshAccount, this), 100);
		this.refreshAccount();
	}

	bind(fuck) {
		var _this = arguments[1], args = [];
		for (var i = 2, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
		return function(){
			var thisArgs =  args.concat();
			for (var i=0, il = arguments.length; i < il; i++) {
				thisArgs.push(arguments[i]);
			}
			return fuck.apply(_this || this, thisArgs);
		}
	}

	refreshAccount(){
		var account = window.__account;
		console.log("Account",account?JSON.stringify(account):"None Account Date");
		if(account){
			clearInterval(this._timer);
			if(account.eth){
				new ETH(account.eth);
			}
		} else if(new Date().getTime() - this._ts > 5000){
			clearInterval(this._timer);
		}
	}

	//params: cmd, chain, data
	jHost() {
	    if (arguments.length < 1) {
			console.log("Call jHost failed ,params error")
	        return;
	    }
	    var cmd = arguments[0];
	    var id = new Date().getTime().toString();
		console.log("Call jHost:"+cmd)
	    if (window.__JSHOST) {
	    	//(id, chain, data);
			var chain = arguments[1];
			var data = "";
			if (arguments.length>2){
				data = JSON.stringify(arguments[2]);
			}
	        window.__JSHOST[cmd](id,chain,data);
	    } else if (window.webkit && window.webkit.messageHandlers) {
			var args = [];
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i] instanceof Function) {
					window.__jMessageCallbacks[id] = arguments[i];
				} else {
					args.push(arguments[i]);
				}
			}
	    	//[cmd, id, chain, data]
	    	var data = [cmd, id].concat(args);
	        window.webkit.messageHandlers.__JSHOST.postMessage(JSON.stringify(data));
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

new BridgeInject();












