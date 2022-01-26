import React, { Component } from 'react';
import { Table, Tooltip, Modal } from 'antd';
import { connect } from 'dva';

@connect(() => ({}))
class ChangeTrackSelectTable extends Component {
  state = {
    hasLoading: false,
    visible: false,
    list: [],
  };

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRef(this);
  };

  initPage = (list) => {
    this.setState({
      visible: true,
      list
    });
  };

  /**
   * 表格空数据样式
   * @returns {*}
   */
  initEmptyData = () => {
    return <span style={{ color: '#3f4b59' }}>暂无数据</span>;
  };

  getTable = () => {
    const { hasLoading, list } = this.state;
    const columns = [
      {
        title: <div>序号</div>,
        width: '50px',
        key: 'orderNo',
        onCell: () => {
          return {
            style: {
              maxWidth: '50px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: (text, record, index) => (
          <Tooltip placement='topLeft' title={index}>
            {index + 1}
          </Tooltip>
        ),
      },
      {
        title: <div>属性名称</div>,
        dataIndex: 'attributeName',
        width: '100',
        key: 'attributeName',
        onCell: () => {
          return {
            style: {
              maxWidth: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement='topLeft' title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div>修改前</div>,
        dataIndex: 'fromValue',
        width: '100',
        key: 'fromValue',
        onCell: () => {
          return {
            style: {
              maxWidth: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement='topLeft' title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div>修改后</div>,
        dataIndex: 'toValue',
        width: '100',
        key: 'toValue',
        onCell: () => {
          return {
            style: {
              maxWidth: 100,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement='topLeft' title={text}>
            {text}
          </Tooltip>
        ),
      }
    ];

    return (
      <Table
        rowKey={record => record.id}
        size='small'
        columns={columns}
        dataSource={list}
        loading={hasLoading}
        pagination={false}
        locale={{ emptyText: this.initEmptyData() }}
      />
    );
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <div>
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>
              元数据变更明细
            </div>
          }
          centered
          visible={visible}
          footer={null}
          bodyStyle={{ height: '580px', overflowY: 'auto', padding: '10px' }}
          width='75%'
          destroyOnClose
          onCancel={this.handleCancel}
        >
          <div>{this.getTable()}</div>
        </Modal>
      </div>
    );
  }
}

export default ChangeTrackSelectTable;
