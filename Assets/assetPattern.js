import React, { Component, Fragment } from 'react';
import {  Col, Row } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';


// 值分布中的空值
const NULL_VALUE = '空值';
// 值分布中的其他
const OTHER_VALUE = '其他';

@connect(() => ({

}))
class AssetPattern extends Component {
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
   * 获取列资产的数据模式
   * @returns {*}
   */
  getPatternDetail = () => {
    const { elmntDiscovery } = this.state;
    if (elmntDiscovery && elmntDiscovery.pattern) {
      const patternObject = JSON.parse(elmntDiscovery.pattern);
      return (
        <div>
          {Object.keys(patternObject).map(key => {
            let color = '#00C5DC';
            if (key === NULL_VALUE) {
              color = '#FF525E';
            } else if (key === OTHER_VALUE) {
              color = '#666666';
            }
            return (
              <div key={key} className={styles.patternRow}>
                <Row>
                  <Col span={3}>
                    <div>{key}</div>
                  </Col>
                  <Col span={2}>
                    <div style={{ textAlign: 'right' }}>{patternObject[key]}</div>
                  </Col>
                  <Col span={1} />
                  <Col span={18}>
                    <div
                      style={{
                        height: '10px',
                        marginTop: '5px',
                        background: color,
                        width: patternObject[key],
                      }}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      );
    }
    return <div className={styles.emptyDiscovery}>该列无数据或未进行数据剖析</div>;
  };

  render() {
    return (
      <Fragment>
        {this.getPatternDetail()}
      </Fragment>
    );
  }
}

export default AssetPattern;
