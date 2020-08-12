import {useContext, useState} from "react";
import {web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import Keyring from '@polkadot/ui-keyring';
import config from "@/config";
import {AccountsContext} from "@/context/accounts";

export function useSubstrate() {
  const {accounts, storeAccounts, address, storeAddress, keyring, storeKeyring} = useContext(AccountsContext);
  const [accountsTmp, setAccountsTmp] = useState(accounts);
  const [addressTmp, setAddressTmp] = useState(address);
  const [keyringTmp, setKeyringTmp] = useState(keyring);

  const getAccounts = async () =>
    new Promise(function (resolve, reject) {
      try {
        (async () => {
          if (!accountsTmp) {
            console.log('NO ACCOUNTS');
            const injected = await web3Enable(config.APP_NAME);
            if (!injected.length) {
              throw new Error('NO_EXTENSIONS');
            }
            const acc = await web3Accounts();
            if (!acc.length) {
              throw new Error('NO_ACCOUNTS');
            }
            resolve(acc);
            storeAccounts(acc);
            setAccountsTmp(acc);
          } else {
            resolve(accountsTmp);
          }
        })()
      } catch (error) {
        reject(error)
      }
    });

  const getAddress = async () =>
    new Promise(function (resolve, reject) {
      try {
        (async () => {
          if (!addressTmp) {
            const account = await getAccounts();
            const keyringOptions = account.map((acc) => ({
              key: acc.address,
              value: acc.address,
              text: acc.meta.name.toUpperCase(),
              icon: 'user',
            }));
            const initialAddress = keyringOptions.length > 0 ? keyringOptions[0].value : '';
            // TODO 使用Alice演示
            resolve('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
            storeAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
            setAddressTmp(initialAddress);
          } else {
            resolve(addressTmp)
          }
        })()
      } catch (error) {
        reject(error)
      }
    });

  const getKeyring = async () =>
    new Promise(function (resolve, reject) {
      try {
        (async () => {
          if (!keyringTmp) {

            let allAccounts;
            if (!accounts) {
              allAccounts = await getAccounts();
            } else {
              allAccounts = accounts;
            }
            allAccounts = allAccounts.map(({ address, meta }) =>
              ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
            Keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);

            resolve(Keyring);
            storeKeyring(Keyring);
            setKeyringTmp(Keyring);
          } else {
            resolve(keyringTmp)
          }
        })()
      } catch (error) {
        reject(error)
      }
    });

  return {
    async address() {
      return new Promise(function (resolve, reject) {
        try {
          (async () => {
            const add = await getAddress();
            resolve(add)
          })()
        } catch (error) {
          reject(error)
        }
      })
    },

    async keyring() {
      return new Promise(function (resolve, reject) {
        try {
          (async () => {
            const kr = await getKeyring();
            resolve(kr)
          })()
        } catch (error) {
          reject(error)
        }
      })
    },
  }
}
