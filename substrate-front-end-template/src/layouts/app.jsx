import React from 'react';
import { AccountsProvider } from '@/context/accounts';
import { ApiProvider } from '@/context/api';

function App(props) {
  const { children } = props;

  return (
    <AccountsProvider>
      <ApiProvider>
        <div style={{ height: '100%', display: 'block' }}>{children}</div>
      </ApiProvider>
    </AccountsProvider>
  );
}

export default App;
