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

    loadBlock(index, timestamp, data, previousHash, hash, signature) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = hash;
        this.signature = signature;
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
                this.chain = await blockchainDoc.chain;
                this.chain.map((node) => {
                    return new Block(null, null, null).loadBlock(
                        node.index,
                        node.timestamp,
                        node.data,
                        node.previousHash,
                        node.hash,
                        node.signature
                    );
                });
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

    async isChainValid(publicKey) {
        await this.connectToDatabase();

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = await this.chain[i];
            const previousBlock = await this.chain[i - 1];

            console.log(typeof currentBlock);

            if (
                currentBlock.hash !== currentBlock.calculateHash() ||
                currentBlock.previousHash !== previousBlock.hash ||
                !currentBlock.verifySignature(publicKey) // Replace with the public key of the sender
            ) {
                return false;
            }
        }

        return true;
    }

    async getBlocks(patientId) {
        await this.connectToDatabase();

        let result = await this.chain.filter((node) => {
            return node.data && node.data.id === patientId;
        });

        // Check if the result is not null or undefined
        if (result) {
            // Iterate over each node in the result and delete the 'file' property
            result.forEach((node) => {
                if (node.data && node.data.file) {
                    delete node.data.file.buffer;
                }
            });

            return result;
        } else {
            // Handle the case where the result is null or undefined
            throw new Error("No blocks found for the specified ID.");
        }
    }

    async getBlock(index) {
        await this.connectToDatabase();

        let result = await this.chain.filter((node) => {
            return node && node.index == index;
        });

        // Check if the result is not null or undefined
        if (result) {
            result = { buffer: result[0].data.file.buffer };

            return result;
        } else {
            // Handle the case where the result is null or undefined
            throw new Error("No blocks found for the specified ID.");
        }
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
