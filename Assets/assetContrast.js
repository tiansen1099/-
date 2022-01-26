import React, { Component, Fragment } from 'react';
import { Button, Col, message, Modal, Row, Table } from 'antd';
import { connect } from 'dva';
import AssetContrastTreeSelect from '@/pages/Mm/Assets/assetContrastTreeSelect';
import styles from './assetHistory.less';

@connect(({ loading }) => ({
  tableResultLoading: loading.effects['mmAssets/getInitialElementsAndAssociations'],
}))
class AssetHistory extends Component {
  state = {
    toElementId: '',
    attributeCompareResults: [],
  };

  componentWillMount() {}

  componentDidMount() {
    this.setState({
      toElementId: '',
      attributeCompareResults: [],
    });
  }

  compareSourceAndTarget = () => {
    const { toElementId } = this.state;
    if (!toElementId) {
      message.warn('请选择目标元数据');
      return;
    }

    const { asset, dispatch } = this.props;
    if (toElementId === asset.id) {
      message.warn('请不要选择相同的源和目标');
      return;
    }
    dispatch({
      type: 'mmAssets/compareElements',
      payload: {
        fromElementId: asset.id,
        toElementId,
      },
    }).then(data => {
      if (data) {
        this.setState({
          attributeCompareResults: data.attributeCompareResults,
        });
      }
    });
  };

  getCompareTable = () => {
    const { attributeCompareResults } = this.state;
    const columns = [
      {
        title: <div className={styles.tableColumnTitle}>差异属性</div>,
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
    return (
      <div>
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
  };

  onToElementSelectChange = value => {
    this.setState({ toElementId: value });
  };

  historyDialogOnCancel = () => {
    this.setState({
      toElementId: '',
      attributeCompareResults: [],
    });
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { visible, asset } = this.props;
    return (
      <Fragment>
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>
              实体差异分析
            </div>
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
              <span style={{ float:'left' }} className={styles.compareTitle}>源元数据：&nbsp;{asset.name}</span>
              <span style={{ float:'left' }} className={styles.compareTitle}>目标元数据：&nbsp;</span>
              <div style={{ float:'left', width:'360px' }}>
                <AssetContrastTreeSelect onChange={this.onToElementSelectChange} />
              </div>
              <Button type="primary" style={{ float:'left','margin-left':'10px' }} onClick={() => this.compareSourceAndTarget()}>
                比对
              </Button>
            </div>
            <div style={{ float:'left' }} className={styles.tableContainer}>{this.getCompareTable()}</div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default AssetHistory;
