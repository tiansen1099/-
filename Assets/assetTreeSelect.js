import React, { Component, Fragment } from 'react';
import { TreeSelect } from 'antd';
import { connect } from 'dva';

@connect(({ mmAssets }) => ({
  firstLevel: mmAssets.firstLevel,
}))
class AssetTreeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      expandedKeys: [],
    };
  }

  componentDidMount() {
    this.getFirstLevelElements();
  }

  /**
   * 获取第一层资产
   */
  getFirstLevelElements = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getFirstLevelElements',
    }).then(() => {
      this.initFirstTreeData();
    });
  };

  /**
   * 初始化第一层树节点，将资产转换成树节点
   */
  initFirstTreeData = () => {
    const { firstLevel } = this.props;
    let treeData = [];
    if (firstLevel && firstLevel.length !== 0) {
      // 将资产转换成树节点
      treeData = this.convertElementToTreeNode(firstLevel, 0);
    }
    this.setState({ treeData });
  };

  /**
   * 将资产转换成树节点
   * @param elements
   * @param pid
   * @returns {[]}
   */
  convertElementToTreeNode = (elements, pid) => {
    const treeData = [];
    if (elements && elements.length !== 0) {
      elements.forEach(element => {
        const treeNode = {};
        treeNode.id = element.id;
        treeNode.pId = pid;
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
        treeNode.ownedElementIds = this.getOwnedElementIds(element);
        if (treeNode.ownedElementIds && treeNode.ownedElementIds.length > 0) {
          treeNode.isLeaf = false;
        } else {
          treeNode.isLeaf = true;
        }
        treeData.push(treeNode);
      });
    }
    return treeData;
  };

  /**
   * 获取下级资产的Id集合
   * @param element
   * @returns {[]}
   */
  getOwnedElementIds = element => {
    const elementAssociations = element.associations;
    const result = [];
    const elementId = element.id;
    if (elementAssociations && elementAssociations.length !== 0) {
      elementAssociations.forEach(assoc => {
        if (assoc.fromElementId === elementId && assoc.aggregate === true) {
          result.push(assoc.toElementId);
        }
      });
    }
    return result;
  };

  /**
   * 加载下级树节点
   * @param treeNode
   * @returns {Promise<unknown>}
   */
  onLoadTreeData = treeNode =>
    new Promise(resolve => {
      const { dispatch } = this.props;
      const { ownedElementIds } = treeNode.props;
      if (ownedElementIds && ownedElementIds.length > 0) {
        dispatch({
          type: 'mmAssets/getElementsByIds',
          payload: {
            elementIds: ownedElementIds,
          },
        }).then(ownedElements => {
          if (ownedElements) {
            this.initOwnedTreeData(ownedElements, treeNode);
          }
        });
      }
      resolve();
    });

  /**
   * 将下级资产转换成树节点
   * @param treeNode
   */
  initOwnedTreeData = (ownedElements, treeNode) => {
    const { treeData } = this.state;
    let ownedTreeData = [];
    if (ownedElements && ownedElements.length !== 0) {
      ownedTreeData = this.convertElementToTreeNode(ownedElements, treeNode.props.id);
      this.setState({
        treeData: treeData.concat(ownedTreeData),
      });
    }
  };

  /**
   * 展开下级树节点
   * @param expandedKeys
   */
  onTreeExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };

  /**
   * 折叠所有展开的树节点
   */
  closeAllExpandTree = () => {
    this.setState({
      expandedKeys: [],
    });
  };

  /**
   * 选中值变化
   * @param value
   */
  onChange = value => {
    const { onChange } = this.props;
    onChange(value);
  };

  render() {
    const { treeData, expandedKeys } = this.state;
    // form表单自动清值，设置值，名称必须为value
    const { value } = this.props;
    return (
      <Fragment>
        <TreeSelect
          treeDataSimpleMode
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          placeholder="请选择映射源"
          treeIcon
          treeExpandedKeys={expandedKeys}
          onTreeExpand={this.onTreeExpand}
          loadData={this.onLoadTreeData}
          treeData={treeData}
          onChange={this.onChange}
          value={value}
          onFocus={this.closeAllExpandTree}
        />
      </Fragment>
    );
  }
}

export default AssetTreeSelect;
