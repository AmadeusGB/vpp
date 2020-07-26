import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <div
      style={{
        paddingTop: 100,
        textAlign: 'center',
      }}
    >
      <Spin spinning={loading} size="large" />
    </div>
  );
};
