import React, { Component, Fragment } from 'react';
import { Row, Col, Modal, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './elementRepeatInfo.less';

@connect(() => ({}))
class ElementRepeatInfo extends Component {
  state = {
    formElement: null,
    toElement: null,
    hasLoading: false,
    visible: false,
    list: [],
  };

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRef(this);
  }

  initPage = (fromElementId, toElementId) => {
    this.getElementRepeatList(fromElementId, toElementId);
    this.getFormElementById(fromElementId);
    this.getToElementById(toElementId);
  };

  getElementRepeatList = (fromElementId, toElementId) => {
    this.setState({ hasLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElementRepeatList',
      payload: {
        fromElementId,
        toElementId,
      },
    }).then(result => {
      if (result) {
        this.setState({ visible: true, hasLoading: false, list: result });
      }
    });
  };

  getFormElementById = (elementId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElement',
      payload: {
        elementId,
      },
    }).then(asset => {
      if (asset) {
        this.setState({ formElement: asset });
      }
    });
  };

  getToElementById = (elementId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElement',
      payload: {
        elementId,
      },
    }).then(asset => {
      if (asset) {
        // eslint-disable-next-line no-param-reassign
        asset.name += '(重复元数据)'
        this.setState({ toElement: asset });
      }
    });
  };

  getCompareTable = () => {
    const { list, hasLoading } = this.state;
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
        title: <div>重复属性名称</div>,
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: <div>重复属性内容</div>,
        dataIndex: 'value',
        key: 'value',
      },
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

  /**
   * 表格空数据样式
   * @returns {*}
   */
  initEmptyData = () => {
    return <span style={{ color: '#3f4b59' }}>暂无数据</span>;
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 获取资产图标
   * @returns {string|*}
   */
  getAssetIcon = (element) => {
    if (element && element.icon && element.icon !== '') {
      let { icon } = element;
      icon = icon.substring(icon.lastIndexOf('/') + 1);
      return (
        // eslint-disable-next-line global-require,import/no-dynamic-require
        <img alt='' className={styles.assetIcon} src={require('@/assets/mm/asset-icons/' + icon)} />
      );
    }
    return '';
  };

  getAssetName = (element) => {
    let { name } = element;
    if (name.length > 30) {
      name = name.substring(0, 30) + '...';
    }
    return (
      <Tooltip placement='bottomLeft' title={element.name}>
        <span className={styles.assetName}>{name}</span>
      </Tooltip>
    );
  };

  getAssetNamePath = (element) => {
    let { namePath } = element;
    if (namePath.length > 50) {
      namePath = namePath.substring(0, 50) + '...';
    }
    return (
      <div className={styles.assetDesc}>
        <span className={styles.descTitle}>资产路径：</span>
        <Tooltip placement='bottomLeft' title={element.namePath}>
          <span className={styles.descInfo}>{namePath}</span>
        </Tooltip>
      </div>
    );
  };

  /**
   * 获取资产描述
   * @returns {string}
   */
  getAssetDescription = (element) => {
    if (element && element.icon && element.icon !== '') {
      if (element && element.description && element.description !== '') {
        return (
          <div className={styles.assetDesc}>
            <span className={styles.descTitle}>描述信息：</span>
            <Tooltip placement='bottomLeft' title={element.description}>
              <span className={styles.descInfo}>{element.description}</span>
            </Tooltip>
          </div>
        );
      } else if (element && element.customDescription && element.customDescription !== '') {
        return (
          <div className={styles.assetDesc}>
            <span className={styles.descTitle}>描述信息：</span>
            <Tooltip placement='bottomLeft' title={element.customDescription}>
              <span className={styles.descInfo}>{element.customDescription}</span>
            </Tooltip>
          </div>
        );
      }
      return (
        <div className={styles.assetDesc}>
          <span className={styles.descTitle}>描述信息：</span>
          <Tooltip placement='bottomLeft' title='-'>
            <span className={styles.descInfo}>-</span>
          </Tooltip>
        </div>
      );
    }
    return '';
  };

  getFormElementHtml = () => {
    const { formElement } = this.state;
    if (formElement && formElement.id && formElement.id !== '') {
      return (
        <div>
          <div>
            {this.getAssetIcon(formElement)}
            {this.getAssetName(formElement)}
          </div>
          {this.getAssetNamePath(formElement)}
          {this.getAssetDescription(formElement)}
        </div>
      );
    }
    return '';
  };

  getToElementHtml = () => {
    const { toElement } = this.state;
    if (toElement && toElement.id && toElement.id !== '') {
      return (
        <div>
          <div>
            {this.getAssetIcon(toElement)}
            {this.getAssetName(toElement)}
          </div>
          {this.getAssetNamePath(toElement)}
          {this.getAssetDescription(toElement)}
        </div>
      );
    }
    return '';
  };

  render() {
    const { visible } = this.state;
    return (
      <Fragment>
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>
              元数据重复度分析明细
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
          <div>
            <div>
              <Row style={{ 'margin-bottom': '10px' }}>
                <Col span={12}>
                  {this.getFormElementHtml()}
                </Col>
                <Col span={12}>
                  {this.getToElementHtml()}
                </Col>
              </Row>
            </div>
            <div>{this.getCompareTable()}</div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default ElementRepeatInfo;
