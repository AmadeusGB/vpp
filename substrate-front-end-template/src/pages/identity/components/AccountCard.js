import React from "react";
import {Button, Divider} from 'antd';
import styles from "../index.less";
import GroupSvg from "../assets/group.svg";

const AccountCard = () => {
  return (
    <div className={styles.accountCard}>
      <img alt="logo" className={styles.logo} src={GroupSvg} />
      <div className={styles.accountAddress}>
        <p>账户地址</p>
        <p>12d4X7aZVDgnGpmqrXcs6f6nphifGQLcDJEzXceTmkgwH8oU</p>
      </div>
      <div className={styles.accountBalance}>
        <p>可用余额</p>
        <p>1680</p>
      </div>
      <div className={styles.accountButtons}>
        <Button ghost>充值</Button>
        <Divider orientation="center" type="vertical"/>
        <Button ghost>提现</Button>
      </div>
      <div className={styles.totalBalance}>
        <p>总金额</p>
        <p>2000</p>
      </div>
      <div className={styles.tradeBalance}>
        <p>交易冻结</p>
        <p>100</p>
      </div>
      <div className={styles.rollBalance}>
        <p>投票冻结</p>
        <p>0</p>
      </div>
      <div className={styles.eleNum}>
        <p>当前剩余电量</p>
        <p>100 度</p>
      </div>
    </div>
  )
};

export default AccountCard;
