#README

## Main function points:

### Mint

- Purchase directly after clicking mint If it is not on sale, it will prompt It’s not available to mint
- If the time is up and the sale has not started, it will prompt Not yet on sale (when the time is up, you need to manually start the sale and turn on flipSaleActive in the write method of the etherscan contract. The owner address is required)
- If the purchase address has more than three, it will prompt no more than three
- If you click the plus sign when purchasing more than three, it will prompt 1 wallet can only mint 3 avatars!
- If the purchase is not in the whitelist, it will prompt No purchase permission

## Contract interaction configuration items (requires owner address):

### Set up the blind box image:

First upload the image to ipfs, then create a json file

````
{
  "dna": "bd4418bf19322c565253238db9b09e0faa",
  "name": "Blind box name",
  "description": "Blind Box Description",
  "image": "Address of the blind box image just uploaded"
}
````

After the creation is completed, upload the file to ipfs to get the ipfs address, open etherscan, find the **setNotRevealedURI** method in the write method of the contract, and fill in it

````
ipfs://The ipfs address just obtained
````

### Set the picture after the blind box is opened:

First upload the image to ipfs, then modify the json file of all metadata

````
Replace the REPLACE-THIS-WITH-YOUR-URL in the image part with the ipfs address just uploaded
like:

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
````

After the creation is completed, upload the file to ipfs to get the ipfs address, open etherscan, find the **setBaseURl** method in the write method of the contract, and fill in it

````
ipfs://the ipfs address just obtained/ Note: You need to add one more "/" here
````

### Start the sale:

Open etherscan and find the **_isSaleActive** method in the read method of the contract. If the click is true, the sale has been opened. If it is false, you need to go to the write method and find **flipSaleActive** to open it.

### Open the blind box:

Open etherscan and find the **_revealed** method in the read method of the contract. If the click is true, the sale has been opened. If it is false, you need to go to the write method and find **flipReveal** to open it.

### Set unit price:

Open etherscan, find **setMintPrice** in the write method of the contract, and fill in the unit price you want to set. Note: The unit price here is WEI

### Transfer out the assets in the contract:

Open etherscan, find **withdraw** in the write method of the contract, and fill in the wallet address you want to transfer out of.

### Transfer contract ownership:

Open etherscan, find **transferOwnership** in the write method of the contract, and fill in the wallet address you want to transfer from.

### Set the maximum minting amount:

Open etherscan, find **setMaxBalance** in the write method of the contract, and fill in the wallet address you want to transfer out of.

###
