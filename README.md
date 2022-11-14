
# Explorer application Frontend

## About Explorer Application

The Pando Explorer is a [blockchain explorer](https://explorer.pandoproject.org/) which allows users look up, confirm and validate transactions on the Pando blockchain. By entering an address into the search box, you can view the balance, value and all the transactions made through that address.
The explorer also allows a user to check the details of a transaction with the transaction hash. Once you’ve pasted the hash into the search bar, a series of transaction details will appear. These include the type of the transaction, the height of the block that includes the transaction, and the timestamp when the transaction was finalized on-chain.
With smart contract support enabled on the Pando blockchain, the Pando Explorer was redesigned to more easily inspect and monitor smart contracts on Pando Mainnet. Similar to Etherscan.io, the Pando Explorer allows developers to upload and verify the source code of their smart contracts, query the read-only interface of the smart contracts, and record the Pando VM returns and emitted events for ease of debugging. please explorer site to know more https://explorer.pandoproject.org/.


**URL of explorer backend code is** : https://github.com/pandoprojects/pando-explorer-backend-node

## How to launch the project (Frontend) on your local system.

#### Take clone of this repo in your system and run following command

#### To install depandency 

```
npm i
```

#### Run the application

```
npm run start
```

#### Runs the app in the development mode.

Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Build Application

```
npm build
```

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

For more detail about projects please go thourgh our [official Documenation](https://docs.pandoproject.org/)

## API Reference
This is the Explorer API reference link [Click here](https://chainapi.pandoproject.org/](https://chainapi.pandoproject.org/#b8aa0cf5-dd39-4cd3-985d-615d8ff1de49)

License
The Explorer backend application reference implementation is licensed under the [GNU License](https://github.com/pandoprojects/pando-explorer-frontend/blob/main/LICENSE)
