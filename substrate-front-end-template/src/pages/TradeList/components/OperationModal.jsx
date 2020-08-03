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

const OperationModal = props => {
  const [form] = Form.useForm();
  const { done, visible, operation, onDone, onCancel, onSubmit } = props;
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

  const onGenderChange = value => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" });
        break;
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" });
        break;
      default:
        break;
    }
  };

  const modalFooter = done
    ? {
        okText: '确认',
        onOk: handleSubmit,
        onCancel,
      }
    : {
        okText: '确认',
        onOk: handleSubmit,
        onCancel,
      };

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }

    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="num"
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
            onChange={onGenderChange}
            allowClear
          >
            <Option value="type1">交流</Option>
            <Option value="type2">直流</Option>
          </Select>
        </Form.Item>
        <Form.Item name="types" label="电压类型" rules={[{ required: true }]}>
          <Select
            placeholder="请选择电压类型"
            onChange={onGenderChange}
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
          <p>{operation === 1 ? '需支付金额：¥' : '预计收益金额：¥'}</p>
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
        done
          ? {
              padding: '72px 0',
            }
          : {
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
