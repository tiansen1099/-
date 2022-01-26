import React, { Component } from 'react';
import { Button, Form, Input, InputNumber, Modal, Radio, Spin } from 'antd';

// 定义的可输入类型
const STRING = 'String';
const INTEGER = 'Integer';
const TEXT = 'Text';
const BOOLEAN = 'Boolean';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
// 元模型唯一标识
class AssetCreateForm extends Component {
  customCreateItem = (clazz, element, decorator) => {
    const { attributes } = clazz;
    if (attributes) {
      return attributes.map(attribute => {
        const attrCode = attribute.code;
        let { defaultValue } = attribute;
        if (element) {
          defaultValue = this.getElmntAttrValue(element, attrCode);
        }
        return (
          <Form.Item label={attribute.name}>
            {this.createInputArea(
              attrCode,
              attribute.name,
              attribute.dataType,
              100,
              attribute.mandatory,
              defaultValue,
              decorator
            )}
          </Form.Item>
        );
      });
    }
    return '';
  };

  // 获取指定的属性值
  getElmntAttrValue = (element, attrCode) => {
    if (!element) {
      return null;
    }

    let key = attrCode;

    if (key === 'code' || key === 'name') {
      return element[key];
    }
    if (key === 'description') {
      const text = element[key];
      if (typeof text === 'undefined' || text === null || text === '') {
        key = 'customDescription';
      }
      return element[key];
    }
    const { attributes } = element;
    if (attributes) {
      return attributes[key];
    }
    return null;
  };

  createInputArea = (
    attrCode,
    attrName,
    dataType,
    maxLength,
    mandatory,
    defaultValue,
    decorator
  ) => {
    let decoratorFunc = null;

    let key = attrCode;

    if (key === 'description') {
      key = 'customDescription';
    }

    if (mandatory) {
      decoratorFunc = decorator(key, {
        rules: [{ required: true, message: '请输入' + attrName + '!' }],
        initialValue: defaultValue,
      });
    } else {
      decoratorFunc = decorator(key, {
        initialValue: defaultValue,
      });
    }

    if (dataType === TEXT) {
      return decoratorFunc(<Input.TextArea maxLength={maxLength} />);
    } else if (dataType === INTEGER) {
      return decoratorFunc(<InputNumber maxLength={maxLength} />);
    } else if (dataType === BOOLEAN) {
      let initialValue = false;
      if (defaultValue === true || defaultValue === 'true') {
        initialValue = true;
      }
      return decorator(attrCode, {
        initialValue,
      })(
        <Radio.Group>
          <Radio value>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      );
    }
    return decoratorFunc(<Input maxLength={maxLength} />);
  };

  createInputDisabledArea = (
    attrCode,
    attrName,
    dataType,
    maxLength,
    mandatory,
    defaultValue,
    decorator
  ) => {
    let decoratorFunc = null;

    let key = attrCode;

    if (key === 'description') {
      key = 'customDescription';
    }

    if (mandatory) {
      decoratorFunc = decorator(key, {
        rules: [{ required: true, message: '请输入' + attrName + '!' }],
        initialValue: defaultValue,
      });
    } else {
      decoratorFunc = decorator(key, {
        initialValue: defaultValue,
      });
    }

    if (dataType === TEXT) {
      return decoratorFunc(<Input.TextArea maxLength={maxLength} />);
    } else if (dataType === INTEGER) {
      return decoratorFunc(<InputNumber maxLength={maxLength} />);
    } else if (dataType === BOOLEAN) {
      let initialValue = false;
      if (defaultValue === true || defaultValue === 'true') {
        initialValue = true;
      }
      return decorator(attrCode, {
        initialValue,
      })(
        <Radio.Group>
          <Radio value>是</Radio>
          <Radio value={false}>否</Radio>
        </Radio.Group>
      );
    }
    return decoratorFunc(<Input maxLength={maxLength} disabled />);
  };

  getCodeForm = (element, decorator) => {
    if (element && element.code) {
      return (
        <Form.Item label="编码">
          {this.createInputDisabledArea(
            'code',
            '编码',
            STRING,
            100,
            true,
            this.getElmntAttrValue(element, 'code'),
            decorator
          )}
        </Form.Item>
      );
    }

    return (
      <Form.Item label="编码">
        {this.createInputArea(
          'code',
          '编码',
          STRING,
          100,
          true,
          this.getElmntAttrValue(element, 'code'),
          decorator
        )}
      </Form.Item>
    );
  };

  assetCreate = (clazz, element, decorator) => {
    if (!clazz) {
      return '';
    }
    return (
      <Form {...formItemLayout}>
        {this.getCodeForm(element, decorator)}
        <Form.Item label="名称">
          {this.createInputArea(
            'name',
            '名称',
            STRING,
            100,
            true,
            this.getElmntAttrValue(element, 'name'),
            decorator
          )}
        </Form.Item>
        <Form.Item label="描述">
          {this.createInputArea(
            'description',
            '描述',
            TEXT,
            1000,
            false,
            this.getElmntAttrValue(element, 'description'),
            decorator
          )}
        </Form.Item>
        {this.customCreateItem(clazz, element, decorator)}
      </Form>
    );
  };

  render() {
    const { assetFormData, onCancel, onCreate, form, assetFormLoading } = this.props;
    const { getFieldDecorator } = form;
    const { clazz } = assetFormData;
    const { element } = assetFormData;
    return (
      <Modal
        visible={assetFormData.visible}
        title={assetFormData.title}
        okText="保存"
        destroyOnClose
        maskClosable={false}
        bodyStyle={{ height: '450px', overflowY: 'auto' }}
        onCancel={onCancel}
        footer={[
          <Button type="primary" onClick={onCreate} disabled={assetFormLoading}>
            确定
          </Button>,
          <Button onClick={onCancel} disabled={assetFormLoading}>
            取消
          </Button>,
        ]}
      >
        <Spin spinning={assetFormLoading}>
          {!element
            ? this.assetCreate(clazz, element, getFieldDecorator)
            : this.assetCreate(element.clazz, element, getFieldDecorator)}
        </Spin>
      </Modal>
    );
  }
}

export default AssetCreateForm;
