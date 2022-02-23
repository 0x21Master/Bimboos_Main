# README

## 主要功能点:

### mint

- 点击mint以后直接购买 如果没开售 则提示 It’s not available to mint
- 如果时间到了 没开售 则提示Not yet on sale （时间到了需要手动开售 到etherscan合约的write方法中flipSaleActive开启 需要owner地址）
- 如果购买地址拥有数量超过三个 则提示 no more than three
- 如果购买时点击加号 超过三个 则提示 1 wallet can only mint 3 avatars!
- 如果购买时 没在白名单中 则提示No purchase permission

## 合约交互配置项(需要owner地址):

### 设置盲盒图片:

首先将图片上传到ipfs，然后创建一个json文件

```
{
  "dna": "bd4418bf19322c565253238db9b09e0faa",
  "name": "盲盒名字",
  "description": "盲盒描述",
  "image": "刚上传的盲盒图片的地址"
}
```

创建完成以后将文件上传至ipfs得到ipfs地址后 打开etherscan，找到合约的write方法中的**setNotRevealedURI**方法 在里面填入 

```
ipfs://刚得到的ipfs地址
```

### 设置盲盒开启后图片:

首先将图片上传到ipfs，然后修改所有metadata的json文件

```
将其中image部分的REPLACE-THIS-WITH-YOUR-URL替换为刚上传的ipfs地址
如：

{
  "dna": "bd4418bf19322c565253238db9b09e0f",
  "name": "Dreamcard.io #1",
  "description": "Dreamcard.io",
  "image": "ipfs://Qmc8tkzZnBqpx9L8s92Evt349oUvd533tE2vBeS7R8xMa8/1.png",
  "date": 1645155731014,
  "attributes": [
    {
      "trait_type": "background",
      "value": "surpris"
    },
    {
      "trait_type": "small-hair",
      "value": "Hair bkgd Wavy Purple"
    },
    {
      "trait_type": "face",
      "value": "Pearl Shy"
    },
    {
      "trait_type": "eye",
      "value": "Paris"
    },
    {
      "trait_type": "hair",
      "value": "Sandy Blond Wavy"
    }
  ],
  "compiler": "mintables.club"
}
```

创建完成以后将文件上传至ipfs得到ipfs地址后 打开etherscan，找到合约的write方法中的**setBaseURl**方法 在里面填入 

```
ipfs://刚得到的ipfs地址/  注：此处需要多添加一个"/"
```

### 开启售卖:

打开etherscan，找到合约的read方法中的**_isSaleActive**方法 如果点开为true则已经开启售卖 如果为false 则需要到write方法中 找到**flipSaleActive**进行开启 

### 开启盲盒:

打开etherscan，找到合约的read方法中的**_revealed**方法 如果点开为true则已经开启售卖 如果为false 则需要到write方法中 找到**flipReveal**进行开启 

### 设置单价:

打开etherscan，找到合约的write方法中的**setMintPrice** 在里面填入想要设置的单价即可  注：此处单价单位为WEI

### 转出合约内资产：

打开etherscan，找到合约的write方法中的**withdraw**在里面填入想要转出的钱包地址即可  

### 转移合约所有权：

打开etherscan，找到合约的write方法中的**transferOwnership**在里面填入想要转出的钱包地址即可  

### 设置最大铸币数量：

打开etherscan，找到合约的write方法中的**setMaxBalance**在里面填入想要转出的钱包地址即可  

### 
