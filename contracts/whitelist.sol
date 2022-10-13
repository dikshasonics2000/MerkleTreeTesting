// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
contract Whitelist {


bytes32 public merkleRoot;

constructor(bytes32 _merkleRoot) {
    merkleRoot = _merkleRoot; // storingo nly the root of the merkle tree and not all nodes
}
//maxAllowanceToMint is a variable that keeps track of the number of NFT's a given address can mint.
function checkInWhitelist(bytes32[] calldata proof, uint64 maxAllowanceToMint) view public returns(bool) {
    //The hash of the leaf node on which this address exists can be computed by first encoding the address of the 
    //sender and the maxAllowanceToMint into a bytes string which further given down to the keccak256 hash function which
    // requires the hash string to generate the hash.
    bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowanceToMint));
    bool verified = MerkleProof.verify(proof, merkleRoot, leaf); // openzepplin does the verification of proof provided by the user
    return verified;
}
}