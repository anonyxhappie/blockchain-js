/**
 * Date - 11-12-2017 
 * Author - anonyxhappie
 */

const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data).toString() + this.nonce);
    }

    mineBlock(difficulty){
        while(this.hash.toString().substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: ' + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index-1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
            
        }

        return true;
    }
}

let mycoin = new BlockChain();

console.log('Mining block 1....');
mycoin.addBlock(new Block(1, "10/11/2017", { amount: 6 }));
console.log('Mining block 2....');
mycoin.addBlock(new Block(2, "11/11/2017", { amount: 16 }));

// console.log("Is blockchain valid? " + mycoin.isChainValid());

// mycoin.chain[1].data = { amount: 20 };
// mycoin.chain[1].data = mycoin.chain[1].calculateHash();

// console.log("Is blockchain valid? " + mycoin.isChainValid());

console.log(JSON.stringify(mycoin, null, 4));