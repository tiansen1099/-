import React, { Component, Fragment } from 'react';
import { Button, Col, Input, message, Modal, Row, Select, Table, Drawer, Tooltip } from 'antd';
import { connect } from 'dva';
import { formatDate } from '@/utils/Mm/mmUtils';
import styles from './assetHistory.less';

const { Option } = Select;
const { Search } = Input;

@connect(({ loading }) => ({
  tableResultLoading: loading.effects['mmAssets/getInitialElementsAndAssociations'],
}))
class AssetHistory extends Component {
  state = {
    source: '',
    target: '',
    historyAsset: {},
    drawerVisible: false,
    historyListData: [],
    compareDrawerVisible: false,
    attributeCompareResults: [],
  };

  componentWillMount() {
    const { historyListData } = this.props;
    this.setState({ historyListData });
  }

  handleTableSearch = searchValue => {
    const { historyListData } = this.props;
    const historyListDataTemp = historyListData.filter(historyAsset => {
      const historyAssetTime = formatDate(new Date(historyAsset.startTime), 'yyyy-MM-dd HH:mm:ss');
      return historyAssetTime.indexOf(searchValue) !== -1;
    });
    if (historyListDataTemp) {
      this.setState({ historyListData: historyListDataTemp });
    } else {
      this.setState({ historyListData: [] });
    }
  };

  drawerOnClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  compareDrawerOnClose = () => {
    this.setState({
      compareDrawerVisible: false,
    });
  };

  compareSourceAndTarget = () => {
    const { source, target } = this.state;
    if (!source || !target) {
      message.warn('请选择源和目标');
      return;
    }
    if (source === target) {
      message.warn('请不要选择相同的源和目标');
      return;
    }
    const { asset, dispatch } = this.props;
    dispatch({
      type: 'mmAssets/compareHistoryElements',
      payload: {
        elementId: asset.id,
        fromTime: source,
        toTime: target,
      },
    }).then(data => {
      if (data) {
        this.setState({
          attributeCompareResults: data.attributeCompareResults,
          compareDrawerVisible: true,
        });
      }
    });
  };

