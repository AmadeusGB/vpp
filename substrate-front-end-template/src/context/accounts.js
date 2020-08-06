import React, { createContext, useState } from 'react';

const AccountsContext = createContext({
  accounts: null,
  storeAccounts: () => {
    throw new Error('Accounts not yet ready.');
  },
  address: null,
  storeAddress: () => {
    throw new Error('Address not yet ready.');
  },
  keyring: null,
  storeKeyring: () => {
    throw new Error('Keyring not yet ready.');
  },
});

export function AccountsProvider(props) {
  const [accounts, setAccounts] = useState(null);
  const [address, setAddress] = useState(null);
  const [keyring, setKeyring] = useState(null);

  const storeAccounts = (acc) => {
    setAccounts(acc);
  };

  const storeAddress = (addr) => {
    setAddress(addr);
  };

  const storeKeyring = (kr) => {
    setKeyring(kr);
  };

  const contextValue = {
    accounts,
    address,
    keyring,
    storeAccounts,
    storeAddress,
    storeKeyring
  };

  return <AccountsContext.Provider value={contextValue}>{props.children}</AccountsContext.Provider>;
}

export { AccountsContext };
