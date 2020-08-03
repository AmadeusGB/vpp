import React, {useState, useEffect, useContext} from 'react';
import {Col, Row, Button, Typography} from 'antd';
import {PageContainer} from "@ant-design/pro-layout";
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import _ from "lodash";
import AccountCard from "./components/AccountCard";
import AccountHistory from "./components/AccountHistory";
import GroupSvg from './assets/group.svg';
import styles from './index.less';

const { Title } = Typography;
const idColor = (type) => {
  switch (type) {
    case 'pu':
      return '#E68975';
    case 'pg':
      return '#A0F57D';
    case 'ps':
      return '#8CC6F0';
    case 'sg':
      return '#333333';
    case 'as':
      return '#FAD649';
    default:
      return '#E68975'
  }
};

const IdCard = ({type, currentType, onClick}) => {
  return (
    <div style={{height: '180px', background: idColor(type), position: 'relative'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <img alt="logo" className={styles.logo} src={GroupSvg} />
        <Title level={2} style={{color: '#FFF', position: 'absolute', top: '30px', right: '30px'}}>{type.toUpperCase()}</Title>
      </div>
      {
        currentType !== type && type !== 'pu' ? <div style={{height: '180px', width: '100%', background: 'rgba(0,0,0,.5)', position: 'absolute', top: 0, left: 0}}/> : null
      }
      <Button type="link" style={{color: '#FFF', position: 'absolute', bottom: '10px', right: '20px'}} onClick={onClick}>
        {currentType !== type && type !== 'pu' ? '立即注册' : '注销'}
      </Button>
    </div>
  )
};

export default () => {
  const [role, setRole] = useState('pu');
  const {api} = useContext(ApiContext);
  const {account} = useContext(AccountsContext);

  useEffect(() => {
    if (Object.keys(api).length === 0) return;
    api.query.identityModule.roles(account, (result) => {
      if (result.isNone) {// PU
        setRole('pu')
      } else {
        const roles = result.value.toJSON();
        _.forEach(roles, function(value, key) {
          if (value){
            setRole(key)
          }
        });
      }
    })
  }, [api]);

  function applyRole(type) {
    console.log(type)
  }

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
          <IdCard type='pu'
                  currentType={role}
                  onClick={applyRole('pu')}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='pg'
                  currentType={role}
                  onClick={applyRole('pg')}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='ps'
                  currentType={role}
                  onClick={applyRole('ps')}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='sg'
                  currentType={role}
                  onClick={applyRole('sg')}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='as'
                  currentType={role}
                  onClick={applyRole('as')}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};