  getCompareTable = () => {
    const { attributeCompareResults } = this.state;
    const columns = [
      {
        title: <div className={styles.tableColumnTitle}>变化类别</div>,
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: <div className={styles.tableColumnTitle}>变化属性</div>,
        dataIndex: 'attributeName',
        key: 'attributeName',
      },
      {
        title: <div className={styles.tableColumnTitle}>源值</div>,
        dataIndex: 'fromValue',
        key: 'fromValue',
        render: text => {
          if (!text || text === '') {
            return '-';
          }
          return text;
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>目标值</div>,
        dataIndex: 'toValue',
        key: 'toValue',
        render: text => {
          if (!text || text === '') {
            return '-';
          }
          return text;
        },
      },
    ];
    if (attributeCompareResults) {
      return (
        <div>
          <div style={{ marginBottom: '10px' }}>数量（{attributeCompareResults.length}）</div>
          <Table
            tableLayout="fixed"
            rowKey={record => record.attributeName}
            size="small"
            columns={columns}
            dataSource={attributeCompareResults}
            pagination={false}
          />
        </div>
      );
    }
    return '';
  };

  onFromTimeSelectChange = value => {
    this.setState({ source: value });
  };

  onToTimeSelectChange = value => {
    this.setState({ target: value });
  };

  getFromTimeSelect = () => {
    const { timeSourceData } = this.props;
    if (timeSourceData) {
      return (
        <Select
          style={{ width: '95%' }}
          placeholder="请选择比对源"
          onChange={this.onFromTimeSelectChange}
        >
          {timeSourceData.map(timeSource => (
            <Option key={timeSource.id}>{timeSource.text}</Option>
          ))}
        </Select>
      );
    }
    return <Select style={{ width: '95%' }} placeholder="请选择匹配的元模型" />;
  };

  getToTimeSelect = () => {
    const { timeSourceData } = this.props;
    if (timeSourceData) {
      return (
        <Select
          style={{ width: '95%' }}
          placeholder="请选择比对目标"
          onChange={this.onToTimeSelectChange}
        >
          {timeSourceData.map(timeSource => (
            <Option key={timeSource.id}>{timeSource.text}</Option>
          ))}
        </Select>
      );
    }
    return <Select style={{ width: '95%' }} placeholder="请选择比对目标" />;
  };

  getHistoryList = () => {
    const { historyListData } = this.state;
    const columns = [
      {
        title: <div className={styles.tableColumnTitle}>记录编号</div>,
        dataIndex: 'startTime',
        key: '记录编号',
        render: text => {
          return formatDate(new Date(text), 'yyyy-MM-dd HH:mm:ss');
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>生效时间</div>,
        dataIndex: 'startTime',
        key: '生效时间',
        render: text => {
          return formatDate(new Date(text), 'yyyy-MM-dd HH:mm:ss');
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>失效时间</div>,
        dataIndex: 'endTime',
        key: 'endTime',
        render: text => {
          if (!text || text === '') {
            return '-';
          }
          return formatDate(new Date(text), 'yyyy-MM-dd HH:mm:ss');
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>操作</div>,
        dataIndex: 'startTime',
        key: '操作',
        render: text => <a onClick={() => this.seeInfo(text)}>查看详情</a>,
      },
    ];
    const paginationProps = {
      showQuickJumper: true,
      total: historyListData ? historyListData.length : 0,
      showTotal: (total, range) => {
        return (
          <div className={styles.totalDesc}>
            共 {total} 条 当前显示 {range[1] - range[0] + 1} 条
          </div>
        );
      },
    };
    if (historyListData) {
      return (
        <Table
          tableLayout="fixed"
          rowKey={record => record.startTime}
          size="small"
          columns={columns}
          dataSource={historyListData}
          pagination={paginationProps}
        />
      );
    }
    return '';
  };

  seeInfo = startTime => {
    const { historyListData } = this.state;
    const historyAsset = historyListData.find(
      historyAssetTemp => historyAssetTemp.startTime === startTime
    );
    if (historyAsset) {
      this.setState({ historyAsset, drawerVisible: true });
    }
  };

  initHistoryAttribute = (attributeName, attributeValue) => {
    let attributeValueTemp = attributeValue;
    if (!attributeValue || attributeValue === '') {
      attributeValueTemp = '-';
    }
    return (
      <div className={styles.attrRow}>
        <span>{attributeName}</span>：&nbsp;
        <Tooltip placement="topLeft" title={attributeValueTemp}>
          <span className={styles.attrValue}>{attributeValueTemp}</span>
        </Tooltip>
      </div>
    );
  };

  getHistoryInfo = () => {
    const { historyAsset } = this.state;
    if (historyAsset && historyAsset.startTime) {
      const { attributes, clazz } = historyAsset;
      let keys;
      if (attributes) {
        keys = Object.keys(attributes);
      } else {
        keys = [];
      }
      return (
        <div>
          {this.initHistoryAttribute('编码', historyAsset.code)}
          {this.initHistoryAttribute('名称', historyAsset.name)}
          {this.initHistoryAttribute('描述', historyAsset.description)}
          {keys.map(key => {
            const attribute = clazz.attributes.find(attributeTemp => attributeTemp.code === key);
            if (attribute) {
              return this.initHistoryAttribute(attribute.name, attributes[key]);
            }
            return '';
          })}
        </div>
      );
    }
    return '';
  };

  historyDialogOnCancel = () => {
    const { onCancel } = this.props;
    this.setState({ drawerVisible: false, compareDrawerVisible: false });
    onCancel();
  };

  render() {
    const { asset, visible } = this.props;
    const { drawerVisible, compareDrawerVisible } = this.state;
    return (
      <Fragment>
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>历史记录</div>
          }
          centered
          visible={visible}
          onCancel={this.historyDialogOnCancel}
          footer={null}
          bodyStyle={{ height: '580px', overflowY: 'auto', padding: '0px' }}
          width="75%"
          destroyOnClose
        >
          <div className={styles.assetHistoryContent}>
            <div className={styles.compareSelectContainer}>
              <Row>
                <Col span={10}>
                  <Row>
                    <Col span={4}>
                      <span className={styles.compareTitle}>比对源：&nbsp;</span>
                    </Col>
                    <Col span={20}>{this.getFromTimeSelect()}</Col>
                  </Row>
                </Col>
                <Col span={11}>
                  <Row>
                    <Col span={4}>
                      <span className={styles.compareTitle}>比对目标：&nbsp;</span>
                    </Col>
                    <Col span={20}>{this.getToTimeSelect()}</Col>
                  </Row>
                </Col>
                <Col span={3}>
                  <Button type="primary" onClick={() => this.compareSourceAndTarget()}>
                    历史比对
                  </Button>
                </Col>
              </Row>
            </div>
            <div>
              <Row>
                <Col span={16} />
                <Col span={8}>
                  <Search
                    placeholder="搜索记录编号"
                    onSearch={searchValue => {
                      this.handleTableSearch(searchValue);
                    }}
                    style={{ width: '95%' }}
                  />
                </Col>
              </Row>
            </div>
            <div className={styles.tableContainer}>{this.getHistoryList()}</div>
            <Drawer
              key={asset.id + '历史详情'}
              width={400}
              title="历史详情"
              placement="right"
              closable
              mask={false}
              onClose={this.drawerOnClose}
              visible={drawerVisible}
              hidden={compareDrawerVisible}
              getContainer={false}
              style={{ position: 'absolute' }}
              bodyStyle={{ padding: '15px', overflowY: 'auto' }}
            >
              {this.getHistoryInfo()}
            </Drawer>
            <Drawer
              key={asset.id + '历史比对'}
              width={500}
              title="历史比对结果"
              placement="right"
              closable
              mask={false}
              onClose={this.compareDrawerOnClose}
              destroyOnClose
              visible={compareDrawerVisible}
              getContainer={false}
              style={{ position: 'absolute' }}
              bodyStyle={{ padding: '15px', overflowY: 'auto' }}
              hidden={drawerVisible}
            >
              {this.getCompareTable()}
            </Drawer>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default AssetHistory;
