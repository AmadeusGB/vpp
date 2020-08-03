import React, { createContext, useCallback, useEffect, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const initialAccount = '';

const AccountsContext = createContext({
  account: initialAccount,
});

export function AccountsProvider(props) {
  const [account, setAccount] = useState(initialAccount);

  const loadAccounts = useCallback(async () => {
    const injected = await web3Enable('Vpp-Frontend');
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

  const contextValue = {
    account,
  };

  return <AccountsContext.Provider value={contextValue}>{props.children}</AccountsContext.Provider>;
}

export { AccountsContext };
