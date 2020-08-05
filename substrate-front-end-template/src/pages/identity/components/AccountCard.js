import React, {useContext, useEffect, useState} from "react";
import {Button, Divider} from 'antd';
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import styles from "../index.less";
import GroupSvg from "../assets/group.svg";

const AccountCard = () => {
  const {account} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const [balances, setBalances] = useState({token_balance: 0, token_stake: 0, token_vote: 0});

  useEffect( () => {
    if (!api) return;

    api.query.tokenModule.balanceToken(account, (result) => {
      if (!result.isNone) {
        console.log(`Balance: ${result}`);
        setBalances(result.toJSON())
      }
    });

  },[api]);

  return (
    <div className={styles.accountCard}>
      <img alt="logo" className={styles.logo} src={GroupSvg} />
      <div className={styles.accountAddress}>
        <p>账户地址</p>
        <p>{account !== undefined ? account : '15d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU'}</p>
      </div>
      <div className={styles.accountBalance}>
        <p>可用余额</p>
        <p>{balances.token_balance}</p>
      </div>
      <div className={styles.accountButtons}>
        <Button ghost>充值</Button>
        <Divider orientation="center" type="vertical"/>
        <Button ghost>提现</Button>
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
        <p>0 度</p>
      </div>
    </div>
  )
};

export default AccountCard;
