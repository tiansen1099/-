import React, { Component } from 'react';
import { Input, Form } from 'antd';

const EditableContext = React.createContext();

/**
 * 可编辑单元格组件：目前使用范围：元数据库-自定义描述
 */
@Form.create()
class EditableCell extends Component {
  /**
   * 控制是否显示可编辑单元格的参数
   */
  state = {
    editing: false,
  };

  /**
   * 单元格点击事件
   */
  toggleEdit = () => {
    let { editing } = this.state;
    editing = !editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  /**
   * 新增方法
   * @param e
   */
  save = e => {
    const { record, handleSave, form } = this.props;
    form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  /**
   * 封装可编辑单元格
   * @returns {JSX.Element}
   */
  renderCell = () => {
    const { form } = this.props;
    this.form = form;
    const { dataIndex, record } = this.props;
    const { editing } = this.state;

    let textView = record[dataIndex];
    /**
     * 判断参数是否为空，为空则显示<->
     */
    if (!textView) {
      textView = '-';
    }

    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
        })(
          <Input
            ref={node => {
              this.input = node;
            }}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {textView}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default EditableCell;
