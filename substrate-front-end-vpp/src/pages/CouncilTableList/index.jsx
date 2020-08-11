import {Divider, message} from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {ApiContext} from "@/context/api";
import {AccountsContext} from "@/context/accounts";
import {transformParams,txResHandler,txErrHandler} from "@/components/TxButton/utils";
import {web3Accounts, web3Enable, web3FromSource} from "@polkadot/extension-dapp";
import config from "@/config";

const columns = [
  {
    title: '提案名称',
    dataIndex: 'name',
    sorter: false,
    valueEnum: {
      0: {
        text: '申请PU角色',
        status: '0',
      },
      1: {
        text: '申请PG角色',
        status: '1',
      },
      2: {
        text: '申请PS角色',
        status: '2',
      },
      3: {
        text: '申请SG角色',
        status: '3',
      },
      4: {
        text: '申请ASS角色',
        status: '4',
      }
    }
  },
  {
    title: '提案功能',
    dataIndex: 'purpose',
    sorter: false,
    valueEnum: {
      0: {
        text: '开通角色权限',
        status: '0',
      }
    }
  },
  {
    title: '申请角色',
    dataIndex: 'role',
    sorter: false,
    valueEnum: {
      0: {
        text: 'PU',
        status: '0',
      }
    }
  },
  {
    title: '提案状态',
    dataIndex: 'status',
    sorter: false,
    hideInForm: false,
    valueEnum: {
      0: {
        text: '待通过',
        status: '0',
      },
      1: {
        text: '已通过',
        status: '1',
      },
      2: {
        text: '已拒绝',
        status: '2',
      }
    }
  },
  {
    title: '附件情况',
    dataIndex: 'annex',
    hideInForm: false,
    valueEnum: {
      0: {
        text: '有',
        status: '0',
      },
      1: {
        text: '无',
        status: '1',
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) => (
      <>
        <a
          onClick={() => {
            optionClick(1,record)
          }}
        >
          同意
        </a>
        <Divider type="vertical" />
        <a
          onClick={() => {
            optionClick(2,record)
          }}
        >
          拒绝
        </a>
      </>
    ),
  },
];

const getFromAcct = async (api,pair) => {
  if (!pair) {
    console.log('No accountPair!');
    return ;
  }
  const {
    addr,
    meta: {source, isInjected}
  } = pair;
  let fromAcct;

  // signer is from Polkadot-js browser extension
  if (isInjected) {
    const injected = await web3FromSource(source);
    fromAcct = addr;
    api.setSigner(injected.signer);
  } else {
    fromAcct = pair;
  }

  // eslint-disable-next-line consistent-return
  return fromAcct;
};

async function optionClick(type,record) {
  const api = record.apiHook;
  const accountPair = record.pairHook;
  if (!api && !accountPair ) return;
  console.log(record);

  const fromAcct = await getFromAcct(api,accountPair);
  const param = transformParams([true],['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY']);
  await api.tx.parliamentModule.forceAddMember(...param).signAndSend(fromAcct,({status}) => {
    if (status.isFinalized) {
      try {
        (async () => {
          const params = transformParams([true, true],[record.key, Number(type)]);
          await api.tx.auditModule.setproposalrole(...params).signAndSend(fromAcct, txResHandler).catch(txErrHandler);
        })()
      } catch (error) {
        console.log(error)
      }
    } else {
      message.info(`Current transaction status: ${status.type}`);
    }
  }).catch(txErrHandler);
}

const roleName = (type) => {
  switch (type) {
    case 0:
      return 'PU';
    case 1:
      return 'PG';
    case 2:
      return 'PS';
    case 3:
      return 'SG';
    case 4:
      return 'ASS';
    default:
      return 'PU'
  }
};

const TableList = () => {
  const [count, setCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const actionRef = useRef();
  const {api} = useContext(ApiContext);
  const {address,keyring} = useContext(AccountsContext);
  const [accountPair, setAccountPair] = useState(null);

  useEffect(() => {
    if (!keyring && !address) return;
    setAccountPair(keyring.getPair('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'));// Alice
  },[keyring]);

  useEffect(() => {
    if (!api) return;
    api.query.auditModule.proposalCount((result) => {
      if (!result.isNone) {
        console.log(`提案数量：${result.toNumber()}`);
        setCount(result.toNumber());
      }
    });
  },[api]);

  useEffect(() => {
    if (!api || !count) return;
    const source = [];
    for (let i=0; i<count; i++ ) {
      api.query.auditModule.proposalInformation(i, (result) => {
        if (!result.isNone) {
          const data = result.toJSON();
          source.push({
            key: i,
            name: `申请${roleName(data.apply_role)}角色`,// 0:pu, 1:pg，2:ps，3:sg，4:ass
            purpose: 0,
            role: roleName(data.apply_role),
            status: data.apply_status,
            annex: data.apply_annex ? 0 : 1,
            apiHook: api,
            pairHook: accountPair
          });
        }
      });
    }
    setTimeout(function () {
      setDataSource(source);
    }, 500*count);
  }, [count, api]);

  return (
    <div>
      <PageHeaderWrapper>
        <ProTable
          actionRef={actionRef}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          rowSelection={false}
        />
      </PageHeaderWrapper>
    </div>
  );
};

export default TableList;
