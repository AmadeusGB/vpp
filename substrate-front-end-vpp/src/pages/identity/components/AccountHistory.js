import React from "react";
import styles from "../index.less";
import { List, Typography } from 'antd';

const data = [
  '2020/08/10 转入 1000',
  '2020/08/10 转出 1000',
  '2020/08/10 转入 1000',
  '2020/08/10 转出 1000',
  '2020/08/10 转入 1000',
  '2020/08/10 转出 1000',
];

const AccountHistory = () => {
  return (
    <div className={styles.accountHistory}>
      <div style={{height: '50px',fontSize: '16px', color: '#333',lineHeight: '50px', paddingLeft: '10px', borderBottom: '1px solid #f0f0f0'}}>
        交易记录
      </div>
      <div style={{height: '290px'}}>
        <List
          bordered
          dataSource={data}
          renderItem={(item,index) => (
            <List.Item>
              <Typography.Text mark>{index%2 ===0 ? '转入': '转出'}</Typography.Text> {item}
            </List.Item>
          )}
        />
      </div>
    </div>
  )
};

export default AccountHistory;
