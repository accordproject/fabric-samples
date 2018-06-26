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

You should see output similar to this:

```
$ node deploy.js 
Store path:/Users/dselman/dev/fabric-samples/cicero/hfc-key-store
Successfully loaded user1 from persistence
Assigning transaction_id:  f5aa3a7da82758c58db1528473eba9c9e2a8d96d52aa617cf955f7b317334635
Transaction proposal was good
Response payload: Successfully deployed contract MYCONTRACT based on helloworld@0.2.1
Successfully sent Proposal and received ProposalResponse: Status - 200, message - ""
The transaction has been committed on peer localhost:7053
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer
```

The interesting part is: `Response payload: Successfully deployed contract MYCONTRACT based on helloworld@0.2.1` !

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

The reponse payload shows that the logic of the template has run, combining data from the request with data from the template parameters.

## Editing Chaincode

If you would like to make changes to the cicero chaincode be aware that Docker caches the docker image for the chaincode. If you edit the source and run `./startFabric` you will *not* see your changes.

For your code changes to take effect you need to `docker stop` the peer (use `docker ps` to get the container id) and then `docker rmi -f` your docker chaincode image. The image name should look something like `dev-peer0.org1.example.com-cicero-1.0-598263b3afa0267a29243ec2ab8d19b7d2016ac628f13641ed1822c4241c5734`.