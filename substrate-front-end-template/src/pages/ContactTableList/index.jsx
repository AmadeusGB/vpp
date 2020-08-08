import {Divider, Modal} from 'antd';
import React, {useState, useRef, useContext, useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {ApiContext} from "@/context/api";
import {AccountsContext} from "@/context/accounts";

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
    render: (_, record) => (
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
        </a>
    ),
  },
];

const tableListDataSource = [];
for (let i = 0; i < 1; i += 1) {
  tableListDataSource.push({
    key: i,
    name: (i % 2 === 0) ? '光电合同' : '风能合同',
    block_number: i+1000,
    contract_type: Math.floor(Math.random() * 10) % 2,
    contract_price: i+100,
    energy_amount: i+2000,
    energy_type: Math.floor(Math.random() * 10) % 3,
    execution_status: Math.floor(Math.random() * 10) % 3 + 1,
  });
}

const TableList = () => {
  const actionRef = useRef();
  const [count, setCount] = useState(0);
  const {address} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);

  useEffect(() => {
    if (!api || !address) return;

    api.query.contractModule.contractcounts(address, (result) => {
      console.log(result.toNumber());
      if (!result.isNone) {
        setCount(result);
      }
    });
  },[api]);

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
