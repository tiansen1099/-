import React, { Component, Fragment } from 'react';
import { Button, message, Modal, Tree } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';
import termIcon from '@/assets/mm/asset-icons/term.svg';

const { TreeNode } = Tree;
// 业务术语
const TERM = 'Term';
// 分类
const CATEGORY = 'Category';
// 词汇表
const GLOSSARY = 'Glossary';
// 业务术语关联ID
const ANY_ASSET_TO_TERM = '8843';
@connect(() => ({}))
class AssetAssocTerm extends Component {
  state = {
    glossaryData: [],
  };

  componentWillMount() {
    this.getGlossaryElements();
  }

  /**
   * 资产的业务术语
   */
  openTerm = () => {
    const { asset } = this.state;
    let selectedKeys = [];
    if (asset) {
      if (asset.termElements && asset.termElements.length > 0 && asset.termElements[0]) {
        selectedKeys = [asset.termElements[0].id];
      }
    }
    this.setState({ expandedKeys: [] });
    this.setState({ selectedKeys });
    this.setState({ termVisible: true });
  };

  /**
   * 取消添加业务术语
   */
  termOnCancel = () => {
    this.setState({ termVisible: false });
  };

  /**
   * 添加资产和业务术语关联
   */
  addAssociation = () => {
    const { selectedTermId } = this.state;
    const { dispatch, asset, getElementById } = this.props;
    if (!selectedTermId || selectedTermId === '') {
      message.warn('请选择业务术语');
      return;
    }
    const newAssociation = {
      fromElementId: asset.id,
      toElementId: selectedTermId,
      associationId: ANY_ASSET_TO_TERM,
    };
    if (asset.termElements && asset.termElements.length > 0 && asset.termElements[0]) {
      const oldAssociation = {
        fromElementId: asset.id,
        toElementId: asset.termElements[0].id,
        associationId: ANY_ASSET_TO_TERM,
      };
      const associationList = [oldAssociation, newAssociation];
      dispatch({
        type: 'mmAssets/changeElementAssociation',
        payload: {
          associationList,
        },
      }).then(() => {
        getElementById();
        this.setState({ termVisible: false });
      });
    } else {
      dispatch({
        type: 'mmAssets/saveElementAssociation',
        payload: {
          newAssociation,
        },
      }).then(() => {
        getElementById();
        this.setState({ termVisible: false });
      });
    }
  };

  /**
   * 加载下级业务术语
   * @param treeNode
   * @returns {Promise<unknown>}
   */
  onLoadTermData = treeNode =>
    new Promise(resolve => {
      const treeNodeTemp = treeNode;
      if (treeNodeTemp.props.children) {
        resolve();
        return;
      }
      const { dispatch } = this.props;
      const { ownedElementIds } = treeNodeTemp.props;
      if (ownedElementIds && ownedElementIds.length > 0) {
        dispatch({
          type: 'mmAssets/getElementsByIds',
          payload: {
            elementIds: ownedElementIds,
          },
        }).then(ownedElements => {
          if (ownedElements) {
            const ownedData = this.convertElementToTreeNode(ownedElements, treeNodeTemp.props.key);
            treeNodeTemp.props.dataRef.children = ownedData;
            const { glossaryData } = this.state;
            this.setState({
              glossaryData: [...glossaryData],
            });
          }
        });
      }
      resolve();
    });

