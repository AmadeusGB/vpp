import {Divider, Modal} from 'antd';
import React, {useState, useRef, useContext, useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {ApiContext} from "@/context/api";
import {AccountsContext} from "@/context/accounts";
import {TxButton} from "@/components/TxButton/TxButton";

const TableList = () => {
  const actionRef = useRef();
  const [count, setCount] = useState(0);
  const {address} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);
  const {keyring} = useContext(AccountsContext);
  const [accountPair, setAccountPair] = useState(null);
  const [status, setStatus] = useState(null);
  const [tableListDataSource, settableListDataSource] = useState([]);

  // useEffect(() => {
  //   if (!keyring) return;
  //   setAccountPair(keyring.getPair(address));
  // },[keyring]);

  useEffect(() => {
    if (!api || !address) return;

    console.log(address, count);
    api.query.contractModule.contractcounts(address, (result) => {
      if (!result.isNone) {
          setCount(result);
          console.log(result);
          console.log(address, count);
        }
    });
  },[api]);

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
                onOk: () => {window.console.log(record)},
              });
            }}
          >
            终止
          </a>,
          
          <TxButton style={{position: 'absolute', bottom: '10px', right: '20px'}}
                  color='blue'
                  accountPair={accountPair}
                  label='终止'
                  type='SIGNED-TX'
                  setStatus={setStatus}
                  attrs={{
                    palletRpc: 'contraceModule',
                    callable: 'stopcontract',
                    inputParams: [record.key],
                    paramFields: [true]
                  }}
          />]
      ),
    },
  ];

  for (let i = 0; i < count; i += 1) {
    api.query.contractModule.contracts([address, i], (result) => {
      if (!result.isNone) {
        console.log(result.toJSON());
        let jsonContract = result.toJSON();

        tableListDataSource.push({
          key: i,
          name: (jsonContract.energy_type  === 0) ? '光电合同' : ((jsonContract.energy_type  === 1)?'风能合同':'火电合同'),
          block_number: jsonContract.block_number,
          contract_type: jsonContract.contract_type,
          contract_price: jsonContract.contract_price,
          energy_amount: jsonContract.energy_amount,
          energy_type: jsonContract.energy_type,
          execution_status: jsonContract.execution_status
        });
      }
    });
  }

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
