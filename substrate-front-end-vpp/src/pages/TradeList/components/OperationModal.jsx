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
  const [amount, setAmount] = useState(0);
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

  const onElecTypeChange = value => {
    switch (value) {
      case "0":
        form.setFieldsValue({ electric_type: "0" });
        break;
      case "1":
        form.setFieldsValue({ electric_type: "1" });
        break;
      default:
        break;
    }
  };

  const onTypeChange = value => {
    switch (value) {
      case "220":
        form.setFieldsValue({ type: "220" });
        break;
      case "110":
        form.setFieldsValue({ type: "110" });
        break;
      case "36":
        form.setFieldsValue({ type: "36" });
        break;
      case "12":
        form.setFieldsValue({ type: "12" });
        break;
      case "5":
        form.setFieldsValue({ type: "4" });
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
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish} onFieldsChange={(changedFields, allFields) => {
        if (changedFields.length > 0 && changedFields[0].name[0] === 'buy_energy_number') {
          setAmount(changedFields[0].value)
        }
      }}>
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
        <Form.Item name="electric_type" label="电流类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择电能类型"
            onChange={onElecTypeChange}
            allowClear
          >
            <Option value="0">交流</Option>
            <Option value="1">直流</Option>
          </Select>
        </Form.Item>
        <Form.Item name="type" label="电压类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择电压类型"
            onChange={onTypeChange}
            allowClear
          >
            <Option value="220">220V</Option>
            <Option value="110">110V</Option>
            <Option value="36">36V</Option>
            <Option value="12">12V</Option>
            <Option value="5">5V</Option>
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
