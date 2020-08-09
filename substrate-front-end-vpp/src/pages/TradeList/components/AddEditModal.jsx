import React, { useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import styles from '../style.less';

const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const AddEditModal = props => {
  const [form] = Form.useForm();
  const {visible, addEdit, onCancel, onSubmit} = props;

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

  const onEnergyChange = value => {
    switch (value) {
      case "0":
        form.setFieldsValue({ energy_type: "0" });
        break;
      case "1":
        form.setFieldsValue({ energy_type: "1" });
        break;
      case "2":
        form.setFieldsValue({ energy_type: "2" });
        break;
      default:
        break;
    }
  };

  const onElectricChange = value => {
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

  const modalFooter = {
      okText: '确认',
      onOk: handleSubmit,
      onCancel,
    };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item name="name" label= "虚拟电厂名称" rules={[{ required: true, message: "请输入"}]}>
          <Input placeholder="请输入虚拟电厂名称" />
        </Form.Item>
        <Form.Item name="energy_type" label="能源类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择能源类型"
            onChange={onEnergyChange}
            allowClear
          >
            <Option value="0">光电</Option>
            <Option value="1">风电</Option>
            <Option value="2">火电</Option>
          </Select>
        </Form.Item>
        <Form.Item name="electric_type" label="电流类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择电流类型"
            onChange={onElectricChange}
            allowClear
          >
            <Option value="0">直流</Option>
            <Option value="1">交流</Option>
          </Select>
        </Form.Item>
        <Form.Item name="pre_total_stock" label= "预售总额度" rules={[{ required: true, message: "请输入"}]}>
          <Input placeholder="请输入预售总额度" />
        </Form.Item>
        <Form.Item name="sold_total" label= "已售总额度" rules={[{ required: true, message: "请输入"}]}>
          <Input placeholder="请输入已售总额度" />
        </Form.Item>
        <Form.Item name="buy_price" label= "购买价" rules={[{required: true, message: "请输入"}]}>
          <Input placeholder="请输入购买价格" />
        </Form.Item>
        <Form.Item name="sell_price" label= "出售价" rules={[{required: true, message: "请输入"}]}>
          <Input placeholder="请输入出售价格" />
        </Form.Item>
        <Form.Item name="post_code" label= "邮编" rules={[{required: true, message: "请输入"}]}>
          <Input placeholder="请输入邮编" />
        </Form.Item>
        <Form.Item name="transport_lose" label= "线损" rules={[{required: true, message: "请输入"}]}>
          <Input placeholder="请输入线损" />
        </Form.Item>
        <Form.Item name="device_id" label= "设备编号" rules={[{required: true, message: "请输入"}]}>
          <Input placeholder="请输入设备编号" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={addEdit === 1 ? '新增电厂' : `编辑电厂`}
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

export default AddEditModal;
