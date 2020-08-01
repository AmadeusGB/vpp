import React, {useContext, useEffect, useState} from "react";
import {Button, Divider} from 'antd';
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import styles from "../index.less";
import GroupSvg from "../assets/group.svg";

const AccountCard = () => {
  const {account} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const [balances, setBalances] = useState({[account]: 0});

  useEffect(() => {
    if (Object.keys(api).length === 0) return;
    let unsubscribeAll = null;
    const addresses = [account];
    api.query.system.account
      .multi(addresses, balances => {
        console.log(JSON.stringify(balances));
        const balancesMap = addresses.reduce((acc, address, index) => ({
          ...acc, [address]: balances[index].data.free.toHuman()
        }), {});
        setBalances(balancesMap);
      }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);
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
        <p>0</p>
      </div>
      <div className={styles.accountButtons}>
        <Button ghost>充值</Button>
        <Divider orientation="center" type="vertical"/>
        <Button ghost>提现</Button>
      </div>
      <div className={styles.totalBalance}>
        <p>总金额</p>
        <p>{balances[account] ? balances[account] : 0}</p>
      </div>
      <div className={styles.tradeBalance}>
        <p>交易冻结</p>
        <p>0</p>
      </div>
      <div className={styles.rollBalance}>
        <p>投票冻结</p>
        <p>0</p>
      </div>
      <div className={styles.eleNum}>
        <p>当前剩余电量</p>
        <p>0 度</p>
      </div>
    </div>
  )
};

export default AccountCard;
