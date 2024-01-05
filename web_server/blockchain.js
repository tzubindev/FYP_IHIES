const SHA256 = require("crypto-js/sha256");
const { ec } = require("elliptic");
const mongodb = require("mongodb");

require("dotenv").config();

const ellipticCurve = new ec(process.env.KEY_PAIR_ALGO);
const key = new ec(process.env.KEY_PAIR_ALGO);
const MongoClient = mongodb.MongoClient;
const client = new MongoClient(process.env.MONGODB_URI, {});
const collection = client.db("IHIES").collection("BlockchainDoc");

class Block {
    constructor(index, timestamp, fileData, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = fileData ? fileData : null;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.signature = "";
    }

    calculateHash() {
        return SHA256(
            this.index +
                this.timestamp +
                JSON.stringify(this.data) +
                this.previousHash
        ).toString();
    }

    signBlock(privateKey) {
        const keyPair = key.keyFromPrivate(privateKey, "hex");
        const message = this.index + this.timestamp + JSON.stringify(this.data);
        this.signature = keyPair.sign(message).toDER("hex");
    }

    verifySignature(publicKey) {
        const keyPair = key.keyFromPublic(publicKey, "hex");
        const message = this.index + this.timestamp + JSON.stringify(this.data);
        return keyPair.verify(message, this.signature);
    }
}

class Blockchain {
    constructor() {
        this.chain = null;
        this.connectToDatabase();
    }

    async getChain() {
        await this.connectToDatabase();
        return this.chain;
    }

    createGenesisBlock() {
        // save to mongo cloud db here
        return new Block(0, new Date().toISOString(), null);
    }

    async connectToDatabase() {
        try {
            await client.connect();

            const blockchainDoc = await collection.findOne();

            if (blockchainDoc) {
                this.chain = blockchainDoc.chain;
            } else {
                // If no data is found, create the genesis block and save to MongoDB
                const genesisBlock = this.createGenesisBlock();
                await collection.insertOne({ chain: [genesisBlock] });
            }

            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error; // Rethrow the error to propagate it up the call stack
        }
    }

    async saveToDatabase() {
        if (collection) {
            // Save the updated blockchain to MongoDB
            await collection.updateOne(
                {},
                { $set: { chain: this.chain } },
                { upsert: true }
            );
        }
    }

    async getLatestBlock() {
        await this.connectToDatabase();
        return this.chain[this.chain.length - 1];
    }

    async addBlock(newBlock, privateKey) {
        newBlock.signBlock(privateKey);
        newBlock.hash = await newBlock.calculateHash();
        this.chain.push(newBlock);
        await this.saveToDatabase();
    }

    async isChainValid() {
        await this.connectToDatabase();
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (
                currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.hash ||
                !currentBlock.verifySignature("public key here") // Replace with the public key of the sender
            ) {
                return false;
            }
        }

        return true;
    }
}

class Key {
    generateKeyPair() {
        // Generate a new key pair
        const keyPair = ellipticCurve.genKeyPair();

        // Get the private key in hexadecimal format
        const privateKey = keyPair.getPrivate("hex");

        // Get the corresponding public key in hexadecimal format
        const publicKey = keyPair.getPublic("hex");

        return {
            private: privateKey,
            public: publicKey,
        };
    }
}

module.exports = { Blockchain, Block, Key };

// Example usage:
// const blockchain = new Blockchain();
// const privateKey = "private key here"; // Replace with the private key of the sender
// const newBlock = new Block(1, "2023-01-02", "path/to/another_document.pdf");
// blockchain.addBlock(newBlock, privateKey);

// console.log("Blockchain is valid:", blockchain.isChainValid());
