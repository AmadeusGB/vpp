import {Modal} from 'antd';
import React, {useState, useRef, useContext, useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {ApiContext} from "@/context/api";
import {AccountsContext} from "@/context/accounts";
import {web3FromSource} from "@polkadot/extension-dapp";
import {transformParams, txErrHandler, txResHandler} from "@/components/TxButton/utils";

const TableList = () => {
  const actionRef = useRef();
  const [count, setCount] = useState(0);
  const [tableListDataSource, setTableListDataSource] = useState([]);
  const [unsub, setUnsub] = useState(null);

  const {address,keyring} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const [accountPair, setAccountPair] = useState(null);

  // get pair
  useEffect(() => {
    if (!api && !keyring && !address) return;
    setAccountPair(keyring.getPair(address));
  },[keyring]);

  useEffect(() => {
    if (!api || !address) return;
    api.query.contractModule.contractcounts(address, (result) => {
      if (!result.isNone) {
        console.log(`合同数量：${result}`);
        setCount(result);
      }
    });
  },[api]);

  useEffect(() => {
    if (!api) return;
    const source = [];
    for (let i = 0; i < count; i += 1) {
      api.query.contractModule.contracts([address, i], (result) => {
        if (!result.isNone) {
          console.log(result.toJSON());
          const jsonContract = result.toJSON();
          source.push({
            key: i,
            name: (jsonContract.energy_type  === 0) ? '光电合同' : ((jsonContract.energy_type  === 1)?'风能合同':'火电合同'),
            block_number: jsonContract.block_number,
            contract_type: jsonContract.contract_type ? "购买" : "出售",
            contract_price: jsonContract.contract_price,
            energy_amount: jsonContract.energy_amount,
            energy_type: (jsonContract.energy_type  === 0) ? '光电' : ((jsonContract.energy_type  === 1)?'风能':'火电'),
            execution_status:(jsonContract.execution_status === 1) ? "执行中":((jsonContract.execution_status === 2) ? "已完成":"已终止")
          });
        }
      });
    }
    setTimeout(function () {
      setTableListDataSource(source);
    }, 500*count);
  }, [count]);

  const getFromAcct = async () => {
    if (!accountPair) {
      console.log('No accountPair!');
      return ;
    }

    const {
      addr,
      meta: {source, isInjected}
    } = accountPair;
    let fromAcct;

    // signer is from Polkadot-js browser extension
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromAcct = addr;
      api.setSigner(injected.signer);
    } else {
      fromAcct = accountPair;
    }

    return fromAcct;
  };

  const cancelContract = async (values) => {
    if (!api && !accountPair ) return;

    if (unsub) {
      unsub();
      setUnsub(null);
    }
    const paramFields = [true];
    const inputParams = [values.key];
    const fromAcct = await getFromAcct();
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters

    const txExecute = transformed
      ? api.tx.contraceModule.stopcontract(...transformed)
      : api.tx.contraceModule.stopcontract();

    const unsu = await txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsu);
  };

  const columns = [
    {
      title: '合同名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '请输入合同名称',
        },
      ],
    },
    {
      title: '合同区块号',
      dataIndex: 'block_number',
      valueType: 'textarea',
    },
    {
      title: '合同分类',
      dataIndex: 'contract_type',
      sorter: false,
      hideInForm: false,
      valueEnum: {
        0: {
          text: '购买',
          status: '0',
        },
        1: {
          text: '售出',
          status: '1',
        },
      },
    },
    {
      title: '合同总价',
      dataIndex: 'contract_price',
      valueType: 'textarea',
    },
    {
      title: '电能度数',
      dataIndex: 'energy_amount',
      valueType: 'textarea',
    },
    {
      title: '能源类型',
      dataIndex: 'energy_type',
      hideInForm: false,
      valueEnum: {
        0: {
          text: '光电',
          status: '0'
        },
        1: {
          text: '风电',
          status: '1'
        },
        2: {
          text: '火电',
          status: '2'
        }
      }
    },
    {
      title: '执行状态',
      dataIndex: 'execution_status',
      hideInForm: false,
      valueEnum: {
        1: {
          text: '执行中',
          status: '1'
        },
        2: {
          text: '已完成',
          status: '2'
        },
        3: {
          text: '已终止',
          status: '3'
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => ([
          <a
            onClick={() => {
              Modal.confirm({
                title: '操作提示',
                content: '是否确定终止合同？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {cancelContract(record)},
              });
            }}
          >
            终止
          </a>]
      ),
    },
  ];

  return (
    <div>
      <PageHeaderWrapper>
        <ProTable
          actionRef={actionRef}
          rowKey="key"
          columns={columns}
          dataSource={tableListDataSource}
          rowSelection={false}
        />
      </PageHeaderWrapper>
    </div>
  );
};

export default TableList;
