import { useContext } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiContext } from '../context/api';

const ENDPOINT = 'ws://127.0.0.1:9944';

export function useApi() {
  const { api } = useContext(ApiContext);
  const getApi = async () =>
    new Promise(function (resolve, reject) {
      try {
        (async () => {
          if (Object.keys(api).length === 0) {
            const wsProvider = new WsProvider(ENDPOINT);
            const a = await ApiPromise.create({ provider: wsProvider });
            resolve(a);
          } else {
            resolve(api);
          }
        })();
      } catch (error) {
        reject(error);
      }
    });

  return {
    async currentApi() {
      return new Promise(function (resolve, reject) {
        try {
          (async () => {
            const API = await getApi();
            resolve(API);
          })();
        } catch (error) {
          reject(error);
        }
      });
    },
  };
}
