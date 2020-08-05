import React, {useState, useEffect, useContext} from 'react';
import {Col, Row, Button, Typography} from 'antd';
import {PageContainer} from "@ant-design/pro-layout";
import {TxButton} from "@/components/TxButton/TxButton";
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
    case 'ass':
      return '#FAD649';
    default:
      return '#E68975'
  }
};

const roleNumber = (type) => {
  switch (type) {
    case 'pu':
      return 0;
    case 'pg':
      return 1;
    case 'ps':
      return 2;
    case 'sg':
      return 3;
    case 'ass':
      return 4;
    default:
      return 5
  }
};

const IdCard = ({type, currentType, account, accountPair}) => {
  const [status, setStatus] = useState(null);

  return (
    <div style={{height: '180px', background: idColor(type), position: 'relative'}}>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <img alt="logo" className={styles.logo} src={GroupSvg} />
        <Title level={2} style={{color: '#FFF', position: 'absolute', top: '30px', right: '30px'}}>{type.toUpperCase()}</Title>
      </div>
      {
        _.indexOf(currentType,type) < 0 ? <div style={{height: '180px', width: '100%', background: 'rgba(0,0,0,.5)', position: 'absolute', top: 0, left: 0}}/> : null
      }
      <TxButton style={{position: 'absolute', bottom: '10px', right: '20px'}}
                color='blue'
                accountPair={accountPair}
                label={_.indexOf(currentType,type) < 0 ? '立即注册' : '注销'}
                type='SIGNED-TX'
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'identityModule',
                  callable: _.indexOf(currentType,type) < 0 ? 'apply' : 'logout',
                  inputParams: _.indexOf(currentType,type) < 0 ? [account, roleNumber(type)] : [roleNumber(type)],
                  paramFields: _.indexOf(currentType,type) < 0 ? [true, true] : [true]
                }}
      />
    </div>
  )
};

export default () => {
  const [roles, setRoles] = useState([]);
  const {api} = useContext(ApiContext);
  const {account} = useContext(AccountsContext);
  const {keyring} = useContext(AccountsContext);
  const [accountPair, setAccountPair] = useState(null);

  useEffect(() => {
    if (!keyring) return;
    setAccountPair(keyring.getPair(account));
    console.log(`accountPair: ${keyring.getPair(account)}`);
  },[keyring]);

  useEffect(() => {
    if (!api) return;
    api.query.identityModule.roles(account, (result) => {
      if (!result.isNone) {
        console.log(`Roles: ${result}`);
        const val = result.toJSON();
        const arr = [];
        _.forEach(val, function(value, key) {
          if (value){
            arr.push(key);
          }
        });
        setRoles(arr);
      }
    });
  }, [api]);

  return (
    <PageContainer>
      <Row>
        <Col span={15}>
          <AccountCard />
        </Col>
        <Col span={8} offset={1}>
          <AccountHistory/>
        </Col>
      </Row>
      <div style={{height: '20px', width: '100%'}}/>
      <Row>
        <Col span={4}>
          <IdCard type='pu'
                  currentType={roles}
                  account={account}
                  accountPair={accountPair}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='pg'
                  currentType={roles}
                  account={account}
                  accountPair={accountPair}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='ps'
                  currentType={roles}
                  account={account}
                  accountPair={accountPair}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='sg'
                  currentType={roles}
                  account={account}
                  accountPair={accountPair}
          />
        </Col>
        <Col span={4} offset={1}>
          <IdCard type='ass'
                  currentType={roles}
                  account={account}
                  accountPair={accountPair}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};
