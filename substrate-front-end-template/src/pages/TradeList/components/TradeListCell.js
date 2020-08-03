import React  from 'react';
import { Row, Col, Divider, Button } from 'antd';
import styles from '../style.less';

const TradeListCell = props => {
  const { item, buyClick, sellClick } = props;

  return (
    <div className={styles.tradeListCell}>
      <Row>
        <Col span={12}>{`账户地址：${item.address}`}</Col>
        <Col span={8}>{`交易时间：${item.latest}`}</Col>
        <Col span={4}>{`成交额：${item.total}`}</Col>
      </Row>
      <br/>
      <Row>
        <Col span={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img alt="logo" width="100px" src={item.logo} />
        </Col>
        <Col span={4}>
          <div className={styles.listContent}>
            <div className={styles.listContentItem}>
              <span>{item.name}</span>
              <p>{`类型: ${item.type}`}</p>
              <span>{`邮编: ${item.code}`}</span>
              <p>{`线损: ${item.loss}`}</p>
            </div>
          </div>
        </Col>
        <Col span={4}>
          <div className={styles.listContent}>
            <div className={styles.listContentItem}>
              <span>{`可销售度数: ${item.canSell}`}</span>
              <p>{`售价: ${item.sellPrice}`}</p>
            </div>
          </div>
        </Col>
        <Col span={4}>
          <div className={styles.listContent}>
            <div className={styles.listContentItem}>
              <span>{`需购买度数: ${item.needBuy}`}</span>
              <p>{`售价: ${item.buyPrice}`}</p>
            </div>
          </div>
        </Col>
        <Col span={5}>
          <div className={styles.listContent}>
            <div className={styles.listContentItem}>
              <span>{item.status}</span>
            </div>
          </div>
        </Col>
        <Col span={5}>
          <Button type="primary" size="default" onClick={buyClick}>购买电能</Button>
          <Divider orientation="center" type="vertical"/>
          <Button type="primary" danger size="default" onClick={sellClick}>出售电能</Button>
        </Col>
      </Row>
      <Divider type="horizontal"/>
    </div>
  );
};

export default TradeListCell;