  /**
   * 业务术语展开下级
   * @param expandedKeys
   */
  termOnExpend = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };

  /**
   * 业务术语选中
   * @param selectedTermIds
   */
  termOnSelect = selectedTermIds => {
    this.setState({
      selectedTermId: selectedTermIds[0],
    });
  };

  /**
   * 获取词汇表数据
   */
  getGlossaryElements = () => {
    const { dispatch } = this.props;
    const type = 'Glossary';
    const searchParam = {
      start: 0,
      pageSize: 10,
      orderDir: 'desc',
      showHighlight: false,
      showAggregrations: false,
      deserializeToElement: true,
      showAssociations: true,
      search: '',
      searchConditions: [
        {
          colName: 'type',
          operator: 'eq',
          colValue: type,
          logicalOperator: 'must',
        },
      ],
    };
    dispatch({
      type: 'mmAssets/searchElements',
      payload: {
        searchParam,
      },
    }).then(result => {
      if (result) {
        const { elements } = result;
        if (elements) {
          const glossaryData = this.convertElementToTreeNode(elements, '0');
          this.setState({ glossaryData });
        }
      }
    });
  };

  /**
   * 将element转换为树节点
   * @param elements
   * @param pid
   * @returns {[]}
   */
  convertElementToTreeNode = (elements, pid) => {
    const { getOwnedElementIds } = this.props;
    const treeData = [];
    if (elements && elements.length !== 0) {
      elements.forEach(element => {
        const treeNode = {};
        treeNode.key = element.id;
        treeNode.pKey = pid;
        treeNode.value = element.id;
        const icon = element.icon.substring(element.icon.lastIndexOf('/') + 1);
        treeNode.title = element.name;
        treeNode.icon = (
          <img
            alt=""
            style={{ height: '18px', width: '18px', marginBottom: '3px' }}
            /* eslint-disable-next-line global-require,import/no-dynamic-require */
            src={require('@/assets/mm/asset-icons/' + icon)}
          />
        );
        treeNode.ownedElementIds = getOwnedElementIds(element);
        if (treeNode.ownedElementIds && treeNode.ownedElementIds.length > 0) {
          treeNode.isLeaf = false;
          treeNode.disabled = true;
        } else {
          treeNode.isLeaf = true;
          if (element.type === 'Term') {
            treeNode.disabled = false;
          } else {
            treeNode.disabled = true;
          }
        }
        treeData.push(treeNode);
      });
    }
    return treeData;
  };

  /**
   * 获取业务术语
   * @returns {string|*}
   */
  getAssociationTerm = () => {
    const { asset } = this.props;
    if (asset) {
      if (asset.type === TERM || asset.type === CATEGORY || asset.type === GLOSSARY) {
        return '';
      }
      if (asset.termElements && asset.termElements.length > 0 && asset.termElements[0]) {
        return (
          <Fragment>
            <img
              alt=""
              style={{ height: '16px', width: '16px', marginBottom: '3px' }}
              src={termIcon}
            />
            &nbsp;
            <span>{asset.termElements[0].name}</span>
          </Fragment>
        );
      }
      return '关联业务术语';
    }
    return '';
  };

  getTermByOperatePrivilege = () => {
    const { operatePrivilege } = this.props;
    if (operatePrivilege) {
      return (
        <span className={styles.termAssociation} onClick={() => this.openTerm()}>
          {this.getAssociationTerm()}
        </span>
      );
    }
    return <span className={styles.termAssociationNotClick}>{this.getAssociationTerm()}</span>;
  };

  /**
   * 渲染树节点
   * @param data
   * @returns {*}
   */
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.key} {...item} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  render() {
    const { termVisible, glossaryData, expandedKeys, selectedKeys } = this.state;
    return (
      <Fragment>
        {this.getTermByOperatePrivilege()}
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>业务术语</div>
          }
          centered
          visible={termVisible}
          onCancel={this.termOnCancel}
          onOk={this.addAssociation}
          footer={[
            <Button type="primary" onClick={this.addAssociation}>
              确定
            </Button>,
            <Button onClick={this.termOnCancel}>取消</Button>,
          ]}
          bodyStyle={{ height: '350px', padding: '15px', overflowY: 'auto' }}
          width="25%"
        >
          <Tree
            showIcon
            expandedKeys={expandedKeys}
            defaultSelectedKeys={selectedKeys}
            onExpand={this.termOnExpend}
            loadData={this.onLoadTermData}
            onSelect={this.termOnSelect}
            defaultExpandParent
          >
            {this.renderTreeNodes(glossaryData)}
          </Tree>
        </Modal>
      </Fragment>
    );
  }
}

export default AssetAssocTerm;
