import React, {useRef, useState, useEffect} from 'react';
import {DownOutlined} from '@ant-design/icons';
import {
  Card,
  Input,
  List,
  Radio,
  Button
} from 'antd';
import {findDOMNode} from 'react-dom';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'umi';
import TradeListCell from "@/pages/TradeList/components/TradeListCell";
import OperationModal from './components/OperationModal';
import AddEditModal from "./components/AddEditModal";
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

export const TradeList = props => {
  const addBtn = useRef(null);
  const {
    dispatch,
    tradeList: {list},
  } = props;
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [operation, setOperation] = useState(1);// 1 buy 2 sell
  const [visibleModal, setVisibleModal] = useState(false);
  useEffect(() => {
    dispatch({
      type: 'tradeList/fetch',
      payload: {
        count: 5,
      },
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: 50,
  };

  const showBuyModal = item => {
    setVisible(true);
    setOperation(1);
  };

  const showSellModal = item => {
    setVisible(true);
    setOperation(2);
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">营业中</RadioButton>
        <RadioButton value="waiting">歇业中</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入邮编进行搜索" onSearch={() => ({})}/>
      <Button type="primary" onClick={() => {
        setVisibleModal(true);
      }}>
        新增电厂
      </Button>
    </div>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current);
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
    setVisibleModal(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
    setVisibleModal(false);
  };

  const handleSubmit = values => {
    const id = '';
    setAddBtnblur();
    setDone(true);
    dispatch({
      type: 'tradeList/submit',
      payload: {
        id,
        ...values,
      },
    });
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title=""
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <TradeListCell
                  item={item}
                  buyClick={() => {
                    showBuyModal(item);
                  }}
                  sellClick={() => {
                    showSellModal(item)
                  }}
                />
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        operation={operation}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      <AddEditModal
        visible={visibleModal}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default connect(({tradeList}) => ({
  tradeList
}))(TradeList);
