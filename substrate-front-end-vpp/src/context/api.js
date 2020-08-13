import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import config from "@/config";

const initialApi = null;
const ENDPOINT = process.env.ENDPOINT || 'ws://127.0.0.1:9944';

const ApiContext = createContext({
  api: initialApi,
  apiState: '',
  createApi: () => {
    throw new Error('Api not yet ready.');
  },
});

export function ApiProvider(props) {
  const [api, setApi] = useState(initialApi);
  const [apiState, setApiState] = useState('');

  useEffect(() => {
    try {
      (async () => {
        const wsProvider = new WsProvider(ENDPOINT);
        const a = await ApiPromise.create({ provider: wsProvider, types: config.CUSTOM_TYPES, rpc: jsonrpc });
        setApi(a);
      })();
    } catch (error) {
      throw new Error('Create Api failed.');
    }
  }, []);

  const connect = useCallback(async () => {
    if (!api) {
      setApiState('CONNECTING');
      return;
    }
    await api.isReady;
    setApiState('CONNECT_SUCCESS');
  }, [api]);

  useEffect(() => {
    connect();
  }, [connect, api]);

  const createApi = (a) => {
    setApi(a);
  };

  const contextValue = {
    api,
    apiState,
    createApi,
  };

  return <ApiContext.Provider value={contextValue}>{props.children}</ApiContext.Provider>;
}

export { ApiContext };
