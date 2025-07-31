# PortaPass – Universal Web3 Access Pass

A blockchain-based, cross-chain platform for managing digital subscriptions, memberships, and event tickets using smart contracts. PortaPass enables users to own, share, transfer, and verify access rights transparently and securely across ecosystems.

---

## Overview

PortaPass consists of ten smart contracts that collectively manage subscription access, ticketing, rental, payments, and reputation in a decentralized, interoperable framework.

1. **Pass NFT Factory Contract** – Mints portable, programmable access passes as NFTs  
2. **Subscription Manager Contract** – Handles renewals, expirations, and recurring payments  
3. **Rental & Delegation Contract** – Enables time-limited lending or shared access  
4. **Access Verification Contract** – Validates user pass rights for services or venues  
5. **Cross-Chain Relay Contract** – Syncs pass ownership and state across blockchains  
6. **Marketplace Contract** – Facilitates resale and trading of active passes  
7. **Pass Staking Contract** – Enables loyalty rewards and platform incentives  
8. **Issuer Registry Contract** – Whitelists trusted pass issuers and service providers  
9. **Dynamic Metadata Contract** – Updates pass visuals and stats based on activity  
10. **Compliance Module Contract** – Applies restrictions based on age, location, or regulations  

---

## Features

- Cross-chain NFT access pass system  
- Subscription lifecycle automation  
- Peer-to-peer pass rental and transfer  
- Real-time access verification  
- Token-based loyalty and staking rewards  
- Verified issuer registry with DAO governance  
- Compliant access control for regulated content  
- Portable passes for events, gyms, software, and memberships  

---

## Smart Contracts

### **Pass NFT Factory Contract**

- Mints ERC-721 or ERC-1155 compatible access passes  
- Supports expiration dates, tiered access, and metadata hooks  
- Cross-chain mint support with LayerZero/Axelar  

### **Subscription Manager Contract**

- Recurring billing using native or wrapped tokens  
- Expiry, grace period, and auto-renew logic  
- Alerts and renewal incentives  

### **Rental & Delegation Contract**

- Temporary pass leasing or guest access delegation  
- Usage-limited delegation (e.g. number of scans)  
- Fee-sharing model for rentals  

### **Access Verification Contract**

- Off-chain QR generation with on-chain validation  
- Venue-side or app-side signature verification  
- Fraud and double-use prevention  

### **Cross-Chain Relay Contract**

- Syncs NFT metadata and access status across chains  
- Integrates with Axelar or LayerZero messaging  
- Ensures pass state consistency  

### **Marketplace Contract**

- Users can list, buy, or auction active passes  
- Secondary royalties to issuers  
- Built-in anti-scalping logic  

### **Pass Staking Contract**

- Stake passes to earn platform tokens or perks  
- Unlock exclusive tiers or services  
- Used in reputation scoring  

### **Issuer Registry Contract**

- DAO-vetted list of verified issuers  
- Role-based permissioning for pass creation  
- Voting on issuer onboarding  

### **Dynamic Metadata Contract**

- Live rendering of pass visuals based on usage  
- Tier upgrade animations and stats  
- Supports seasonal themes or branding  

### **Compliance Module Contract**

- Enforces geographic, age, or KYC compliance  
- Integrates with third-party identity oracles  
- Enables region-locked or regulated passes  

---

## Installation

1. Install Clarinet CLI  
2. Clone this repository  
3. Install dependencies: `npm install`  
4. Run tests: `npm test`  
5. Deploy contracts: `clarinet deploy`

---

## Usage

Each contract operates modularly. Deploy independently or together depending on your dApp's use case (e.g. event ticketing, software subscription, DAO access control).  
Refer to individual contract docs in `/contracts/` for setup and function call instructions.

---

## Testing

All smart contracts include unit and integration tests using Vitest.

```bash
npm test
```

## License

MIT License