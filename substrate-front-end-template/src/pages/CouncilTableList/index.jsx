import { Divider } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

const columns = [
  {
    title: '提案名称',
    dataIndex: 'name',
    valueEnum: {
      0: {
        text: '申请AS角色',
        status: '0',
      },
      1: {
        text: '申请PS角色',
        status: '1',
      },
      2: {
        text: '申请SG角色',
        status: '2',
      },
    },
  },
  {
    title: '提案功能',
    dataIndex: 'councilSort',
    sorter: false,
    hideInForm: false,
    valueEnum: {
      0: {
        text: '增加调度功能',
        status: 'buy',
      },
      1: {
        text: '开通角色权限',
        status: 'sell',
      },
    },
  },
  {
    title: '提案角色',
    dataIndex: 'councilId',
    sorter: false,
    hideInForm: false,
    valueEnum: {
      0: {
        text: 'AS',
        status: 'AS',
      },
      1: {
        text: 'PG',
        status: 'PG',
      },
      2: {
        text: 'PU',
        status: 'PU',
      },
    },
  },
  {
    title: '提案状态',
    dataIndex: 'councilStatus',
    sorter: false,
    hideInForm: false,
    valueEnum: {
      0: {
        text: '待通过',
        status: 'AS',
      },
      1: {
        text: '已通过',
        status: 'PG',
      },
      2: {
        text: '已拒绝',
        status: 'PU',
      },
    },
  },
  {
    title: '附件情况',
    dataIndex: 'energyStatus',
    hideInForm: false,
    valueEnum: {
      0: {
        text: '有',
        status: '0',
      },
      1: {
        text: '无',
        status: '1',
      },
    },
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) => (
      <>
        <a
          onClick={() => {
            window.console.log(record)
          }}
        >
          同意
        </a>
        <Divider type="vertical" />
        <a
          onClick={() => {
            window.console.log(record)
          }}
        >
          拒绝
        </a>
      </>
    ),
  },
];

const dataSource = [];
for (let i = 0; i < 20; i += 1) {
  dataSource.push({
    key: i,
    name: Math.floor(Math.random() * 10) % 3,
    councilSort: Math.floor(Math.random() * 10) % 2,
    councilId: Math.floor(Math.random() * 10) % 3,
    councilStatus: Math.floor(Math.random() * 10) % 3,
    energyStatus: Math.floor(Math.random() * 10) % 2
  });
}

const TableList = () => {
  const actionRef = useRef();

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
