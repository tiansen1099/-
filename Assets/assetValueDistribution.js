import React, { Component, Fragment } from 'react';
import {  Col, Row } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';


@connect(() => ({

}))
class AssetValueDistribution extends Component {
  state = {
    elmntDiscovery:null,
  };

  componentWillMount() {
    const {childProps}=this.props;
    const {elementId}=childProps;
    this.getElementDiscovery(elementId);
  }

  /**
   * 根据elementId获取数据剖析结果
   * @param elementId
   */
  getElementDiscovery = elementId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElmntDiscById',
      payload: {
        elementId,
      },
    }).then(res => {
      this.setState({ elmntDiscovery: res });
    });
  };

  /**
   * 不显示0.00%
   * @param value
   * @returns {string|*}
   */
  getValueDistributionValue = value => {
    if (value === '0.00%') {
      return '';
    }
    return value;
  };

  /**
   * 获取列资产的值分布信息
   * @returns {*}
   */
  getValueDistributionDetail = () => {
    const { elmntDiscovery } = this.state;
    if (elmntDiscovery && elmntDiscovery.valueDistribution) {
      const valueDistributionObj = JSON.parse(elmntDiscovery.valueDistribution);
      const { repeatRatio } = valueDistributionObj;
      const { unRepeatRatio } = valueDistributionObj;
      const { nullRatio } = valueDistributionObj;
      return (
        <div>
          <div className={styles.valueDistTitle}>
            <Row>
              <Col span={2}>
                <div>总览</div>
              </Col>
              <Col span={16} />
              <Col span={6}>
                <div className={styles.valueDistLabel}>
                  <Row>
                    <Col span={8}>
                      <div className={styles.repeatColorSquare} />
                      <span>重复</span>
                    </Col>
                    <Col span={8}>
                      <div className={styles.nullColorSquare} />
                      <span>空值</span>
                    </Col>
                    <Col span={8}>
                      <div className={styles.unrepeatColorSquare} />
                      <span>非重复</span>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.valueDistributionChar}>
            <div
              style={{
                background: '#2c8df4',
                height: '10px',
                width: repeatRatio,
                display: 'inline-block',
              }}
            />
            <div
              style={{
                background: '#ff525e',
                height: '10px',
                width: nullRatio,
                display: 'inline-block',
              }}
            />
            <div
              style={{
                background: '#3f4b59',
                height: '10px',
                width: unRepeatRatio,
                display: 'inline-block',
              }}
            />
          </div>
          <div className={styles.valueDistributionCharCent}>
            <div
              style={{
                width: repeatRatio,
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {this.getValueDistributionValue(repeatRatio)}
            </div>
            <div
              style={{
                width: nullRatio,
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {this.getValueDistributionValue(nullRatio)}
            </div>
            <div
              style={{
                width: unRepeatRatio,
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              {this.getValueDistributionValue(unRepeatRatio)}
            </div>
          </div>
        </div>
      );
    }
    return <div className={styles.emptyDiscovery}>该列无数据或未进行数据剖析</div>;
  };

  render() {
    return (
      <Fragment>
        {this.getValueDistributionDetail()}
      </Fragment>
    );
  }
}

export default AssetValueDistribution;
