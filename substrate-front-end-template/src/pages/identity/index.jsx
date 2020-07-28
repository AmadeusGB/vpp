import React, { useState, useEffect } from 'react';
import {Col, Row, Button, Typography} from 'antd';
import {PageContainer} from "@ant-design/pro-layout";
import AccountCard from "./components/AccountCard";
import AccountHistory from "./components/AccountHistory";
import GroupSvg from './assets/group.svg';
import styles from './index.less';

const { Title } = Typography;

const idColor = (type) => {
  switch (type) {
    case 'PU':
      return '#E68975';
    case 'PG':
      return '#A0F57D';
    case 'PS':
      return '#8CC6F0';
    case 'SG':
      return '#333333';
    case 'AS':
      return '#FAD649';
    default:
      return '#E68975'
  }
};

const IdCard = ({type, text}) => {
  return (
    <div style={{height: '180px', background: idColor(type), position: 'relative'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <img alt="logo" className={styles.logo} src={GroupSvg} />
        <Title level={2} style={{color: '#FFF', position: 'absolute', top: '30px', right: '30px'}}>{type}</Title>
      </div>
      <Button type="link" style={{color: '#FFF', position: 'absolute', bottom: '10px', right: '20px'}}>
        {text}
      </Button>
    </div>
  )
};

export default () => {

  return (
    <PageContainer>
      <Row>
        <Col span={15}>
          <AccountCard/>
        </Col>
        <Col span={8} offset={1}>
          <AccountHistory/>
        </Col>
      </Row>
      <div style={{height: '20px', width: '100%'}}/>
      <Row>
        <Col span={4}>
          <IdCard type='PU'
                  text="注销"
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='PG'
                  text="申请注册"
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='PS'
                  text="申请注册"
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='SG'
                  text="申请注册"
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='AS'
                  text="申请注册"
          />
        </Col>
      </Row>
    </PageContainer>
  );
};
