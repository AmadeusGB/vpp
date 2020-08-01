import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { AccountsContext } from '@/context/accounts';
import { ApiContext } from '@/context/api';

function Welcome() {
  const { account } = React.useContext(AccountsContext); // 拿address
  const { api, apiState } = React.useContext(ApiContext); // 拿api
  const [nodeInfo, setNodeInfo] = useState({ chain: '', nodeName: '', nodeVersion: '' });

  useEffect(() => {
    const getInfo = async () => {
      try {
        const [chain, nodeName, nodeVersion] = await Promise.all([
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.version(),
        ]);
        setNodeInfo({ chain, nodeName, nodeVersion });
      } catch (e) {
        console.error(e);
      }
    };
    if (Object.keys(api).length !== 0) {
      getInfo().then((r) => console.error(r));
    }
  }, [api]);

  const Main = () => {
    return (
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}
      >
        {`${nodeInfo.chain  } | ${  nodeInfo.nodeName  } | ${  nodeInfo.nodeVersion}`}
        <br/>
        {account}
      </div>
    );
  };

  const ShowSpin = () => {
    return (
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin tip="Connecting..." size="large" />
      </div>
    );
  };

  return <div>{apiState === 'CONNECT_SUCCESS' ? <Main /> : <ShowSpin />}</div>;
}

export default Welcome;
