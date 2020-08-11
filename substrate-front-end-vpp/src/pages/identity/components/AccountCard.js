import React, {useContext, useEffect, useState} from "react";
import {Button, Divider} from 'antd';
import {TxButton} from "@/components/TxButton/TxButton";
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import styles from "../index.less";
import GroupSvg from "../assets/group.svg";

const AccountCard = () => {
  const {address} = useContext(AccountsContext);
  const {keyring} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const [balances, setBalances] = useState({token_balance: 0, token_stake: 0, token_vote: 0});
  const [total, setTotal] = useState(0);
  const [accountId, setAccountId] = useState('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');//bob
  const [amount_price, setAmountPrice] = useState(100);//alice

  const [accountPair, setAccountPair] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!keyring) return;
    setAccountPair(keyring.getPair(address));
  },[keyring]);

  useEffect( () => {
    if (!api || !address) return;
    let unsubscribeAll = null;
    api.query.tokenModule.balanceToken(address, (result) => {
      if (!result.isNone) {
        console.log(`Balance: ${result}`);
        setBalances(result.toJSON())
      }
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);
    return () => unsubscribeAll && unsubscribeAll();

  },[api, address]);

  useEffect(() => {
    if (!api || !address) return;
    let unsubscribeAll = null;
    api.query.tradeModule.currentRemainingBattery(address, (result) => {
      if (!result.isNone) {
        console.log(`Battery: ${result}`);
        setTotal(result.toNumber());
      }
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);
    return () => unsubscribeAll && unsubscribeAll();

  },[api, address]);

  return (
    <div className={styles.accountCard}>
      <img alt="logo" className={styles.logo} src={GroupSvg} />
      <div className={styles.accountAddress}>
        <p>账户地址</p>
        <p>{address !== undefined ? address : '15d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU'}</p>
      </div>
      <div className={styles.accountBalance}>
        <p>可用余额</p>
        <p>{balances.token_balance}</p>
      </div>
      <div className={styles.accountButtons}>
        <TxButton style={{position: 'left', bottom: '10px', right: '20px'}}
                  color='blue'
                  accountPair={accountPair}
                  label='充值'
                  type='SIGNED-TX'
                  setStatus={setStatus}
                  attrs={{
                    palletRpc: 'tokenModule',
                    callable: 'buytoken',
                    inputParams: [1000, accountId, amount_price],
                    paramFields: [true, true, true]
                  }}
        />

        <Divider orientation="center" type="vertical"/>
        <TxButton style={{position: 'right', bottom: '10px', right: '20px'}}
                  color='blue'
                  accountPair={accountPair}
                  label='提现'
                  type='SIGNED-TX'
                  setStatus={setStatus}
                  attrs={{
                    palletRpc: 'tokenModule',
                    callable: 'selltoken',
                    inputParams: [100, accountId, amount_price],
                    paramFields: [true, true, true]
                  }}
        />
      </div>
      <div className={styles.totalBalance}>
        <p>总金额</p>
        <p>{balances.token_balance + balances.token_stake + balances.token_vote}</p>
      </div>
      <div className={styles.tradeBalance}>
        <p>交易冻结</p>
        <p>{balances.token_stake}</p>
      </div>
      <div className={styles.rollBalance}>
        <p>投票冻结</p>
        <p>{balances.token_vote}</p>
      </div>
      <div className={styles.eleNum}>
        <p>当前剩余电量</p>
        <p>{`${total} 度`}</p>
      </div>
    </div>
  )
};

export default AccountCard;
