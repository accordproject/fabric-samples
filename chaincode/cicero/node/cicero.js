/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const shim = require('fabric-shim');
const util = require('util');

const Template = require('@accordproject/cicero-core').Template;
const Clause = require('@accordproject/cicero-core').Clause;
const Engine = require('@accordproject/cicero-engine').Engine;

/**
 * Hyperledger Fabric chaincode to deploy and execute an Accord Project
 * Cicero Smart Legal Contract.
 */
class Chaincode {

  /**
   * 
   * @param {*} stub 
   */
  async Init(stub) {
    console.info('=========== Instantiated cicero chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  /**
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    console.info('============= END : Initialize Ledger ===========');
  }

  /**
   * 
   * @param {} stub 
   * @param {*} args 
   */
  async deploySmartLegalContract(stub, args) {
    console.info('============= START : Deploy Smart Contract ===========');
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4 (Contract ID, Template Base64, Contract Data. State)');
    }

    const contractId = args[0];
    const templateData = args[1];
    const contractData = args[2];
    const stateText = args[3];

    // check that the template is valid
    const template = await Template.fromArchive(Buffer.from(templateData, 'base64'));
    console.info(`Loaded template: ${template.getIdentifier()}`);

    // save the template data
    await stub.putState(`${contractId}-Template`, templateData);
    
    // check the clause data is valid
    const clause = new Clause(template);
    clause.setData(JSON.parse(contractData));

    // save the initial state
    const state = template.getSerializer().fromJSON(JSON.parse(stateText));
    await stub.putState(`${contractId}-State`, Buffer.from(JSON.stringify(state)));

    // save the contract data
    await stub.putState(`${contractId}-Data`, Buffer.from(JSON.stringify(clause.getData())));

    // return a message
    return Buffer.from(`Successfully deployed contract ${contractId} based on ${template.getIdentifier()}`);
  }

  /**
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async executeSmartLegalContract(stub, args) {
    console.info('============= START : Execute Smart Contract ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2 (Contract ID, Request)');
    }

    const contractId = args[0];
    const requestText = args[1];

    // load the template
    const templateUrlAsBytes = await stub.getState(`${contractId}-Template`);
    if(!templateUrlAsBytes) {
      throw new Error(`Did not find an active contract ${contractId}. Ensure it has been deployed. (1)`);
    }
    const template = await Template.fromArchive(Buffer.from(templateUrlAsBytes, 'base64'));    
    console.info(`Loaded template: ${template.getIdentifier()}`);

    // load data
    const dataAsBytes = await stub.getState(`${contractId}-Data`);
    if(!dataAsBytes) {
      throw new Error(`Did not find an active contract ${contractId}. Ensure it has been deployed. (2)`);
    }
    const data = JSON.parse(dataAsBytes);

    // load state
    const stateAsBytes = await stub.getState(`${contractId}-State`);
    if(!stateAsBytes) {
      throw new Error(`Did not find an active contract ${contractId}. Ensure it has been deployed. (3)`);
    }
    const state = JSON.parse(stateAsBytes);
    
    // parse the request
    const request = JSON.parse(requestText);

    // set the clause data
    const clause = new Clause(template);
    clause.setData(data);

    // execute the engine
    const engine = new Engine();
    const result = await engine.execute(clause, request, state);
    console.info(`Response from engine execute: ${JSON.stringify(result)}`);

    // save the state
    await stub.putState(`${contractId}-State`, Buffer.from(JSON.stringify(result.state)));

    // emit any events
    if(result.emit.length > 0) {
      await stub.setEvent(`${contractId}-${request.transactionId}-Events`, Buffer.from(JSON.stringify(result.emit)));
    }
    
    // return the response
    return Buffer.from(JSON.stringify(result.response));
    console.info('============= END : Execute Smart Contract ===========');
  }
}

shim.start(new Chaincode());
