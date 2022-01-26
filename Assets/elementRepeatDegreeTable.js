import React, { Component } from 'react';
import { Table, Tooltip, Button } from 'antd';
import { connect } from 'dva';
import ElementRepeatInfo from '@/pages/Mm/Assets/elementRepeatInfo';

@connect(() => ({}))
class ElementRepeatDegreeTable extends Component {
  state = {
    hasLoading: false,
    list: [],
  };

  componentDidMount() {
    this.getElementRepeatDegreeByElementId();
  }

  /**
   * 资产点击事件
   * @param asset
   */
  assetOnClick = asset => {
    const { addTab } = this.props;
    const pane = { title: asset.name, type: 'AssetMainPage', key: asset.id, tab: '1' };
    if (addTab) {
      addTab(pane);
    }
  };

  /**
   * 表格空数据样式
   * @returns {*}
   */
  initEmptyData = () => {
    return <span style={{ color: '#3f4b59' }}>暂无数据</span>;
  };

  getElementRepeatDegreeByElementId = () => {
    this.setState({ hasLoading: true });
    const { dispatch, element } = this.props;
    dispatch({
      type: 'mmAssets/getElementRepeatDegreeByElementId',
      payload: {
        elementId: element.id,
      },
    }).then(result => {
      if (result) {
        this.setState({ hasLoading: false, list: result });
      } else {
        this.setState({ hasLoading: false });
      }
    });
  };

  downloadElementRepeatDegreeByElementId = () => {
    const { dispatch, element } = this.props;

    dispatch({
      type: 'mmAssets/downloadElementRepeatDegreeByElementId',
      payload: {
        elementId: element.id,
      },
      callback: blob => {
        const fileName = '元数据重复度分析_' + element.name + '.xls';
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');
          const evt = document.createEvent('MouseEvents');
          link.style.display = 'none';
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link); // 此写法兼容可火狐浏览器
          evt.initEvent('click', false, false);
          link.dispatchEvent(evt);
          document.body.removeChild(link);
        }
        this.state.targetKeys = [];
        const { hideModal } = this.props;
        hideModal();
      },
    });
  };

  getTableByType = () => {
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
          <Tooltip placement="topLeft" title={index}>
            {index + 1}
          </Tooltip>
        ),
      },
      {
        title: <div>重复元数据编码</div>,
        dataIndex: 'elementRepeatCode',
        width: '100',
        key: 'elementRepeatCode',
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
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div>重复元数据名称</div>,
        dataIndex: 'elementRepeatName',
        width: '100',
        key: 'elementRepeatName',
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
        render: (text, record) => {
          const asset = {
            id: record.elementRepeatId,
            name: record.elementRepeatName,
          };
          return <a onClick={() => this.assetOnClick(asset)}>{text}</a>;
        },
      },
      {
        title: <div>重复元数据路径</div>,
        dataIndex: 'elementRepeatNamePath',
        width: '200',
        key: 'elementRepeatNamePath',
        onCell: () => {
          return {
            style: {
              maxWidth: 200,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div>重复度</div>,
        dataIndex: 'repeatDegree',
        width: '100px',
        key: 'repeatDegree',
        onCell: () => {
          return {
            style: {
              maxWidth: '100px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement="topLeft" title={text + '%'}>
            {text}%
          </Tooltip>
        ),
      },
      {
        title: <div>操作</div>,
        width: '120px',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <Tooltip placement="topLeft" title="操作">
                <a onClick={() => this.showContrastOnClick(record.elementRepeatId)}>详细</a>
              </Tooltip>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <div>
          <Button
            type="primary"
            icon="download"
            style={{ 'margin-bottom': '10px', display: 'none' }}
            onClick={() => this.downloadElementRepeatDegreeByElementId()}
          >
            导出
          </Button>
        </div>
        <Table
          rowKey={record => record.id}
          size="small"
          columns={columns}
          dataSource={list}
          loading={hasLoading}
          pagination={false}
          locale={{ emptyText: this.initEmptyData() }}
        />
      </div>
    );
  };

  getContrastDialog = () => {
    const { element } = this.props;
    if (element) {
      return <ElementRepeatInfo onRef={this.onRef} elementName={element.name} />;
    }
    return '';
  };

  onRef = ref => {
    this.child = ref;
  };

  showContrastOnClick = toElementId => {
    const { element } = this.props;
    this.child.initPage(element.id, toElementId);
  };

  render() {
    return (
      <div>
        <div>{this.getTableByType()}</div>
        {this.getContrastDialog()}
      </div>
    );
  }
}

export default ElementRepeatDegreeTable;
