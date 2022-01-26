import React, { Component, Fragment } from 'react';
import {  Col, Row } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';

@connect(( ) => ({

}))
class AssetInferredDataType extends Component {
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
   * 获取列资产的预测数据类型
   * @returns {*}
   */
  getInferredDataTypeDetail = () => {
    const { elmntDiscovery } = this.state;
    if (elmntDiscovery && elmntDiscovery.inferredDataType) {
      const inferredDataTypeObject = JSON.parse(elmntDiscovery.inferredDataType);
      // 添加非空校验，应对脏数据情况
      if (inferredDataTypeObject) {
        return (
          <div>
            {Object.keys(inferredDataTypeObject).map(key => {
              const color = '#636AE1';
              return (
                <div key={key} className={styles.dataTypeRow}>
                  <Row>
                    <Col span={3}>
                      <div>{key}</div>
                    </Col>
                    <Col span={2}>
                      <div style={{ textAlign: 'right' }}>{inferredDataTypeObject[key]}</div>
                    </Col>
                    <Col span={1} />
                    <Col span={18}>
                      <div
                        style={{
                          height: '10px',
                          marginTop: '5px',
                          background: color,
                          width: inferredDataTypeObject[key],
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
    }
    return <div className={styles.emptyDiscovery}>该元数据无数据或未进行数据剖析</div>;
  };

  render() {
    return (
      <Fragment>
        {this.getInferredDataTypeDetail()}
      </Fragment>
    );
  }
}

export default AssetInferredDataType;
