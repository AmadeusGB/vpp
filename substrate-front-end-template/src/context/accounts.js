import React, { createContext, useCallback, useEffect, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import Keyring from '@polkadot/ui-keyring';
import config from "@/config";

const initialAccount = '';

const AccountsContext = createContext({
  account: initialAccount,
  keyring: null,
});

export function AccountsProvider(props) {
  const [account, setAccount] = useState(initialAccount);
  const [keyring, setKeyring] = useState(null);

  // load all account
  const loadAccounts = useCallback(async () => {
    const injected = await web3Enable(config.APP_NAME);
    if (!injected.length) {
      throw new Error('NO_EXTENSIONS');
    }
    const accounts = await web3Accounts();
    if (!accounts.length) {
      throw new Error('NO_ACCOUNTS');
    }
    return accounts;
  }, []);

  useEffect(() => {
    Promise.all([loadAccounts()])
      .then(([accounts]) => {
        // Get the list of accounts we possess the private key for
        const keyringOptions = accounts.map((acc) => ({
          key: acc.address,
          value: acc.address,
          text: acc.meta.name.toUpperCase(),
          icon: 'user',
        }));
        const initialAddress = keyringOptions.length > 0 ? keyringOptions[0].value : '';
        setAccount(initialAddress);
      })
      .catch((e) => console.log(e));
  }, []);

  // load keyring
  const loadKeyring = useCallback(async () => {
    try {
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
      Keyring.loadAll({ isDevelopment: true }, allAccounts);
      setKeyring(Keyring);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadKeyring();
  },[]);

  const contextValue = {
    account,
    keyring
  };

  return <AccountsContext.Provider value={contextValue}>{props.children}</AccountsContext.Provider>;
}

export { AccountsContext };
