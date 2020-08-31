## Summary:

I have a fork of the zksync repo with two github NPM packages deployed @quantik-solutions/numio-zksync & @quantik-solutions/numio-zksync-api. They hold the same implementation of the original zksync lib, but now just with a modified zksync-crypto package to handle the wasm files differently. I originally went ahead and started to implement these libraries in the numio-zksync-api directly, but I noticed a huge increase in time in between calls to the ethers library(even when consolodating the versions & ref.s including trying out their umd modules). Around this time I started running into issues with specifically ethers ([#1021](https://github.com/ethers-io/ethers.js/issues/1021), [#465](https://github.com/ethers-io/ethers.js/issues/465), [#646](https://github.com/ethers-io/ethers.js/issues/646), and another one that caused me to have to use ws connections). 

When you are debugging be aware that the javascript gets executed through the web browser's context when being used as a debugger window.

The main difference maker when it comes to the zksync-crypto library is within the package.json file and the zksync_crypto_promise.js file. Withing the package.json there is an alias for the main file reference under react-native that changes the wasm functionality's source from either WebAssebly.instantiate, or the zksync_crypto_asm file (the wasm essentially babel-fied). Behind that you have the polyfills imported from polkadot in addition to a function that is imported from the zksync-crypto.js file within that module called waitReady, this function returns a promise once the wasm files are done loading.

## Important Additions:

### Metro Config

```jsx
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const extraNodeModules = require('node-libs-react-native');
const defaultAssetExts = require('metro-config/src/defaults/defaults')
  .assetExts;
module.exports = {
  server: {
    enableVisualizer: true,
  },
  resolver: {
    extraNodeModules: {
      ...extraNodeModules,
      vm: require.resolve('vm-browserify'),
    },
    resolverMainFields: ['react-native', 'main'],
    assetExts: [
      ...defaultAssetExts, // <- array spreading defaults
      'wasm',
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
```
```

### index.js

```jsx
/**
 * @format
 */
import './shim.js'; // auto generated from postinstall script
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### App.js

```jsx
import * as zksync from '@quantik-solutions/numio-zksync';
const App = () => {
  const [phrase, setPhrase] = useState();
  useEffect(() => {
    async function init() {
      // try {
				
			// Allows the wasm files to load
      // await cryptoWaitReady();
      await zksync.crypto.waitReady();

      const syncProvider = await zksync.getDefaultProvider('');
      const ethersProvider = new ethers.providers.InfuraProvider.getWebSocketProvider(
        '',
        {
          projectId: '',
        },
      );
      // console.log(ethersProvider);
      const ethWallet = ethers.Wallet.fromMnemonic(
        'devote another tenant public call poet vacuum force arctic add start video',
      ).connect(ethersProvider);
      const syncWallet = await zksync.Wallet.fromEthSigner(
        ethWallet,
        syncProvider,
      );
      await syncWallet.setSigningKey();

      const ethWallet_2 = ethers.Wallet.fromMnemonic(
        'devote apple tenant public call poet boat force arctic add start video',
      ).connect(ethersProvider);
      const syncWallet_2 = await zksync.Wallet.fromEthSigner(
        ethWallet_2,
        syncProvider,
      );
      //----------Deposit Token Call--------------

      let amount = '2000000000000000';
      let amountBN = ethers.BigNumber.from(amount);
      let token = 'ETH';
      let fee = await syncWallet.getTransferFee(syncWallet_2.address, 'ETH');

      await syncWallet.syncTransfer(
        syncWallet_2.address,
        amountBN,
        token,
        fee.toString(),
      );

      // await depositToken(
      //   syncWallet,
      //   ethWallet.address,
      //   packableAmount.toString(),
      //   token,
      // );
      // const changePubkey = await syncWallet.setSigningKey();
      // console.log(changePubkey);

      // const opConfCountNeeded = await syncProvider.getConfirmationsForEthOpAmount();
      // console.log('opConfCountNeeded', opConfCountNeeded);
      // // TODO: Check if it is possible to see gas feee and then check if there is enough ether to make a deposit
      // let balance = await syncWallet.getEthereumBalance(token);
      // console.log(
      //   `Token Balance of ${syncWallet.address()}:`,
      //   balance.toString(),
      // );
      //
      // let depositData = {
      //   depositTo: syncWallet.address(),
      //   token: token,
      //   amount: amountBN,
      // };
      //
      // console.log('Deposit Data: ', depositData);
      // let state = await syncWallet.getAccountState();
      // console.log('*** Account State: ', state);
      //
      // let id = await syncWallet.getAccountId();
      // console.log('*** Account Id: ', id);
      // let depositOperation = await syncWallet.depositToSyncFromEthereum(
      //   depositData,
      // );
      // console.log('OpHash', depositOperation.ethTx.hash);
      // await depositOperation.awaitReceipt();
      //
      // if (!(await syncWallet.isSigningKeySet())) {
      //   if ((await syncWallet.getAccountId()) == undefined) {
      //     throw new Error('Unknwon account');
      //   }
      //
      //   const changePubkey = await syncWallet.setSigningKey();
      //
      //   // Wait until the tx is committed
      //   await changePubkey.awaitReceipt();
      // }
      //------------------------------------------

      //----------Unlock ZK Account--------------
      // await unlockZKAccount(syncWallet);
      // const zkBalance = await syncWallet.getBalance(token);
      // console.log('zkBalance', zkBalance.div(ethers.constants.WeiPerEther));
      //------------------------------------------

      // setPhrase
      // } catch (e) {
      //   console.error('Error in Effect', e);
      // }
    }
    init();
  }, []);
```

## Package.json

## Important Scripts

```jsx
"scripts": {
	"android": "react-native run-android",
	"ios": "REACT_NATIVE_CRYPTO_ASM=1 react-native run-ios",
  "ios:build": "REACT_NATIVE_CRYPTO_ASM=1 react-native run-ios --configuration=release",
	"start": "REACT_NATIVE_CRYPTO_ASM=1 CRYPTO_ASM=1 NODE_OPTIONS=--max_old_space_size=8192 npx react-native start --verbose",
  "start:clean": "REACT_NATIVE_CRYPTO_ASM=1 CRYPTO_ASM=1 NODE_OPTIONS=--max_old_space_size=8192 npx react-native start --reset-cache --verbose",
  "start:dev": "REACT_DEBUGGER=\"open -g 'rndebugger://set-debugger-loc?port=8081' ||\"  CRYPTO_ASM=1 react-native start",
	"clean:perfect": "watchman watch-del-all && rm package-lock.json && rm -rf node_modules && rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/haste-map-* && NPM_CONFIG_CRYPTO_ASM=1 npm install",
  "postinstall": "npx jetify &&  npx rn-nodeify --install --hack"
}
```

## Dependencies

```jsx
"dependencies": {
    "@polkadot/util": "^3.3.1",
    "@polkadot/util-crypto": "^3.3.1",
    "@quantik-solutions/numio-zksync": "0.0.3",
    "@quantik-solutions/numio-zksync-api": "0.0.8",
    "@tradle/react-native-http": "^2.0.1",
    "base-64": "^0.1.0",
    "browserify-zlib": "^0.1.4",
    "buffer": "^4.9.2",
    "console-browserify": "^1.2.0",
    "constants-browserify": "^1.0.0",
    "dns.js": "^1.0.1",
    "ethers": "^5.0.9",
    "get-random-values-polypony": "^1.0.0",
    "https-browserify": "0.0.1",
    "node-libs-react-native": "^1.2.0",
    "path-browserify": "^1.0.1",
    "punycode": "^1.4.1",
    "react": "16.13.1",
    "react-native": "0.63.2",
    "react-native-level-fs": "^3.0.1",
    "react-native-os": "^1.2.6",
		"react-native-randombytes": "^3.5.3",
    "react-native-tcp": "^3.3.2",
    "react-native-udp": "^2.7.0",
    "readable-stream": "^1.0.33",
    "stream-browserify": "^1.0.0",
    "string_decoder": "^0.10.31",
    "timers-browserify": "^1.4.2",
    "tty-browserify": "0.0.1",
    "url": "^0.10.3",
    "util": "^0.12.3",
    "vm-browserify": "0.0.4"
  },
  "devDependencies": {
    "@babel/core": "^7.11.4",
    "@babel/runtime": "^7.11.2",
    "@react-native-community/eslint-config": "^2.0.0",
    "babel-jest": "^26.3.0",
    "eslint": "^7.7.0",
    "jest": "^26.4.2",
    "metro-config": "^0.63.0",
    "metro-react-native-babel-preset": "^0.63.0",
    "react-test-renderer": "16.13.1"
  },
```

## Aliases

```jsx
"react-native": {
    "zlib": "browserify-zlib",
    "console": "console-browserify",
    "constants": "constants-browserify",
    "crypto": "react-native-crypto",
    "dns": "dns.js",
    "net": "react-native-tcp",
    "domain": "domain-browser",
    "http": "@tradle/react-native-http",
    "https": "https-browserify",
    "os": "react-native-os",
    "path": "path-browserify",
    "querystring": "querystring-es3",
    "fs": "react-native-level-fs",
    "_stream_transform": "readable-stream/transform",
    "_stream_readable": "readable-stream/readable",
    "_stream_writable": "readable-stream/writable",
    "_stream_duplex": "readable-stream/duplex",
    "_stream_passthrough": "readable-stream/passthrough",
    "dgram": "react-native-udp",
    "stream": "stream-browserify",
    "timers": "timers-browserify",
    "tty": "tty-browserify",
    "vm": "vm-browserify",
    "tls": false
  },
  "browser": {
    "zlib": "browserify-zlib",
    "console": "console-browserify",
    "constants": "constants-browserify",
    "crypto": "react-native-crypto",
    "dns": "dns.js",
    "net": "react-native-tcp",
    "domain": "domain-browser",
    "http": "@tradle/react-native-http",
    "https": "https-browserify",
    "os": "react-native-os",
    "path": "path-browserify",
    "querystring": "querystring-es3",
    "fs": "react-native-level-fs",
    "_stream_transform": "readable-stream/transform",
    "_stream_readable": "readable-stream/readable",
    "_stream_writable": "readable-stream/writable",
    "_stream_duplex": "readable-stream/duplex",
    "_stream_passthrough": "readable-stream/passthrough",
    "dgram": "react-native-udp",
    "stream": "stream-browserify",
    "timers": "timers-browserify",
    "tty": "tty-browserify",
    "vm": "vm-browserify",
    "tls": false
  }
```
