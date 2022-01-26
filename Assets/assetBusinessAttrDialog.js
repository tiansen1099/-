import React, { Fragment } from 'react';
import { Button, Switch, Form, Input, Modal, Select, Icon } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 18, offset: 6 },
};

@Form.create({ name: 'business_create_and_edit_modal' })
class AssetBusinessAttrDialog extends React.Component {
  state = {
    id: 0,
  };

  /**
   * 移除枚举值
   * @param k
   */
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

  /**
   * 移除所有枚举值
   */
  removeAll = () => {
    const { form } = this.props;
    form.setFieldsValue({
      keys: [],
    });
  };

  /**
   * 添加枚举值
   */
  add = () => {
    const { form } = this.props;
    const { id } = this.state;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id);
    this.setState({ id: id + 1 });
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  /**
   * 属性名称选择变化事件
   * @param value
   */
  handleSelectChange = value => {
    const { form, businessAttributes } = this.props;
    form.setFieldsValue({
      businessAttrId: value,
    });
    const businessAttribute = businessAttributes.find(
      businessAttributeTemp => businessAttributeTemp.id === value
    );
    if (businessAttribute.attributeType === 'Enum') {
      const attrValues = businessAttribute.valueRange.split(',');
      form.setFieldsValue({
        attrValues,
      });
    }
    form.setFieldsValue({
      attrType: businessAttribute.attributeType,
    });
    form.setFieldsValue({
      attrName: businessAttribute.name,
    });
    form.setFieldsValue({
      attrDesc: businessAttribute.description,
    });
  };

