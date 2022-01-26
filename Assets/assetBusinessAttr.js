import React, { Component, Fragment } from 'react';
import { Button, Col, message, Modal, Row, Tooltip, Spin, Icon } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';
import AssetBusinessAttrDialog from '@/pages/Mm/Assets/assetBusinessAttrDialog';

const DATA_OWNER_ATTR = {
  id: 'DataOwner',
  name: '数据责任人',
  attributeType: 'Enum',
  valueRange: '',
};
const SEPARATOR = ',';
@connect(() => ({}))
class AssetBusinessAttr extends Component {
  state = {
    businessDialogVisible: false,
    businessAttributes: [],
    elmntBusinessAttr: null,
    businessAttribute: null,
    continueCreateTag: false,
    isEdit: false,
    elmntBusinessAttrs: [],
    editVisibleTag: {},
    elmntBusinessAttrsLoading: false,
  };

  componentWillMount() {
    this.getAssetBusinessAttrs();
    this.getBusinessAttributes();
  }

  /**
   * 获取所有的业务属性
   */
  getBusinessAttributes = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getAllBusinessAttributes',
    }).then(businessAttributes => {
      dispatch({
        type: 'mmAssets/getAllDataOwnerUsers',
      }).then(dataOwners => {
        let value = '';
        if (dataOwners && dataOwners.length > 0) {
          dataOwners.forEach((dataOwner, index) => {
            if (index === dataOwners.length - 1) {
              value += dataOwner.account;
            } else {
              value += dataOwner.account + SEPARATOR;
            }
          });
        }
        DATA_OWNER_ATTR.valueRange = value;
        const businessAttribute = {
          id: DATA_OWNER_ATTR.id,
          name: DATA_OWNER_ATTR.name,
          attributeType: DATA_OWNER_ATTR.attributeType,
          valueRange: value,
        };
        businessAttributes.push(businessAttribute);
        this.setState({ businessAttributes });
      });
    });
  };

  /**
   * 获取资产的业务属性
   */
  getAssetBusinessAttrs = () => {
    const { dispatch, childProps } = this.props;
    const { asset } = childProps;
    if (asset && asset.id) {
      dispatch({
        type: 'mmAssets/getAssetBusinessAttrsById',
        payload: {
          elementId: asset.id,
        },
      }).then(result => {
        if (result && result.code === 200) {
          const elmntBusinessAttrs = result.data;
          this.setState({ elmntBusinessAttrs });
          this.setState({ elmntBusinessAttrsLoading: false });
        }
      });
    }
  };

  /**
   * 业务属性修改按钮鼠标移入事件
   * @param key
   */
  handleEditMouseEnter = key => {
    const { editVisibleTag } = this.state;
    editVisibleTag[key] = true;
    this.setState({ editVisibleTag });
  };

  /**
   * 业务属性修改按钮鼠标移出事件
   * @param key
   */
  handleEditMouseLeave = key => {
    const { editVisibleTag } = this.state;
    editVisibleTag[key] = false;
    this.setState({ editVisibleTag });
  };

  /**
   * 业务属性删除事件
   * @param key
   * @param elementId
   * @param businessAttrId
   */
  handleElmntBusinessAttrDelete = (key, elementId, businessAttrId) => {
    const { editVisibleTag } = this.state;
    editVisibleTag[key] = false;
    this.setState({ editVisibleTag });
    this.setState({ elmntBusinessAttrsLoading: true });
    const { dispatch } = this.props;
    const { getAssetBusinessAttrs, getBusinessAttributes } = this;
    Modal.confirm({
      title: '警告',
      content: '是否确认删除元数据配置的业务属性？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'mmAssets/deleteElmntBusinessAttr',
          payload: {
            elementId,
            businessAttrId,
          },
        }).then(() => {
          getAssetBusinessAttrs();
          getBusinessAttributes();
        });
      },
    });
    this.setState({ elmntBusinessAttrsLoading: false });
  };

  /**
   * 点击修改业务属性事件
   * @param elementId
   * @param businessAttrId
   */
  editElmntBusinessAttr = (elementId, businessAttrId) => {
    const { businessAttributes, elmntBusinessAttrs } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElmntBusinessAttr',
      payload: {
        elementId,
        businessAttrId,
      },
    }).then(elmntBusinessAttrFind => {
      if (elmntBusinessAttrFind) {
        this.setState({ elmntBusinessAttr: elmntBusinessAttrFind });
      } else {
        const elmntAttrFindInParentTemp = elmntBusinessAttrs.find(
          elmntBusinessAttrTemp => elmntBusinessAttrTemp.businessAttrId === businessAttrId
        );
        const elmntAttrFindInParent = {
          ingestionId: elmntAttrFindInParentTemp.ingestionId,
          businessAttrId: elmntAttrFindInParentTemp.businessAttrId,
          attrName: elmntAttrFindInParentTemp.attrName,
          attrDesc: elmntAttrFindInParentTemp.attrDesc,
          attrType: elmntAttrFindInParentTemp.attrType,
          createdBy: elmntAttrFindInParentTemp.createdBy,
          createdTime: elmntAttrFindInParentTemp.createdTime,
          modifiedBy: elmntAttrFindInParentTemp.modifiedBy,
          modifiedTime: elmntAttrFindInParentTemp.modifiedTime,
        };
        elmntAttrFindInParent.elementId = elementId;
        elmntAttrFindInParent.elmntAttrValue = undefined;
        elmntAttrFindInParent.applyOwnedElmnts = false;
        this.setState({ elmntBusinessAttr: elmntAttrFindInParent });
      }
      if (businessAttrId === DATA_OWNER_ATTR.id) {
        const businessAttribute = {
          id: DATA_OWNER_ATTR.id,
          name: DATA_OWNER_ATTR.name,
          attributeType: DATA_OWNER_ATTR.attributeType,
          valueRange: DATA_OWNER_ATTR.valueRange,
        };
        this.setState({ businessAttribute });
        if (elmntBusinessAttrs && businessAttributes) {
          const businessAttributesTemp = [];
          businessAttributes.forEach(businessAttributeDemo => {
            const elmntBusinessAttr = elmntBusinessAttrs.find(
              elmntBusinessAttrTemp =>
                elmntBusinessAttrTemp.businessAttrId === businessAttributeDemo.id
            );
            if (!elmntBusinessAttr) {
              businessAttributesTemp.push(businessAttributeDemo);
            }
          });
          businessAttributesTemp.push(businessAttribute);
          this.setState({ businessAttributes: businessAttributesTemp });
        }
        this.setState({ businessDialogVisible: true, isEdit: true });
      } else {
        dispatch({
          type: 'mmAssets/getBusinessAttribute',
          payload: {
            id: businessAttrId,
          },
        }).then(businessAttribute => {
          this.setState({ businessAttribute });
          if (elmntBusinessAttrs && businessAttributes) {
            const businessAttributesTemp = [];
            businessAttributes.forEach(businessAttributeDemo => {
              const elmntBusinessAttr = elmntBusinessAttrs.find(
                elmntBusinessAttrTemp =>
                  elmntBusinessAttrTemp.businessAttrId === businessAttributeDemo.id
              );
              if (!elmntBusinessAttr) {
                businessAttributesTemp.push(businessAttributeDemo);
              }
            });
            businessAttributesTemp.push(businessAttribute);
            this.setState({ businessAttributes: businessAttributesTemp });
          }
          this.setState({ businessDialogVisible: true, isEdit: true });
        });
      }
    });
  };

  /**
   * 获取属性操作按钮
   * @param elmntBusinessAttrs
   * @param key
   * @returns {string|*}
   */
  getAttrOperateButton = (elmntBusinessAttrs, key) => {
    const { childProps } = this.props;
    const { elementId } = childProps;
    let { operateConfig } = childProps;
    const { editVisibleTag } = this.state;
    if (!operateConfig) {
      operateConfig = {};
      operateConfig.operateBusinessAttrFlag = true;
    }
    if (operateConfig.operateBusinessAttrFlag) {
      return (
        <div
          className={styles.iconSpan}
          onMouseEnter={() => this.handleEditMouseEnter(key)}
          onMouseLeave={() => this.handleEditMouseLeave(key)}
        >
          <Icon className={styles.infoEditIcon} type="edit" hidden={editVisibleTag[key]} />
          <span hidden={!editVisibleTag[key]}>
            <span
              onClick={() =>
                this.editElmntBusinessAttr(elementId, elmntBusinessAttrs[key].businessAttrId)
              }
              className={styles.infoButton}
            >
              编辑
            </span>
            &nbsp;&nbsp;
            <span
              onClick={() =>
                this.handleElmntBusinessAttrDelete(
                  key,
                  elementId,
                  elmntBusinessAttrs[key].businessAttrId
                )
              }
              className={styles.infoButton}
            >
              删除
            </span>
          </span>
        </div>
      );
    }
    return '';
  };

  /**
   * 通过索引获取业务属性
   * @param elmntBusinessAttrs
   * @param key
   * @returns {*}
   */
  getBusinessAttributeByIndex = (elmntBusinessAttrs, key) => {
    const { editVisibleTag } = this.state;
    if (!editVisibleTag[key]) {
      editVisibleTag[key] = false;
    }
    return (
      <div style={{ display: 'inline-block', maxWidth: '100%' }}>
        <div className={styles.attrInfoSpan}>
          <Tooltip
            className={styles.infoTitle}
            title={elmntBusinessAttrs[key].attrDesc}
            placement="bottomLeft"
          >
            {elmntBusinessAttrs[key].attrName}：
          </Tooltip>
          <Tooltip title={elmntBusinessAttrs[key].elmntAttrValue} placement="bottomLeft">
            <span className={styles.infoValue}>{elmntBusinessAttrs[key].elmntAttrValue}</span>
          </Tooltip>
          {this.getAttrOperateButton(elmntBusinessAttrs, key)}
        </div>
      </div>
    );
  };

  /**
   * 配置资产的业务属性
   */
  addElmntBusinessAttr = () => {
    const { businessAttributes, elmntBusinessAttrs } = this.state;
    if (elmntBusinessAttrs && businessAttributes) {
      const businessAttributesTemp = [];
      businessAttributes.forEach(businessAttribute => {
        const elmntBusinessAttr = elmntBusinessAttrs.find(
          elmntBusinessAttrTemp => elmntBusinessAttrTemp.businessAttrId === businessAttribute.id
        );
        if (!elmntBusinessAttr) {
          businessAttributesTemp.push(businessAttribute);
        }
      });
      this.setState({ businessAttributes: businessAttributesTemp });
    }
    this.setState({ businessDialogVisible: true, isEdit: false });
  };

  /**
   * 获取添加按钮
   * @type {{}}
   */
  getAddAttrButton = () => {
    const { childProps } = this.props;
    const { operateConfig } = childProps;
    if (operateConfig.operateBusinessAttrFlag) {
      return (
        <Button
          type="dashed"
          onClick={() => {
            this.addElmntBusinessAttr();
          }}
          style={{ width: '60%', height: '24px' }}
        >
          <Icon type="plus" /> 添加
        </Button>
      );
    }
    return '';
  };

  /**
   * 获取业务属性信息
   * @returns {*}
   */
  getBusinessInfoDetail = () => {
    const { elmntBusinessAttrs, elmntBusinessAttrsLoading } = this.state;
    if (elmntBusinessAttrs && elmntBusinessAttrs.length > 0) {
      const { length } = elmntBusinessAttrs;
      const indexs = [];
      const groupNum = Math.ceil(length / 3);
      let j = 0;
      for (let i = 0; i < groupNum; i += 1) {
        const index = {};
        index.start = j;
        j += 3;
        if (j > length) {
          index.end = length - 1;
        } else {
          index.end = j - 1;
        }
        indexs.push(index);
      }
      return (
        <Spin spinning={elmntBusinessAttrsLoading}>
          <div className={styles.businessAttrInfoContainer}>
            {indexs.map((index, key) => {
              if (key === groupNum - 1) {
                if (index.end - index.start === 2) {
                  return (
                    <Fragment>
                      <div key={index.start + 'infoRowDiv'}>
                        <Row className={styles.attrInfoRow}>
                          <Col span={8}>
                            {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start)}
                          </Col>
                          <Col span={8}>
                            {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start + 1)}
                          </Col>
                          <Col span={8}>
                            {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start + 2)}
                          </Col>
                        </Row>
                      </div>
                      <div key="addBusinessAttributeDiv">
                        <Row>
                          <Col span={8}>{this.getAddAttrButton()}</Col>
                        </Row>
                      </div>
                    </Fragment>
                  );
                }
                if (index.end - index.start === 1) {
                  return (
                    <div key={index.start + 'infoRowDiv'}>
                      <Row>
                        <Col span={8} className={styles.buttonRowInfo}>
                          {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start)}
                        </Col>
                        <Col span={8} className={styles.buttonRowInfo}>
                          {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start + 1)}
                        </Col>
                        <Col span={8}>{this.getAddAttrButton()}</Col>
                      </Row>
                    </div>
                  );
                }
                if (index.end - index.start === 0) {
                  return (
                    <div key="addBusinessAttributeDiv">
                      <Row>
                        <Col span={8} className={styles.buttonRowInfo}>
                          {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start)}
                        </Col>
                        <Col span={8}>{this.getAddAttrButton()}</Col>
                      </Row>
                    </div>
                  );
                }
                return '';
              }
              return (
                <div key={index.start + 'infoRowDiv'} className={styles.attrInfoRow}>
                  <Row>
                    <Col span={8}>
                      {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start)}
                    </Col>
                    <Col span={8}>
                      {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start + 1)}
                    </Col>
                    <Col span={8}>
                      {this.getBusinessAttributeByIndex(elmntBusinessAttrs, index.start + 2)}
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </Spin>
      );
    }
    return (
      <div className={styles.businessAttrInfoContainer}>
        <div key="addBusinessAttributeDiv">
          <Row>
            <Col span={8}>{this.getAddAttrButton()}</Col>
          </Row>
        </div>
      </div>
    );
  };

  /**
   * 保存业务属性表单
   * @param formRef
   */
  saveBusinessFormRef = formRef => {
    this.formRef = formRef;
  };

  /**
   * 继续新建下一个勾选值变化
   * @param e
   */
  onCheckBoxChange = e => {
    this.setState({ continueCreateTag: e.target.checked });
  };

  /**
   * 取消新建
   */
  handleBusinessModalCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({ businessDialogVisible: false, continueCreateTag: false });
  };

  /**
   * 保存新建/修改
   */
  handleBusinessModalCreate = () => {
    const { form } = this.formRef.props;
    const {
      continueCreateTag,
      isEdit,
      elmntBusinessAttr,
      elmntBusinessAttrs,
      businessAttributes,
    } = this.state;
    const { dispatch, childProps } = this.props;
    const { elementId } = childProps;
    form.validateFieldsAndScroll((err, res) => {
      const tempRes = res;
      if (err) {
        return;
      }
      this.setState({ elmntBusinessAttrsLoading: true });
      res.elmntAttrValue = res.elmntAttrValue.toString();
      const { andBusinessTag, elmntAttrValue, applyOwnedElmnts, keys, values, orderNum } = res;
      if (andBusinessTag) {
        if (tempRes.name) {
          const elmntBusinessAttrTemp = elmntBusinessAttrs.find(
            elmntBusinessAttrDemo => elmntBusinessAttrDemo.attrName === tempRes.name
          );
          if (elmntBusinessAttrTemp) {
            message.error('已经存在该名称的业务属性，请勿重复');
            this.setState({ elmntBusinessAttrsLoading: false });
            return;
          }
          const businessAttrTemp = businessAttributes.find(
            businessAttributeDemo => businessAttributeDemo.name === tempRes.name
          );
          if (businessAttrTemp) {
            message.error('已经存在该名称的业务属性，请勿重复');
            this.setState({ elmntBusinessAttrsLoading: false });
            return;
          }
        }
        const valueRange = [];
        if (keys && keys.length > 0) {
          keys.map(key => {
            valueRange.push(values[key]);
            return key;
          });
        }
        tempRes.valueRange = valueRange.toString();
        const businessAttributeTemp = tempRes;
        const param = {
          elementId,
          elmntAttrValue,
          applyOwnedElmnts,
          orderNum,
          businessAttribute: businessAttributeTemp,
        };
        dispatch({
          type: 'mmAssets/saveBusinessAndElmntAttr',
          payload: {
            param,
          },
        }).then(() => {
          if (!continueCreateTag) {
            this.setState({ businessDialogVisible: false });
          }
          form.resetFields();
          this.getAssetBusinessAttrs();
          this.getBusinessAttributes();
          this.setState({ elmntBusinessAttrsLoading: false });
        });
      } else {
        const elmntBusinessAttrTemp = res;
        elmntBusinessAttrTemp.elementId = elementId;
        if (isEdit) {
          elmntBusinessAttrTemp.elementId = elmntBusinessAttr.elementId;
          elmntBusinessAttrTemp.createdBy = elmntBusinessAttr.createdBy;
          elmntBusinessAttrTemp.createdTime = elmntBusinessAttr.createdTime;
        }
        dispatch({
          type: 'mmAssets/saveElmntBusinessAttr',
          payload: {
            elmntBusinessAttr: elmntBusinessAttrTemp,
          },
        }).then(() => {
          if (!continueCreateTag) {
            this.setState({ businessDialogVisible: false });
          }
          form.resetFields();
          this.getAssetBusinessAttrs();
          this.setState({ elmntBusinessAttrsLoading: false });
        });
      }
    });
  };

  render() {
    const {
      businessAttributes,
      elmntBusinessAttr,
      continueCreateTag,
      isEdit,
      businessAttribute,
      businessDialogVisible,
    } = this.state;
    const { childProps } = this.props;
    const { elementId } = childProps;
    return (
      <Fragment>
        {this.getBusinessInfoDetail()}
        <AssetBusinessAttrDialog
          key={elementId + 'addDialog'}
          wrappedComponentRef={this.saveBusinessFormRef}
          visible={businessDialogVisible}
          onCancel={this.handleBusinessModalCancel}
          onCreate={this.handleBusinessModalCreate}
          onCheckBoxChange={this.onCheckBoxChange}
          isEdit={isEdit}
          elmntBusiness={elmntBusinessAttr}
          continueCreateTag={continueCreateTag}
          businessAttributes={businessAttributes}
          businessAttribute={businessAttribute}
        />
      </Fragment>
    );
  }
}

export default AssetBusinessAttr;
