import React, {createContext, useCallback, useEffect, useState} from "react";
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const initialAccounts = [];

const AccountsContext = createContext({
  accounts: initialAccounts,
});

export function AccountsProvider(props) {
  const [accounts, setAccounts] = useState(initialAccounts);

  const loadAccounts = useCallback(async () => {
    const injected = await web3Enable('Vpp-Frontend');

    if (!injected.length) {
      throw new Error('NO_EXTENSIONS');
    }

    const account = await web3Accounts();

    if (!account.length) {
      throw new Error('NO_ACCOUNTS');
    }

    return account;
  }, []);

  useEffect(() => {
    Promise
      .all([loadAccounts()])
      .then(([data]) => {
        setAccounts({...accounts, ...data})
      })
      .catch(e => console.log(e));
  }, []);

  const contextValue = {
    accounts,
  };

  return <AccountsContext.Provider value={contextValue}>{props.children}</AccountsContext.Provider>
}

export { AccountsContext }
