import React, { Component, Fragment } from 'react';
import { Col, Row, Tooltip } from 'antd';
import styles from '@/pages/Mm/Assets/assetMainPage.less';
import { formatDate } from '@/utils/Mm/mmUtils';

class AssetBaseAttr extends Component {

  /**
   * 获取数据源
   * @param ingestion
   * @returns {string|*}
   */
  getDataSourceName = ingestion => {
    const { childProps } = this.props;
    const { assetOnClick } = childProps;
    if (ingestion) {
      const {dataSource}=ingestion;
      if(dataSource){
        return (
          <a onClick={() => assetOnClick(dataSource)}>
            {dataSource.name}
          </a>
        );
      }
    }
    return '-';
  };

  /**
   * 获取采集方式
   * @param ingestionId
   */
  getIngestIonType = ingestionId => {
    if (ingestionId) {
      return '自动采集';
    }
    return '手动录入';
  };

  /**
   * 格式化字符串
   * @param val
   * @returns {string|*}
   */
  formatString = val => {
    if (val === null || val === undefined || val === '') {
      return '-';
    }
    if (val === true || val === 'true') {
      return '是';
    } else if (val === false || val === 'false') {
      return '否';
    }
    return val.toString();
  };

  /**
   * 格式化bool
   * @param val
   * @returns {string}
   */
  formatBoolean = val => {
    if (val === true || val === 'true') {
      return '是';
    } else if (val === false || val === 'false') {
      return '否';
    }
    return '-';
  };

  /**
   * 获取资产的属性信息
   * @returns {*}
   */
  getAttrInfo = () => {
    const { childProps } = this.props;
    const { asset } = childProps;
    const { clazz } = asset;
    let { attributes } = asset;
    if (!attributes) {
      attributes = {};
    }
    let classAttrs = clazz.attributes;
    if (classAttrs && classAttrs.length >= 0) {
      classAttrs = classAttrs.filter(classAttr => classAttr.show);
    }
    if (clazz && classAttrs && classAttrs.length > 0) {
      return (
        <div className={styles.attrInfoContainer}>
          {classAttrs.map((attribute, key) => {
            if (key % 3 === 0) {
              if (key === classAttrs.length - 1) {
                return (
                  <div key={classAttrs[key].id + '_div'}>
                    <Row className={styles.attrInfoRow}>
                      {this.getAttrCard(classAttrs, attributes, key)}
                    </Row>
                  </div>
                );
              } else if (key + 1 === classAttrs.length - 1) {
                return (
                  <div key={classAttrs[key].id + '_div'}>
                    <Row className={styles.attrInfoRow}>
                      {this.getAttrCard(classAttrs, attributes, key)}
                      {this.getAttrCard(classAttrs, attributes, key + 1)}
                    </Row>
                  </div>
                );
              }
              return (
                <div key={classAttrs[key].id + '_div'}>
                  <Row className={styles.attrInfoRow}>
                    {this.getAttrCard(classAttrs, attributes, key)}
                    {this.getAttrCard(classAttrs, attributes, key + 1)}
                    {this.getAttrCard(classAttrs, attributes, key + 2)}
                  </Row>
                </div>
              );
            }
            return '';
          })}
        </div>
      );
    }
    return '';
  };

  getAttrCard = (classAttrs, attributes, index) => {
    return (
      <Col key={classAttrs[index].id} span={8}>
        <div className={styles.attrInfoSpan}>
          <span className={styles.infoTitle}>{classAttrs[index].name}：</span>
          <Tooltip
            placement="topLeft"
            title={this.formatString(attributes[classAttrs[index].code])}
          >
            <span className={styles.infoValue}>
              {this.formatString(attributes[classAttrs[index].code])}
            </span>
          </Tooltip>
        </div>
      </Col>
    );
  };

  /**
   * 获取基础信息
   * @returns {string|*}
   */
  getBaseInfoDetail = () => {
    const { childProps } = this.props;
    const { asset, ingestion } = childProps;
    if (asset) {
      return (
        <div key="baseInfo1" className={styles.baseInfoContainer}>
          <div>
            <Row>
              <Col span={8}>
                <span className={styles.infoTitle}>类型：</span>
                <span className={styles.infoValue}>{asset.typeName}</span>
              </Col>
              <Col span={8}>
                <span className={styles.infoTitle}>采集方式：</span>
                <span className={styles.infoValue}>{this.getIngestIonType(asset.ingestionId)}</span>
              </Col>
              <Col span={8}>
                <span className={styles.infoTitle}>数据源：</span>
                <span className={styles.infoValue}>{this.getDataSourceName(ingestion)}</span>
              </Col>
            </Row>
          </div>
          <div key="baseInfo2" className={styles.infoRow}>
            <Row>
              <Col span={8}>
                <span className={styles.infoTitle}>是否可编辑：</span>
                <span className={styles.infoValue}>{this.formatBoolean(asset.canEdit)}</span>
              </Col>
              <Col span={8}>
                <span className={styles.infoTitle}>更新人：</span>
                <span className={styles.infoValue}>{asset.modifiedBy}</span>
              </Col>
              <Col span={8}>
                <span className={styles.infoTitle}>更新时间：</span>
                <span className={styles.infoValue}>
                  {formatDate(new Date(asset.modifiedTime), 'yyyy-MM-dd HH:mm:ss')}
                </span>
              </Col>
            </Row>
          </div>
          {this.getAttrInfo()}
        </div>
      );
    }
    return '';
  };

  render() {
    return <Fragment>{this.getBaseInfoDetail()}</Fragment>;
  }
}

export default AssetBaseAttr;
