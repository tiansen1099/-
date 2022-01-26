import React, { Component, Fragment } from 'react';
import { Row, Button } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';
import { formatDate } from '@/utils/Mm/mmUtils';

/**
 * 数据问题
 * @type {string}
 */
const DATA_ISSUE = 'DataIssue';

/**
 * 元数据问题
 * @type {string}
 */
const METADATA_ISSUE = 'MetadataIssue';

/**
 * 质量跟踪
 * @type {string}
 */
const RUNNING_RECORD = '质量跟踪';
@connect(() => ({}))
class IssueInfo extends Component {
  state = {
    mainElement: null,
  };

  componentWillMount() {
    const { childProps } = this.props;
    const { asset } = childProps;
    this.getMainElement(asset);
  }

  /**
   * 获取异常资产
   */
  getMainElement = asset => {
    const { dispatch } = this.props;
    const elementId = asset.attributes.mainElement;
    dispatch({
      type: 'mmAssets/getElement',
      payload: {
        elementId,
      },
    }).then(res => {
      if (res) {
        this.setState({ mainElement: res });
      }
    });
  };

  /**
   * 获取异常资产名称
   * @returns {string|*}
   */
  getMainElementName = () => {
    const { childProps } = this.props;
    const { assetOnClick } = childProps;
    const { mainElement } = this.state;
    if (mainElement) {
      return (
        <span className={styles.clickInfoValue} onClick={() => assetOnClick(mainElement)}>
          {mainElement.name}
        </span>
      );
    }
    return '-';
  };

  /**
   * 获取异常描述
   * @param asset
   * @returns {string|*}
   */
  getDesc = asset => {
    if (asset && asset.description && asset.description !== '') {
      return asset.description;
    }
    return '-';
  };

  /**
   * 获取问题类别
   * @param asset
   * @returns {string}
   */
  getIssueType = asset => {
    if (
      asset &&
      asset.attributes &&
      asset.attributes.category &&
      asset.attributes.category !== ''
    ) {
      if (asset.attributes.category === DATA_ISSUE) {
        return '数据问题';
      }
      if (asset.attributes.category === METADATA_ISSUE) {
        return '元数据问题';
      }
    }
    return '-';
  };

  /**
   * 获取问题严重等级
   * @param asset
   * @returns {string}
   */
  getIssueLevel = asset => {
    if (
      asset &&
      asset.attributes &&
      asset.attributes.ruleLevel &&
      asset.attributes.ruleLevel !== ''
    ) {
      const text = asset.attributes.ruleLevel;
      if (text === 'P1') {
        return '非常严重';
      } else if (text === 'P2') {
        return '严重';
      } else if (text === 'P3') {
        return '中等';
      } else if (text === 'P4') {
        return '轻微';
      } else if (text === 'P5') {
        return '建议';
      }
    }
    return '-';
  };

  /**
   * 获取质量跟踪详情
   */
  getRunningRecordInfo = () => {
    const { childProps } = this.props;
    const { addTab, asset } = childProps;

    let { name } = asset;
    if (asset.attributes.category === DATA_ISSUE) {
      name = name.substring(0, name.indexOf('中数据')) + '...' + RUNNING_RECORD;
    } else {
      name += RUNNING_RECORD;
    }

    const { isSaCaDataQuality } = asset.attributes;
    if (isSaCaDataQuality) {
      const { refElements } = asset.attributes;
      const { id } = asset.dataSourceElement;
      const pane = {
        title: name,
        type: 'RunningRecordTab',
        key: asset.id + 'Report',
        tab: '1',
        dataSourceId: id,
        modelOId: refElements,
        isSaCaDataQuality,
      };
      if (addTab) {
        addTab(pane);
      }
    } else {
      const tableElementId = asset.attributes.mainElement;
      const standardSetId = asset.attributes.refElements;
      const pane = {
        title: name,
        type: 'RunningRecordTab',
        key: asset.id + 'Report',
        tab: '1',
        tableElementId,
        standardSetId,
        isSaCaDataQuality,
      };
      if (addTab) {
        addTab(pane);
      }
    }
  };

  /**
   * 获取质量报告
   * @param asset
   * @returns {string|*}
   */
  getRunningRecord = asset => {
    if (
      asset &&
      asset.attributes &&
      asset.attributes.category &&
      asset.attributes.category === DATA_ISSUE
    ) {
      return (
        <div>
          <Button type="primary" onClick={() => this.getRunningRecordInfo()}>
            {RUNNING_RECORD}
          </Button>
        </div>
      );
    }
    return '';
  };

  render() {
    const { childProps } = this.props;
    const { asset, tabTag } = childProps;
    return (
      <Fragment>
        <div className={styles.issueInfoContainer}>
          <Row>
            <div>
              <span className={styles.infoTitle}>问题分类：</span>
              <span className={styles.infoValue}>{this.getIssueType(asset)}</span>
            </div>
            <div>
              <span className={styles.infoTitle}>严重级别：</span>
              <span className={styles.infoValue}>{this.getIssueLevel(asset)}</span>
            </div>
            <div>
              <span className={styles.infoTitle}>更新时间：</span>
              <span className={styles.infoValue}>
                {formatDate(new Date(asset.modifiedTime), 'yyyy-MM-dd HH:mm:ss')}
              </span>
            </div>
            <div>
              <Row>
                <div style={{ float: 'left' }}>
                  <span className={styles.infoTitle}>异常描述：</span>
                </div>
                <div style={{ float: 'left' }}>
                  <span className={styles.infoValue}>{this.getDesc(asset)}</span>
                </div>
              </Row>
            </div>
            <div hidden={!tabTag}>
              <span className={styles.infoTitle}>异常元数据：</span>
              {this.getMainElementName()}
            </div>
            {this.getRunningRecord(asset)}
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default IssueInfo;
