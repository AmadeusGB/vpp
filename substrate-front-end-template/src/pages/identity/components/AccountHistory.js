import React from "react";
import styles from "../index.less";

const AccountHistory = () => {
  return (
    <div className={styles.accountHistory}>
      <div style={{height: '50px',fontSize: '16px', color: '#333',lineHeight: '50px', paddingLeft: '10px', borderBottom: '1px solid #f0f0f0'}}>
        交易记录
      </div>
    </div>
  )
};

export default AccountHistory;
