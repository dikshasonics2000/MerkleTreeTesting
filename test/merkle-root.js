const { expect } = require("chai");
const {ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

function encodeLeaf(address, spots) {
    return ethers.utils.defaultAbiCoder.encode(
        ["address", "uint64"],
        [address, spots]
    );
}

describe("Check if merkle root is working", function() {
    it("should be able to verify if a given address is in whitelist or not", async function () {

        const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();

        const list = [
      encodeLeaf(owner.address, 2),
      encodeLeaf(addr1.address, 2),
      encodeLeaf(addr2.address, 2),
      encodeLeaf(addr3.address, 2),
      encodeLeaf(addr4.address, 2),
      encodeLeaf(addr5.address, 2),
        ];

        const merkleTree = new MerkleTree(list, keccak256, {
            hashLeaves: true,
            sortPairs: true,
        });
        const root = merkleTree.getHexRoot();
 //deploy the contract
        const whitelist = await ethers.getContractFactory("Whitelist");
    const Whitelist = await whitelist.deploy(root);
    await Whitelist.deployed();
    const leaf = keccak256(list[0]); //hash of root
    const proof = merkleTree.getHexProof(leaf); // get hexproof of hash root

    let verified = await Whitelist.checkInWhitelist(proof, 2);
    expect(verified).to.equal(true); //test the verified returns true
    
    verified = await Whitelist.checkInWhitelist([], 2);
    expect(verified).to.equal(false);
    });
});