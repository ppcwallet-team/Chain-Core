# 接入文档

客户端调用区块链JS算法文档, 其中Data为JSON字符串

## 方法调用

### window.getMnemonic(data)

获取助记词
```js
window.getMnemonic({
    contract: 'eth'                 //主链类型，必填
});
```

### window.getPrivateKey(data)

获取私钥
```js
window.getPrivateKey({
    contract: 'eth',                //主链类型，必填
    mnemonic: 'hello world ...'     //助记词
});
```

### window.getPublicKey(data)

获取公钥
```js
window.getPublicKey({
    contract: 'eth',                //主链类型，必填
    privateKey: '0xabcd....'        //私钥或助记词
});
```

### window.getAddress(data)

获取地址
```js
window.getAddress({
    contract: 'eth',                //主链类型，必填
    privateKey: '0xabcd....'        //私钥或助记词
});
```

### window.validateAddress(data)

验证地址是否合法
```js
window.validateAddress({
    contract: 'eth',                //主链类型，必填
    address: '0xabcd....'           //地址
});
```

### window.validatePrivateKey(data)

验证私钥是否合法
```js
window.validatePrivateKey({
    contract: 'eth',                //主链类型，必填
    privateKey: '0xabcd....'        //私钥
});
```

### window.validateMnemonic(data)

验证助记词是否合法
```js
window.validateMnemonic({
    mnemonic: 'hello world ...'     //助记词
});
```

### window.formatDapp(data)

格式化DApp的转账信息
```js
window.formatDapp({
    contract: 'eth',                //主链类型，必填
    data: 'xxx'                     //由Dapp传过来的数据，字符串
});
```

### window.signMessage(data)

签名消息
```js
window.signMessage({
    contract: 'eth',                //主链类型，必填
    privateKey: '0xabcd....',       //私钥
    message: 'hello'                //要签名的文本内容
});
```

### window.signTransaction(data)

签名交易，除了下面基本的字段以外，其他每个链的data值会各有不同。
```js
window.signTransaction({
    contract: 'eth',                //主链类型，必填
    coin: 'eth',                    //转账的币名（可选，不填时为主币）
    tokenAddress: '0xaaaa......',   //token合约地址（可选）
    privateKey: '0xabcd....',       //私钥（可选其一）
    toAddress: '接收方',             //接收方
    mnemonic: 'hello world',        //助记词（可选其一）
    amount: '1',                    //发送数量
    memo: '备注'                    //选填
});
```

#### BTC
```js
{
    ...
    coin: 'usdt',
    fees: '0.00001' ,               //手续费
    utxos: []                       //标准的utxo数组
}
```

#### ETH
```js
{
    ...
    nonce: 0,                       //NONCE值
    gasLimit: 21000,                //gasLimit
    gasPrice: 0.000001,             //gasPrice
    data: '0x...',                  //交易DATA数据
    chainId: 1                      //chainId，选填
}
```

#### EOS
```js
{
    ...
    transaction: { buf: 'abiBin'}                //根据abiJson2Bin接口获取的transaction值
}
```

#### TRX
```js
{
    ...
    transaction: {}                //根据createTransaction接口获取的数据对象
}
```

#### NULS
```js
{
    ...
    fees: 0.00001,                   //
    utxos: []                       //标准的utxo数组
}
```

#### WICC
```js
{
    ...
    type: null,                     //选填，当为激活账号时为'register',
    blockHeight: 123,
    fees: 0.0001,                   //手续费
    destRegId: '用户ID',
    srcRegId: '用户ID'
}
```

#### NEO
```js
{
    ...
    utxos: [],                      //转NEO和GAS时必填,
    tokenAddress: 'xxx',            //转NEP5代币时填写
}
```

#### ONT
```js
{
    ...
    coin: 'ong', 
    gasLimit: 20000,
    gasPrice: 0.0001
}
```


### window.callMethod(data)

调用某个非标准话的方法，用这个函数
```js
window.callMethod({
    contract: 'eth',                //主链类型，必填
    privateKey: '...',
    method: 'withdrawOng',          //调用的方法名
    ...
});

#### ONT
```js
{
    method: 'withdrawOng',          //提取ONG
    amount: 10,
    gasLimit: 20000,
    gasPrice: 0.0003
}
```





