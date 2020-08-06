import { Divider } from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {ApiContext} from "@/context/api";

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

function optionClick(type,record) {
  let api = record.apiHook;
  if (!api) return;
}

const TableList = () => {
  const [count, setCount] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const actionRef = useRef();
  const {api} = useContext(ApiContext);
  console.log(`Api: ${api}`);

  useEffect(() => {
    if (!api) return;

    api.query.auditModule.proposalCount((result) => {
      if (!result.isNone) {
        setCount(result.toNumber());
      }
    });
  },[api]);

  // get data
  // "apply_addr":"5GgmNnKVdSRJqHmKttZrxWGdy5j1a6nU8oWWNKf7DffR6ssi","apply_role":2,"apply_status":0,"apply_annex":true
  useEffect(() => {
    if (!api || !count) return;
    let source = [];
    for (let i=0; i<count; i++ ) {
      api.query.auditModule.proposalInformation(i, (result) => {
        if (!result.isNone) {
          const data = result.toJSON();
          source.push({
            key: i,
            name: '申请PS角色',
            purpose: 0,
            role: 0,
            status: data.apply_status,
            annex: data.apply_annex ? 0 : 1,
            apiHook: api
          });
        }
        setDataSource(source);
      });
    }

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
