import React, {useEffect} from 'react';
import { Modal, Form, Input } from 'antd';
import styles from '../../TradeList/style.less';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  }
};

const TokenTradeModal = props => {
  const [form] = Form.useForm();
  const { visible, operation, onCancel, onSubmit } = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = values => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const modalFooter = {
    okText: '确认',
    onOk: handleSubmit,
    onCancel,
  };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish} onValuesChange={(changedValues , allValues) => {
        if (changedValues.buy_token) {
          form.setFieldsValue({ amount_price: changedValues.buy_token });
        }
      }}>
        <Form.Item
          name="buy_token"
          label= {operation === 1 ? "兑换数量" : "提现数量"}
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入数量" />
        </Form.Item>
        <Form.Item
          name="amount_price"
          label= {operation === 1 ? "支付金额" : "实际提现"}
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入数量" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={operation === 1 ? '充值提示' : `提现提示`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={
        {
          padding: '28px 0 0',
        }
      }
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default TokenTradeModal;
