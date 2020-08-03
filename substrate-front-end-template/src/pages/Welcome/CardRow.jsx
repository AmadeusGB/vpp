import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import styles from './style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const InfoCard = ({ num, title, icon, start, end }) => (
  <div>
    <div />
  </div>
);

const CardRow = ({ loading, visitData }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <InfoCard />
    </Col>
    <Col {...topColResponsiveProps}>
      <InfoCard />
    </Col>
    <Col {...topColResponsiveProps}>
      <InfoCard />
    </Col>
    <Col {...topColResponsiveProps}>
      <InfoCard />
    </Col>
  </Row>
);

export default CardRow;
