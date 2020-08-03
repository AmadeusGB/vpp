import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import config from "@/config";

const initialApi = {};
const ENDPOINT = 'ws://127.0.0.1:9944';

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
        const a = await ApiPromise.create({ provider: wsProvider, types: config.CUSTOM_TYPES });
        setApi(a);
      })();
    } catch (error) {
      throw new Error('Create Api failed.');
    }
  }, []);

  const connect = useCallback(async () => {
    if (Object.keys(api).length === 0) {
      setApiState('CONNECTING');
      return;
    }

    // We want to listen to event for disconnection and reconnection.
    // That's why we set for listeners.
    // api.on('connected', () => {
    //   setApiState('CONNECT');
    //   // `ready` event is not emitted upon reconnection. So we check explicitly here.
    //   api.isReady.then(() => {
    //     setApiState('CONNECT_SUCCESS')
    //   });
    // });
    // api.on('ready', () => setApiState('CONNECT_SUCCESS'));
    // api.on('error', () => setApiState('CONNECT_ERROR'));
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
