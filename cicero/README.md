# Cicero
Hyperleger Fabric Chaincode to deploy and execute Accord Project Cicero Smart Legal Contract templates

## Running

```
./startFabric node
```

Wait for 2-3 minutes while HLF starts. The install the npm dependencies for the client code:

```
npm install
```

You can then enroll the administrator into the network:

```
node enrollAdmin.js
```

And then register a user:

```
node registerUser.js
```

Next we deploy a Cicero Smart Legal Contract by invoking the `deploySmartLegalContract` chaincode function. 
The template is downloaded from https://templates.accordproject.org and then stored in the blockchain along 
with the contract text and the initial state of the contract.

```
node deploy.js
```

Finally we send an incoming transaction to our deployed contract. The contract executes with the return value passed back to the client, any events emitted via the HLF event bus, and the updated state of the contract is persisted to the blockchain.

```
node execute.js
```

You should see output similar to this:

```
$ node execute.js
Store path:/Users/dselman/dev/fabric-samples/cicero/hfc-key-store
Successfully loaded user1 from persistence
Assigning transaction_id:  e2983e5542780338302328e6b71e1cb36f30557f1a2126de8ab506b773eedfe4
Request: {
    "$class": "org.accordproject.helloworld.MyRequest",
    "input": "Accord Project"
}
Transaction proposal was good
Response payload: {
    "$class": "org.accordproject.helloworld.MyResponse",
    "output": "Hello Fred Blogs Accord Project",
    "transactionId": "ddb6bec8-2e52-43ae-b87d-14350a5967e2",
    "timestamp": "2018-06-26T10:50:24.302Z"
}
Successfully sent Proposal and received ProposalResponse: Status - 200, message - ""
The transaction has been committed on peer localhost:7053
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer
```