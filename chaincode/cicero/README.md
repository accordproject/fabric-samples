# Cicero
Hyperleger Fabric Chaincode to deploy and execute Accord Project Cicero Smart Legal Contract templates

The chaincode exposes the following methods

### Init

Called by HLF to initialize the chaincode.

### Invoke

Called by HLF when a transaction is received. Dispatches to the functions below.

### initLedger

Initializes the state of the ledger for this chaincode

#### Arguments

None.

### deploySmartLegalContract

Deploys a Smart Legal Contract to the ledger

#### Arguments

- contractId (string), the identifier of the contract. Used on subsequent calls to `executeSmartLegalContract`. 
- templateData (base64 encoded string), a base-64 encoded Cicero template archive. 
- contractData (JSON string), the JSON object (as a string) that parameterizes the templates. Must be a valid instance of the template model for the contract.
- state (JSON string), the JSON object (as a string) for the initial state of the contract. Must be a valid instance of the state model for the contract.

### executeSmartLegalContract

Executes a previously deployed Smart Legal Contract, returning results and emitting events.

#### Arguments

- contractId (string), the identifier of the contract. As used in a  prior call to `deploySmartLegalContract`. 
- request (JSON string), the JSON object (as a string) for request object for the contract. Must be a valid instance of a contract request type.