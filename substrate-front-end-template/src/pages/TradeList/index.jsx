import React, {useState, useEffect, useContext} from 'react';
import {
  Card,
  Input,
  List,
  Radio,
  Button
} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import TradeListCell from "@/pages/TradeList/components/TradeListCell";
import {AccountsContext} from "@/context/accounts";
import {ApiContext} from "@/context/api";
import OperationModal from './components/OperationModal';
import AddEditModal from "./components/AddEditModal";
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

const paginationProps = {
  showSizeChanger: true,
  showQuickJumper: true,
  pageSize: 5,
};

export const TradeList = () => {
  const [visible, setVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [operation, setOperation] = useState(1);// 1购买 2出售
  const [addEdit, setAddEdit] = useState(1);// 1新增 2编辑

  const [count, setCount] = useState();
  const [dataSource, setDataSource] = useState([]);
  const {address} = useContext(AccountsContext);
  const {api} = useContext(ApiContext);

  useEffect(() => {
    if (!api || !address) return;

    api.query.tradeModule.vppCounts(address, (result) => {
      if (!result.isNone) {
        setCount(result.toNumber());
      }
    });

  },[api]);

  const showBuyModal = (item) => {
    setVisible(true);
    setOperation(1);
  };

  const showSellModal = (item) => {
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
        setAddEdit(1);
        setVisibleModal(true);
      }}>
        新增电厂
      </Button>
    </div>
  );

  const handleCancel = () => {
    setVisibleModal(false);
  };

  const handleSubmit = values => {
    console.log(values);
    setVisibleModal(false);
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
              dataSource={dataSource}
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
        visible={visible}
        operation={operation}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
      <AddEditModal
        visible={visibleModal}
        addEdit={addEdit}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default TradeList;
