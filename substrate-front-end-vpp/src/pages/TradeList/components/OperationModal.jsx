import React, {useEffect, useState} from 'react';
import { Modal, Form, Select, Input } from 'antd';
import styles from '../style.less';

const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  }
};

const OperationModal = props => {
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

  const onTypeChange = value => {
    switch (value) {
      case "0":
        form.setFieldsValue({ type: "0" });
        break;
      case "1":
        form.setFieldsValue({ type: "1" });
        break;
      default:
        break;
    }
  };

  const onType1Change = value => {
    switch (value) {
      case "0":
        form.setFieldsValue({ type1: "0" });
        break;
      case "1":
        form.setFieldsValue({ type1: "1" });
        break;
      case "2":
        form.setFieldsValue({ type1: "2" });
        break;
      case "3":
        form.setFieldsValue({ type1: "3" });
        break;
      case "4":
        form.setFieldsValue({ type1: "4" });
        break;
      default:
        break;
    }
  };

  const modalFooter = {
    okText: '确认',
    onOk: handleSubmit,
    onCancel,
  };

  const getModalContent = () => {
    const [amount, setAmount] = useState(0);

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="buy_energy_number"
          label= {operation === 1 ? "购买数量" : "出售数量"}
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入数量（度）" />
        </Form.Item>
        <Form.Item
          name="loss"
          label="线损率"
          rules={[
            {
              required: true,
              message: '请输入线损率',
            },
          ]}
        >
          <Input placeholder="请输入线损率（%）" />
        </Form.Item>
        <Form.Item name="type" label="电能类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择电能类型"
            onChange={onTypeChange}
            allowClear
          >
            <Option value="0">交流</Option>
            <Option value="1">直流</Option>
          </Select>
        </Form.Item>
        <Form.Item name="type1" label="电压类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择电压类型"
            onChange={onType1Change}
            allowClear
          >
            <Option value="0">220V</Option>
            <Option value="1">110V</Option>
            <Option value="2">36V</Option>
            <Option value="3">12V</Option>
            <Option value="4">5V</Option>
          </Select>
        </Form.Item>
        <div style={{marginLeft: '24px'}}>
          <p>{operation === 1 ? `需支付金额：¥ ${amount}` : `预计收益金额：¥ ${amount}`}</p>
        </div>
      </Form>
    );
  };

  return (
    <Modal
      title={operation === 1 ? '购买电能' : `出售电能`}
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

export default OperationModal;