  /**
   * 属性类型变化事件
   * @param value
   */
  handleTypeSelectChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      attributeType: value,
    });
    form.setFieldsValue({
      attrType: value,
    });
    if (value === 'Enum') {
      this.add();
    } else {
      this.removeAll();
    }
    form.setFieldsValue({
      elmntAttrValue: '',
    });
  };

  /**
   * 属性值变化事件
   * @param value
   */
  elmntAttrValueChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      elmntAttrValue: value,
    });
  };

  /**
   * 获取属性值表单
   * @returns {string|*}
   */
  attrValueFromItem = () => {
    const { form, isEdit } = this.props;
    let { elmntBusiness } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const attrType = getFieldValue('attrType');
    const attrValues = getFieldValue('attrValues');
    const keys = getFieldValue('keys');
    const values = getFieldValue('values');
    if (!isEdit) {
      elmntBusiness = {};
    }
    if (attrType) {
      if (attrType === 'Enum') {
        if (attrValues && attrValues.length > 0) {
          return (
            <Form.Item key="elmntAttrValue" label="属性值">
              {getFieldDecorator('elmntAttrValue', {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: '请选择属性值!' }],
                initialValue: elmntBusiness.elmntAttrValue
                  ? elmntBusiness.elmntAttrValue.split(',')
                  : elmntBusiness.elmntAttrValue,
              })(
                <Fragment>
                  <Select
                    mode="multiple"
                    placeholder="请选择属性值"
                    onChange={this.elmntAttrValueChange}
                    defaultValue={
                      elmntBusiness.elmntAttrValue
                        ? elmntBusiness.elmntAttrValue.split(',')
                        : elmntBusiness.elmntAttrValue
                    }
                  >
                    {attrValues.map(attrValue => {
                      return (
                        <Option key={attrValue} value={attrValue}>
                          {attrValue}
                        </Option>
                      );
                    })}
                  </Select>
                </Fragment>
              )}
            </Form.Item>
          );
        }
        if (keys && keys.length > 0) {
          return (
            <Form.Item key="elmntAttrValue" label="属性值">
              {getFieldDecorator('elmntAttrValue', {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: '请选择属性值!' }],
                initialValue: elmntBusiness.elmntAttrValue
                  ? elmntBusiness.elmntAttrValue.split(',')
                  : elmntBusiness.elmntAttrValue,
              })(
                <Fragment>
                  <Select
                    mode="multiple"
                    placeholder="请选择属性值"
                    onChange={this.elmntAttrValueChange}
                    defaultValue={
                      elmntBusiness.elmntAttrValue
                        ? elmntBusiness.elmntAttrValue.split(',')
                        : elmntBusiness.elmntAttrValue
                    }
                  >
                    {keys.map(key => {
                      return (
                        <Option key={values[key]} value={values[key]}>
                          {values[key]}
                        </Option>
                      );
                    })}
                  </Select>
                </Fragment>
              )}
            </Form.Item>
          );
        }
        return '';
      }
      return (
        <Form.Item key="elmntAttrValue" label="属性值">
          {getFieldDecorator('elmntAttrValue', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{ required: true, message: '请输入属性值!' }],
            initialValue: elmntBusiness.elmntAttrValue,
          })(<Input placeholder="请输入属性值" maxLength={500} />)}
        </Form.Item>
      );
    }
    return '';
  };

  /**
   * 新建业务属性事件
   */
  addBusinessAttribute = () => {
    const { form } = this.props;
    form.setFieldsValue({
      andBusinessTag: true,
    });
    form.setFieldsValue({
      attrType: '',
    });
    form.setFieldsValue({
      attrValues: [],
    });
  };

  /**
   * 获取属性名称表单
   * @returns {*}
   */
  getAttrNameForm = () => {
    const { form, isEdit, businessAttributes } = this.props;
    let { elmntBusiness } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    if (!isEdit) {
      elmntBusiness = {};
    }
    if (isEdit && elmntBusiness) {
      return (
        <Form.Item key="name" label="属性名称">
          {getFieldDecorator('name', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{ required: true, message: '请输入属性名称!' }],
            initialValue: elmntBusiness.attrName,
          })(<Input placeholder="请输入属性名称" disabled />)}
        </Form.Item>
      );
    }
    const andBusinessTag = getFieldValue('andBusinessTag');
    if (andBusinessTag) {
      return (
        <Form.Item key="name" label="属性名称">
          {getFieldDecorator('name', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{ required: true, message: '请输入属性名称!' }],
          })(<Input placeholder="请输入属性名称" />)}
        </Form.Item>
      );
    }
    return (
      <Form.Item key="businessAttrId" label="属性名称">
        {getFieldDecorator('businessAttrId', {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{ required: true, message: '请选择属性名称!' }],
          initialValue: null,
        })(
          <Fragment>
            <Select
              showSearch
              placeholder="请选择属性名称"
              optionFilterProp="children"
              onChange={this.handleSelectChange}
              style={{ width: '65%', marginRight: '10px' }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {businessAttributes.map(businessAttribute => {
                return (
                  <Option key={businessAttribute.id} value={businessAttribute.id}>
                    {businessAttribute.name}
                  </Option>
                );
              })}
            </Select>
            <a onClick={() => this.addBusinessAttribute()}>新建业务属性</a>
          </Fragment>
        )}
      </Form.Item>
    );
  };

  /**
   * 获取业务术语表单
   * @returns {string|*}
   */
  getBusinessAttrForm = () => {
    const { isEdit } = this.props;
    if (!isEdit) {
      const { form } = this.props;
      const { getFieldDecorator, getFieldValue } = form;
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => (
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '枚举值' : ''}
          required={false}
          key={k + 'item'}
        >
          {getFieldDecorator(`values[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                message: '请输入枚举值或删除该值域.',
              },
            ],
          })(
            <Input
              key={k + 'input'}
              placeholder="请输入枚举值"
              style={{ width: '80%', marginRight: 8 }}
            />
          )}
          {keys.length > 0 ? (
            <Icon
              key={k + 'plus-square'}
              type="plus-square"
              style={{ fontSize: '18px', marginRight: '6px' }}
              onClick={() => this.add()}
            />
          ) : null}
          {keys.length > 1 ? (
            <Icon
              key={k + 'minus-square'}
              style={{ fontSize: '18px' }}
              type="minus-square"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      ));
      const andBusinessTag = getFieldValue('andBusinessTag');
      if (andBusinessTag) {
        return (
          <Fragment>
            <Form.Item key="attributeType" label="属性类型">
              {getFieldDecorator('attributeType', {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: '请选择属性类型!' }],
              })(
                <Select placeholder="请选择属性类型" onChange={this.handleTypeSelectChange}>
                  <Option key="String" value="String">
                    字符串
                  </Option>
                  <Option key="Enum" value="Enum">
                    枚举
                  </Option>
                </Select>
              )}
            </Form.Item>
            {formItems}
          </Fragment>
        );
      }
      return '';
    }
    return '';
  };

  /**
   * 获取是否应用于下级表单
   * @returns {*}
   */
  getApplyOwnedAssetsForm = () => {
    const { form, isEdit } = this.props;
    let { elmntBusiness } = this.props;
    const { getFieldDecorator } = form;
    if (!isEdit) {
      elmntBusiness = {};
    }
    return (
      <Form.Item key="applyOwnedElmnts" label="用于下级">
        {getFieldDecorator('applyOwnedElmnts', {
          valuePropName: 'checked',
          rules: [{ required: false, message: '请选择是否用于下级!' }],
          initialValue: elmntBusiness.applyOwnedElmnts,
        })(<Switch />)}
      </Form.Item>
    );
  };

  /**
   * 获取属性描述表单
   * @returns {string|*}
   */
  getBusinessAttrDesc = () => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const andBusinessTag = getFieldValue('andBusinessTag');
    if (andBusinessTag) {
      return (
        <Form.Item key="description" label="属性描述">
          {getFieldDecorator('description', {})(<TextArea rows={4} placeholder="请输入属性描述" />)}
        </Form.Item>
      );
    }
    return '';
  };

  getOrderNumForm = () => {
    const { form, isEdit } = this.props;
    let { elmntBusiness } = this.props;
    const { getFieldDecorator } = form;
    if (!isEdit) {
      elmntBusiness = {};
    }
    return (
      <Form.Item key="orderNum" label="排序序号">
        {getFieldDecorator('orderNum', {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            { required: true, pattern: /^-?[0-9]*(\.[0-9]*)?$/, message: '请输入数字排序序号!' },
          ],
          initialValue: elmntBusiness.orderNum,
        })(<Input placeholder="请输入排序序号" maxLength={10} />)}
      </Form.Item>
    );
  };

  render() {
    const {
      visible,
      onCancel,
      onCreate,
      form,
      isEdit,
      elmntBusiness,
      businessAttribute,
    } = this.props;
    const { getFieldDecorator } = form;
    if (isEdit && elmntBusiness) {
      if (elmntBusiness.attrType === 'Enum') {
        if (businessAttribute && businessAttribute.attributeType === 'Enum') {
          const attrValues = businessAttribute.valueRange.split(',');
          getFieldDecorator('attrValues', { initialValue: attrValues });
        }
      }
      getFieldDecorator('businessAttrId', { initialValue: elmntBusiness.businessAttrId });
      getFieldDecorator('attrType', { initialValue: elmntBusiness.attrType });
      getFieldDecorator('attrName', { initialValue: elmntBusiness.attrName });
      getFieldDecorator('attrDesc', { initialValue: elmntBusiness.attrDesc });
      if (elmntBusiness.elmntAttrValue) {
        getFieldDecorator('elmntAttrValue', {
          initialValue: elmntBusiness.elmntAttrValue.split(','),
        });
      } else {
        getFieldDecorator('elmntAttrValue', { initialValue: '' });
      }
    } else {
      getFieldDecorator('attrType', { initialValue: '' });
      getFieldDecorator('attrValues', { initialValue: [] });
      getFieldDecorator('attrName', { initialValue: '' });
      getFieldDecorator('attrDesc', { initialValue: '' });
      getFieldDecorator('andBusinessTag', { initialValue: false });
      getFieldDecorator('keys', { initialValue: [] });
      getFieldDecorator('elmntAttrValue', { initialValue: '' });
    }
    return (
      <Fragment>
        <Modal
          key="addAttributeDialog"
          maskClosable={false}
          bodyStyle={{ maxHeight: '450px', overflowY: 'auto' }}
          title={
            <div
              key="dialogTitle"
              style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}
            >
              配置业务属性
            </div>
          }
          centered
          visible={visible}
          onCancel={onCancel}
          onOk={onCreate}
          destroyOnClose
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
            {this.getAttrNameForm()}
            {this.getBusinessAttrForm()}
            {this.getBusinessAttrDesc()}
            {this.attrValueFromItem()}
            {this.getApplyOwnedAssetsForm()}
            {this.getOrderNumForm()}
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default AssetBusinessAttrDialog;
