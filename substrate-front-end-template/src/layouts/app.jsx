import React from "react";
import {AccountsProvider} from "@/context/accounts";

function App(props) {
  const {children} = props;
  return(
    <AccountsProvider>
      <div style={{height: '100%', display: 'block'}}>
        {children}
      </div>
    </AccountsProvider>
  )
}

export default App;
