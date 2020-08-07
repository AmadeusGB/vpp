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
    dataIndex: 'blockNum',
    valueType: 'textarea',
  },
  {
    title: '合同分类',
    dataIndex: 'blockSort',
    sorter: false,
    hideInForm: false,
    valueEnum: {
      0: {
        text: '购买',
        status: 'buy',
      },
      1: {
        text: '售出',
        status: 'sell',
      },
    },
  },
  {
    title: '合同总价',
    dataIndex: 'contactTotal',
    valueType: 'textarea',
  },
  {
    title: '电能度数',
    dataIndex: 'energyNum',
    valueType: 'textarea',
  },
  {
    title: '能源类型',
    dataIndex: 'energyStatus',
    hideInForm: false,
    valueEnum: {
      0: {
        text: '光电',
        status: 'lightEnergy',
      },
      1: {
        text: '风电',
        status: 'windEnergy',
      },
    },
  },
  {
    title: '执行状态',
    dataIndex: 'execStatus',
    hideInForm: false,
    valueEnum: {
      0: {
        text: '执行中',
        status: 'Default',
      },
      1: {
        text: '已完成',
        status: 'AlreadyDone',
      },
      2: {
        text: '已终止',
        status: 'AlreadyStop',
      },
    },
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
for (let i = 0; i < 20; i += 1) {
  tableListDataSource.push({
    key: i,
    name: (i % 2 === 0) ? '光电合同' : '风能合同',
    blockNum: i+1000,
    blockSort: Math.floor(Math.random() * 10) % 2,
    contactTotal: i+100,
    energyNum: i+2000,
    energyStatus: Math.floor(Math.random() * 10) % 2,
    execStatus: Math.floor(Math.random() * 10) % 3,
  });
}

const TableList = () => {
  const actionRef = useRef();
  const [count, setCount] = useState(0);
  const {address} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);

  useEffect(() => {
    if (!api) return;

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
