import React, { Component, Fragment } from 'react';
import { Button, message, Modal, Tree, Upload } from 'antd';
import { connect } from 'dva';
import { generateUUID, getSessionCache } from '@/utils/Platform/platformUtil';
import styles from './templateImportAsset.less';

const { TreeNode } = Tree;
// 展现视图
const VIEW = 'View';
// 展现分组
const GROUP = 'Group';
// 包含的元数据元素
const ASSET = 'Asset';

@connect(({ mmAssets }) => ({
  displayViewData: mmAssets.displayViewData,
  viewContainData: mmAssets.viewContainData,
  groupContainData: mmAssets.groupContainData,
}))
class TemplateImportAsset extends Component {
  state = {
    treeData: [],
    selectedKeys: [],
    mountElementId: null,
    fileDisabled: true,
    messageTag: true,
  };

  componentDidMount() {
    this.showSystemViews();
  }

  handleOnOK = () => {
    const { onOk, refreshTree } = this.props;
    if (onOk) {
      onOk();
    }
    if (refreshTree) {
      refreshTree();
    }
    this.setState({ selectedKeys: [], mountElementId: null, fileDisabled: true });
  };

  handleOnCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    this.setState({ selectedKeys: [], mountElementId: null, fileDisabled: true });
  };

  initViewData = displayViewData => {
    let temp = displayViewData;
    if (!temp) {
      temp = {};
    }
    const displayViews = temp.data;
    if (displayViews && displayViews.length >= 0) {
      const treeData = [];
      displayViews.forEach(view => {
        treeData.push(this.getTreeNodeData(view, VIEW));
      });
      this.setState({ treeData, selectedKeys: [], mountElementId: null });
    }
  };

  getTreeNodeData = (sourceData, tType) => {
    const treeNode = {};
    treeNode.key = generateUUID();
    treeNode.id = sourceData.id;
    treeNode.value = sourceData.id;
    treeNode.title = this.getTitleWithIcon(sourceData, tType);
    treeNode.isLeaf = false;
    treeNode.tType = tType;
    treeNode.data = sourceData;
    return treeNode;
  };

  getTitleWithIcon = (sourceData, tType) => {
    let iconPath = null;
    if (tType === VIEW) {
      iconPath = 'st.svg';
    } else if (tType === GROUP) {
      iconPath = 'fzc.svg';
    } else if (tType === ASSET) {
      const elmntIcon = sourceData.icon;
      iconPath = elmntIcon.substring(elmntIcon.lastIndexOf('/') + 1);
    }
    return (
      <span style={{ userSelect: 'none' }}>
        <img
          alt=""
          style={{ height: '16px', width: '21px', marginBottom: '3px', paddingRight: '5px' }}
          /* eslint-disable-next-line global-require,import/no-dynamic-require */
          src={require('@/assets/mm/asset-icons/' + iconPath)}
        />
        {sourceData.name}
      </span>
    );
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const { dataRef } = treeNode.props;
      this.analyseChildren(dataRef, resolve);
    });

  addChildren = (dataRef, resolve, children) => {
    const temp = dataRef;
    temp.children = children;
    const { treeData } = this.state;
    this.setState({
      treeData: [...treeData],
    });
    resolve();
  };

  analyseChildren = (dataRef, resolve) => {
    const { tType } = dataRef;
    const { dispatch } = this.props;
    const { id } = dataRef;
    // 是否应该发送请求
    let doDispatch = false;
    let dispatchType = null;
    let dispatchPayload = null;
    if (tType === VIEW) {
      dispatchType = 'mmAssets/getViewContains';
      dispatchPayload = {
        viewId: id,
      };
      doDispatch = true;
    } else if (tType === GROUP) {
      dispatchType = 'mmAssets/getGroupContains';
      dispatchPayload = {
        groupId: id,
      };
      doDispatch = true;
    } else {
      const { data } = dataRef;
      const { associations } = data;
      const ownedElementIds = [];
      if (associations) {
        associations.forEach(item => {
          if (item.aggregate === true && item.fromElementId === id) {
            if (item.toElementId) {
              ownedElementIds.push(item.toElementId);
            }
          }
        });
        dispatchType = 'mmAssets/getElementsByIds';
        dispatchPayload = {
          elementIds: ownedElementIds,
        };
        doDispatch = true;
      }
    }
    if (!doDispatch) {
      return;
    }
    dispatch({
      type: dispatchType,
      payload: dispatchPayload,
    }).then(res => {
      let containData = null;
      if (tType === VIEW) {
        const { viewContainData } = this.props;
        containData = viewContainData;
      } else if (tType === GROUP) {
        const { groupContainData } = this.props;
        containData = groupContainData;
      } else {
        containData = res;
      }
      const children = this.getChildren(containData, tType);
      this.addChildren(dataRef, resolve, children);
    });
  };

  getChildren = (childrenData, tType) => {
    const result = [];
    if (tType === VIEW || tType === GROUP) {
      const { data } = childrenData;
      const groups = data[0];
      const elements = data[1];
      if (groups) {
        groups.forEach(item => {
          result.push(this.getTreeNodeData(item, GROUP));
        });
      }
      if (elements) {
        elements.forEach(item => {
          result.push(this.getTreeNodeData(item, ASSET));
        });
      }
    } else if (tType === ASSET) {
      if (childrenData && childrenData.length > 0) {
        childrenData.forEach(item => {
          result.push(this.getTreeNodeData(item, ASSET));
        });
      }
    }
    return result;
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} icon={item.icon} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  onItemSelect = (event, node) => {
    const { dataRef } = node.props;
    const { key, tType, id } = dataRef;
    if (tType === VIEW) {
      message.warn('请勿选择视图作为悬挂点！');
      return;
    }
    const keys = [key];
    this.setState({ selectedKeys: keys, mountElementId: id, fileDisabled: false });
  };

  async showSystemViews() {
    const { dispatch } = this.props;
    const types = ['System'];
    dispatch({
      type: 'mmAssets/getViewByTypes',
      payload: {
        types,
      },
    }).then(() => {
      const { displayViewData } = this.props;
      this.initViewData(displayViewData);
    });
  }

  render() {
    const { visible } = this.props;
    let { messageTag } = this.state;
    const productId = getSessionCache('productId');
    const { selectedKeys, mountElementId, treeData, fileDisabled } = this.state;
    const diToken = getSessionCache('diToken');
    const { handleOnOK, handleOnCancel } = this;

    const uploadProps = {
      name: 'myFile',
      action: `/di/${productId}/ingestion/excel_template?diToken=${diToken}`,
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      data: {
        mountElementId,
      },
      onChange(info) {
        handleOnCancel();
        if (info.file.status === 'done') {
          messageTag = true;
          if (info.file.response.code === 200) {
            message.success('导入成功，请刷新查看');
            handleOnOK();
          } else {
            message.warning('导入失败！错误信息：' + info.file.response.msg);
            handleOnCancel();
          }
        } else if (messageTag) {
          message.success('正在导入中，请稍后刷新查看');
          messageTag = false;
        }
      },
    };
    return (
      <Fragment>
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>
              {' '}
              选择悬挂点{' '}
            </div>
          }
          centered
          visible={visible}
          onCancel={this.handleOnCancel}
          bodyStyle={{ height: '450px', overflowY: 'auto', padding: '10px' }}
          width="35%"
          destroyOnClose
          footer={[
            <div style={{ display: 'inline-block', paddingRight: '10px' }}>
              <Upload {...uploadProps}>
                <Button disabled={fileDisabled} key="confirmButton" type="primary">
                  确定
                </Button>
              </Upload>
            </div>,
            <Button key="cancelButton" onClick={this.handleOnCancel}>
              取消
            </Button>,
          ]}
        >
          <div className={styles.importAssetContent}>
            <div className={styles.fromTreeContainer}>
              <Tree
                loadData={this.onLoadData}
                showIcon={false}
                onClick={this.onItemSelect}
                selectedKeys={selectedKeys}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default TemplateImportAsset;
