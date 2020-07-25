import React, {useRef, useState, useEffect} from 'react';
import {DownOutlined} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Radio,
} from 'antd';
import {findDOMNode} from 'react-dom';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'umi';
import OperationModal from './components/OperationModal';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

const ListContent = ({data: {canSell, needBuy, sellPrice, buyPrice}}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>{`可销售度数: ${canSell}`}</span>
      <p>{`售价: ${sellPrice}`}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>{`需购买度数: ${needBuy}`}</span>
      <p>{`售价: ${buyPrice}`}</p>
    </div>
  </div>
);

export const TradeList = props => {
  const addBtn = useRef(null);
  const {
    dispatch,
    tradeList: {list},
  } = props;
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [operation, setOperation] = useState(1);// 1 buy 2 sell
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

  const buyAndSell = (key, currentItem) => {
    if (key === 'buy') {
      Modal.confirm({
        title: '购买电能',
        content: '确定购买电能吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => showBuyModal(currentItem),
      });
    }
    else if (key === 'sell') {
      Modal.confirm({
        title: '出售电能',
        content: '确定出售电能吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => showSellModal(currentItem),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">营业中</RadioButton>
        <RadioButton value="waiting">歇业中</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入邮编进行搜索" onSearch={() => ({})}/>
    </div>
  );

  const MoreBtn = ({item}) => (
    <Dropdown
      overlay={
        <Menu onClick={({key}) => buyAndSell(key, item)}>
          <Menu.Item key="buy">购买电能</Menu.Item>
          <Menu.Item key="sell">出售电能</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined/>
      </a>
    </Dropdown>
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
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
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
                <List.Item
                  actions={[
                    <a
                      key="buy"
                      onClick={e => {
                        e.preventDefault();
                        showBuyModal(item);
                      }}
                    >
                      购买
                    </a>,
                    <MoreBtn key="more" item={item}/>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large"/>}
                    title={item.name}
                    description={item.address}
                  />
                  <ListContent data={item}/>
                </List.Item>
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
    </div>
  );
};
export default connect(({tradeList}) => ({
  tradeList
}))(TradeList);
