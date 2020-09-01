/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Fragment, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import '@polkadot/util';
// import {cryptoWaitReady} from '@polkadot/util-crypto';
import * as zksync from '@quantik-solutions/numio-zksync';
import * as ethers from 'ethers';

const App = () => {
  const [phrase, setPhrase] = useState();
  useEffect(() => {
    // async function unlockZKAccount(syncWallet) {
    //   if (!(await syncWallet.isSigningKeySet())) {
    //     if ((await syncWallet.getAccountId()) == undefined) {
    //       throw new Error('Unknwon account');
    //     }
    //
    //     const changePubkey = await syncWallet.setSigningKey();
    //
    //     // Wait until the tx is committed
    //     await changePubkey.awaitReceipt();
    //   }
    // }
    // async function depositToken(syncWallet, to, amount, token) {
    //   try {
    //     if (token !== 'ETH') {
    //       let approved = await syncWallet.isERC20DepositsApproved(token);
    //       console.log('Approved: ', approved);
    //       if (!approved) {
    //         throw `${token} token transfer is not approved for this account`;
    //       }
    //     }
    //     // TODO: Check if it is possible to see gas feee and then check if there is enough ether to make a deposit
    //     let balance = await syncWallet.getEthereumBalance(token);
    //     console.log(
    //       `Token Balance of ${syncWallet.address()}:`,
    //       balance.toString(),
    //     );
    //
    //     if (balance.lt(amount)) {
    //       throw `Too small ${token} balance to make a deposit.Balance:${balance.toString()}`;
    //     }
    //     let amountBN = ethers.BigNumber.from(amount);
    //     let depositData = {
    //       depositTo: to,
    //       token: token,
    //       amount: amountBN,
    //     };
    //
    //     console.log('Deposit Data: ', depositData);
    //     let state = await syncWallet.getAccountState();
    //     console.log('*** Account State: ', state);
    //
    //     let id = await syncWallet.getAccountId();
    //     console.log('*** Account Id: ', id);
    //     let depositOperation = await syncWallet.depositToSyncFromEthereum(
    //       depositData,
    //     );
    //     console.log(depositOperation.ethTx.hash);
    //
    //     await depositOperation.awaitReceipt();
    //     if (!(await syncWallet.isSigningKeySet())) {
    //       if ((await syncWallet.getAccountId()) == undefined) {
    //         throw new Error('Unknwon account');
    //       }
    //
    //       const changePubkey = await syncWallet.setSigningKey();
    //
    //       // Wait until the tx is committed
    //       await changePubkey.awaitReceipt();
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    async function init() {
      // try {
      // await cryptoWaitReady();
      await zksync.crypto.loadZkSyncCrypto();

      const syncProvider = await zksync.Provider.newHttpProvider(
        'http://ec2-3-135-199-154.us-east-2.compute.amazonaws.com:3030',
      );
      const ethersProvider = new ethers.providers.JsonRpcProvider(
        'http://ec2-3-135-199-154.us-east-2.compute.amazonaws.com:8545',
      );
      // const ethersProvider = new ethers.providers.InfuraProvider.getWebSocketProvider(
      //   'ropsten',
      //   {
      //     projectId: '5773569ebfe44b3b8c1449149797e6d5',
      //   },
      // );
      // console.log(ethersProvider);
      // const ethWallet = ethers.Wallet.fromMnemonic(
      //   'devote another tenant public call poet vacuum force arctic add start video',
      // ).connect(ethersProvider);
      console.log(syncProvider);

      var account = ethers.Wallet.fromMnemonic(
        'fine music test violin matrix prize squirrel panther purchase material script deal',
        "m/44'/60'/0'/0/1",
      );
      // var keystore = await account.encrypt('testpassword');
      let ethersWallet = account.connect(ethersProvider);
      let zkWallet = await zksync.Wallet.fromEthSigner(
        ethersWallet,
        syncProvider,
      );

      console.log('zkWallet', zkWallet);

      const opConfCountNeeded = await syncProvider.getConfirmationsForEthOpAmount();
      console.log('opConfCountNeeded', opConfCountNeeded);

      let state = await zkWallet.getAccountState();
      console.log('*** Account State: ', state);

      let id = await zkWallet.getAccountId();
      console.log('*** Account Id: ', id);

      // const ethWallet_2 = ethers.Wallet.fromMnemonic(
      //   'devote apple tenant public call poet boat force arctic add start video',
      // ).connect(ethersProvider);
      // console.log('ethWallet2 Made');
      //
      // const syncWallet_2 = await zksync.Wallet.fromEthSigner(
      //   ethWallet_2,
      //   syncProvider,
      // );
      // console.log('syncWallet2 Made');
      //
      // //----------Deposit Token Call--------------
      // let amount = '2000000000000000';
      // let amountBN = ethers.BigNumber.from(amount);
      // let token = 'ETH';
      // let fee = await syncWallet.getTransferFee(syncWallet_2.address, 'ETH');
      // console.log(fee.toNumber());
      // await syncWallet.syncTransfer(
      //   syncWallet_2.address,
      //   amountBN,
      //   token,
      //   fee.toString(),
      // );

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
      //

      // console.log({'Eth Wallet': ethWallet}, {'Sync Wallet': syncWallet});
      // console.log(ethWallet._mnemonic);
    }
    init();
  }, []);
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Result {phrase}</Text>
              {/*<Text style={styles.sectionDescription}>*/}
              {/*  <ReloadInstructions />*/}
              {/*</Text>*/}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
