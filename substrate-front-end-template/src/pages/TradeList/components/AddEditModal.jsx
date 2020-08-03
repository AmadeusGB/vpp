import React, { useEffect } from 'react';
import { Modal, Result, Button, Form, Select, Input } from 'antd';
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
  const {visible, operation, onCancel } = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const onGenderChange = value => {
    // switch (value) {
    //   case "male":
    //     form.setFieldsValue({ note: "Hi, man!" });
    //     break;
    //   case "female":
    //     form.setFieldsValue({ note: "Hi, lady!" });
    //     break;
    //   default:
    //     break;
    // }
  };

  const modalFooter = {
      okText: '确认',
      onOk: handleSubmit,
      onCancel,
    };

  const getModalContent = () => {

    return (
      <Form {...formLayout} form={form}>
        <Form.Item
          name="name"
          label= "虚拟电厂名称"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入虚拟电厂名称" />
        </Form.Item>
        <Form.Item name="type" label="发电类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择发电类型"
            onChange={onGenderChange}
            allowClear
          >
            <Option value="type1">风电</Option>
            <Option value="type2">光电</Option>
            <Option value="type2">热电</Option>
            <Option value="type2">生物能电</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label= "购买价"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入购买价格" />
        </Form.Item>
        <Form.Item
          name="name"
          label= "出售价"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入出售价格" />
        </Form.Item>
        <Form.Item
          name="code"
          label= "邮编"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入邮编" />
        </Form.Item>
        <Form.Item
          name="code"
          label= "线损"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入线损" />
        </Form.Item>
        <Form.Item
          name="code"
          label= "设备编号"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入设备编号" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={operation === 1 ? '新增电厂' : `编辑电厂`}
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
