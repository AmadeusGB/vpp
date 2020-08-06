import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { AccountsContext } from '@/context/accounts';
import { ApiContext } from '@/context/api';
import {useSubstrate} from "@/lib/lib";

function Welcome() {
  const lib = useSubstrate();
  const { api, apiState } = React.useContext(ApiContext);
  const { address } = React.useContext(AccountsContext);
  const [nodeInfo, setNodeInfo] = useState({ chain: '', nodeName: '', nodeVersion: '' });
  const [addr, setAddr] = useState('');

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
    if (api) {
      getInfo();
    }
  }, [api]);

  // GET ADDRESS
  useEffect(() => {
    (async () => {
      if (api) {
        const add = await lib.address();
        setAddr(add)
      }
    })();
  },[api]);

  useEffect(() => {
    (async () => {
      if (address) {
        await lib.keyring();
      }
    })();
  },[address]);

  const Main = () => {
    return (
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}
      >
        {`${nodeInfo.chain  } | ${  nodeInfo.nodeName  } | ${  nodeInfo.nodeVersion}`}
        <br/>
        {addr}
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
