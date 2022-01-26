import React, { Fragment } from 'react';
import { Button, Checkbox, Form, Input, Modal, Select, Icon } from 'antd';

const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 20, offset: 4 },
};

@Form.create()
class GlossaryAddDialog extends React.Component {
  state = {
    id: 0,
  };

  getTitle = isEdit => {
    if (isEdit) {
      return '编辑';
    }
    return '新建';
  };

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  removeAll = () => {
    const { form } = this.props;
    form.setFieldsValue({
      keys: [],
    });
  };

  add = () => {
    const { form } = this.props;
    let { id } = this.state;
    const keys = form.getFieldValue('keys');
    if (id < keys.length) {
      id = keys.length;
    }
    const nextKeys = keys.concat(id);
    this.setState({ id: id + 1 });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { visible, onCancel, onCreate, form, isEdit, glossary } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Fragment>
        <Modal
          key="GlossaryAddDialog"
          maskClosable={false}
          bodyStyle={{ maxHeight: '450px', overflowY: 'auto' }}
          title={
            <div
              key="dialogTitle"
              style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}
            >
              {this.getTitle(isEdit)}
            </div>
          }
          centered
          visible={visible}
          onCancel={onCancel}
          onOk={onCreate}
          footer={[
            <Button key="confirmButton" type="primary" onClick={onCreate}>
              确定
            </Button>,
            <Button key="cancelButton" onClick={onCancel}>
              取消
            </Button>,
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item key="name" label="名称">
              {getFieldDecorator('name', {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: '请输入名称!' }],
                initialValue: glossary.name,
              })(<Input placeholder="请输入名称" maxLength={100} />)}
            </Form.Item>
            {/*<Form.Item key="attributeType" label="关键词">*/}
            {/*  {getFieldDecorator('attributeType', {*/}
            {/*    validateTrigger: ['onChange', 'onBlur'],*/}
            {/*    initialValue: constumAttribute.attributeType,*/}
            {/*  })(<Input placeholder="请输入关键词,以逗号分隔" maxLength={100} />)}*/}
            {/*</Form.Item>*/}
            <Form.Item key="description" style={{ marginBottom: '0px' }} label="描述">
              {getFieldDecorator('description', {
                initialValue: glossary.description,
              })(<TextArea rows={4} placeholder="请输入描述" maxLength={500} />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default GlossaryAddDialog;
