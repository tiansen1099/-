import React, { Component, Fragment } from 'react';
import {
  Spin,
  Row,
  Col,
  Dropdown,
  Menu,
  Button,
  Table,
  Icon,
  Slider,
  Checkbox,
  Modal,
  message,
  Input,
} from 'antd';
import { GojsDiagram } from 'react-gojs';
import * as go from 'gojs';
import { connect } from 'dva';
import addIcon from '@/assets/mm/common/add.png';
import backIcon from '@/assets/mm/common/back.png';
import { formatDate } from '@/utils/Mm/mmUtils';
import DataPreviewView from '@/pages/Mm/Assets/dataPreviewView';
import styles from './assetAnalysis.less';

const $go = go.GraphObject.make;

const TYPE_COLOR_MAP = {};
const TABLE = 'Table';
const HBASE_TABLE = 'HBaseTable';
const VIEW = 'View';
TYPE_COLOR_MAP[TABLE] = '#FFFFFF';
TYPE_COLOR_MAP[HBASE_TABLE] = '#FFFFFF';
TYPE_COLOR_MAP[VIEW] = '#FFFFFF';
let clickFlag = null;

go.licenseKey =
  '73f043e7b51c28c702d90776423d6bf919a17564cf841fa30a0311f6e8083c06329eeb2b04d3db9382aa4cfe137d94d1ddc1682092480d3ce13583db13e085aab42563b44158418ef65327d189f92ba1f46773edc5';

@connect(({ loading }) => ({
  pageLoading: loading.effects['mmAssets/analyseElementLineage'],
}))
class AssetAnalysis extends Component {
  state = {
    analysisDiagram: null,
    nodeDataArray: [],
    linkDataArray: [],
    currentPercent: '100%',
    currentPercentValue: 50,
    analysisDiagramOverview: null,
    maxLeftLevel: 1,
    maxRightLevel: 1,
    leftLevel: 1,
    rightLevel: 1,
    allGraphData: null,
    centerElementNodesData: null,
    centerElementColumnData: [],
    centerLeafPaths: [],
    initailTag: true,
    addAndBackBtnFlag: '',
    elementNodesData: null,
    centerElementTableOrViewData: [],
    addTableVisible: false,
    dataPreview: false,
    ownedColumnElementDatas: [],
    selectedRowKeys: [],
    clearFilters: null,
    showTermTag: true,
    refreshTag: false,
    tableList: [],
  };

  componentDidMount() {
    this.analyseAssetAnalysis();
  }

  /**
   * 获取血缘/影响分析数据
   */
  analyseAssetAnalysis = () => {
    const { elementId } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/analyseElementLineage',
      payload: {
        centerElementIds: [elementId],
      },
    }).then(graphData => {
      this.init(graphData, 'fromPrevPage', 'showAddBtn');
    });
  };

  /**
   * 深拷贝对象
   * @param deep
   * @param target
   * @param options
   * @returns {*}
   */
  extend = (deep, target, options) => {
    const targetTemp = target;
    const keys = Object.keys(options);
    if (keys) {
      keys.map(name => {
        const copy = options[name];
        if (deep && copy instanceof Array) {
          targetTemp[name] = this.extend(deep, [], copy);
        } else if (deep && copy instanceof Object) {
          targetTemp[name] = this.extend(deep, {}, copy);
        } else {
          targetTemp[name] = options[name];
        }
        return name;
      });
    }
    return targetTemp;
  };

  /**
   * 初始化数据
   * @param graphData
   * @param flag1
   * @param flag2
   */
  init = (graphData, flag1, flag2) => {
    this.setState({ addAndBackBtnFlag: flag2 });
    if (flag1 === 'fromPrevPage') {
      // 全局缓存页面第一次初始化时的图表节点数据
      const allGraphData = this.extend(true, {}, graphData);
      this.setState({ allGraphData });
    }
    this.initDiagramData(graphData);
  };

  /**
   * 显示返回按钮
   * @returns
   */
  showReturnBtn = visible => {
    const { analysisDiagram, centerElementNodesData } = this.state;
    if (!centerElementNodesData || centerElementNodesData.length === 0) return;
    let centerTermNode = null;
    const groupNodeKey = centerElementNodesData[0].group;
    const groupNode = analysisDiagram.findNodeForKey(groupNodeKey);
    if (groupNode) {
      if (groupNode.data.category === 'InnerGroupNode')
        // 该图为下钻图
        centerTermNode = groupNode;
      else centerTermNode = analysisDiagram.findNodeForKey(centerElementNodesData[0].key);
    }
    const termObj = centerTermNode.findObject('BackBtn');
    termObj.visible = visible;
  };

  /**
   * 显示添加按钮
   * @returns
   */
  toggleAddBtn = visible => {
    const { analysisDiagram, centerElementNodesData } = this.state;
    if (!centerElementNodesData || centerElementNodesData.length === 0) return;
    let centerTermNode = null;
    const groupNodeKey = centerElementNodesData[0].group;
    const groupNode = analysisDiagram.findNodeForKey(groupNodeKey);
    if (groupNode) {
      if (groupNode.data.category === 'InnerGroupNode')
        // 该图为下钻图
        centerTermNode = groupNode;
      else centerTermNode = analysisDiagram.findNodeForKey(centerElementNodesData[0].key);
    }
    if (centerTermNode!= null) {
      const termObj = centerTermNode.findObject('AddBtn');
      termObj.visible = visible;
    }
  };

  /**
   * 处理数据为gojs格式
   * @param graphData
   */
  initDiagramData = graphData => {
    if (graphData) {
      const centerLeafPaths = [];
      this.setState({ centerLeafPaths });
      const nodeDataArray = [];
      const linkDataArray = [];
      const centerElementNodesData = [];
      const elementNodesData = [];
      this.setState({ centerElementNodesData, elementNodesData });

      const centerElts = graphData.centerElements;
      const leftElts = graphData.leftRefElements;
      const rightElts = graphData.rightRefElements;
      const associations = graphData.elementAssociations;

      const centerEltMap = {};
      const leftEltMap = {};
      const rightEltMap = {};

      // 先清空中心节点信息缓存
      const centerElementTableOrViewData = [];
      const centerElementColumnData = [];

      for (let i = 0; i < centerElts.length; i += 1) {
        centerEltMap[centerElts[i].id] = centerElts[i];
        // 重新缓存中心节点信息
        if (
          centerElts[i].type === TABLE ||
          centerElts[i].type === VIEW ||
          centerElts[i].type === HBASE_TABLE
        ) {
          centerElementTableOrViewData.push(centerElts[i]);
        } else {
          centerElementColumnData.push(centerElts[i]);
        }
      }
      this.setState({ centerElementColumnData });

      if (leftElts != null) {
        for (let i = 0; i < leftElts.length; i += 1) {
          leftEltMap[leftElts[i].id] = leftElts[i];
        }
      }

      if (rightElts != null) {
        for (let i = 0; i < rightElts.length; i += 1) {
          rightEltMap[rightElts[i].id] = rightElts[i];
        }
      }

      // 已处理的节点集合
      const centerFinishedNodeMap = {};
      const leftFinishedNodeMap = {};
      const rightFinishedNodeMap = {};

      if (associations.length === 0) {
        // 只有一个中心节点
        const node = this.createLINodeData(centerFinishedNodeMap, centerElts[0]);
        node.category = 'ElementNode';
        this.addNodeData(nodeDataArray, centerFinishedNodeMap, 'center');
      } else {
        // 初始化节点
        for (let i = 0; i < associations.length; i += 1) {
          const curAsso = associations[i];
          if (curAsso.aggregate) {
            if (leftEltMap[curAsso.fromElementId] && leftEltMap[curAsso.toElementId]) {
              // 构造节点，from为父节点，to为子节点
              const father = this.createLINodeData(
                leftFinishedNodeMap,
                leftEltMap[curAsso.fromElementId]
              );
              father.isGroup = true;
              father.category = 'InnerGroupNode';
              const son = this.createLINodeData(
                leftFinishedNodeMap,
                leftEltMap[curAsso.toElementId]
              );
              son.group = father.key;
              if (son.category !== 'InnerGroupNode') {
                // 已设为分组节点的，不能改为叶子节点
                son.category = 'ElementNode';
              }
            } else if (rightEltMap[curAsso.fromElementId] && rightEltMap[curAsso.toElementId]) {
              // 构造节点，from为父节点，to为子节点
              const father = this.createLINodeData(
                rightFinishedNodeMap,
                rightEltMap[curAsso.fromElementId]
              );
              father.isGroup = true;
              father.category = 'InnerGroupNode';
              const son = this.createLINodeData(
                rightFinishedNodeMap,
                rightEltMap[curAsso.toElementId]
              );
              son.group = father.key;
              if (son.category !== 'InnerGroupNode') {
                // 已设为分组节点的，不能改为叶子节点
                son.category = 'ElementNode';
              }
            } else if (centerEltMap[curAsso.fromElementId] && centerEltMap[curAsso.toElementId]) {
              // 构造节点，from为父节点，to为子节点
              const father = this.createLINodeData(
                centerFinishedNodeMap,
                centerEltMap[curAsso.fromElementId]
              );
              father.isGroup = true;
              father.category = 'InnerGroupNode';
              const son = this.createLINodeData(
                centerFinishedNodeMap,
                centerEltMap[curAsso.toElementId]
              );
              son.group = father.key;
              if (son.category !== 'InnerGroupNode') {
                // 已设为分组节点的，不能改为叶子节点
                son.category = 'ElementNode';
              }
            }
          } else if (leftEltMap[curAsso.fromElementId] && leftEltMap[curAsso.toElementId]) {
            const leftNode1 = this.createLINodeData(
              leftFinishedNodeMap,
              leftEltMap[curAsso.fromElementId]
            );
            if (leftNode1.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              leftNode1.category = 'ElementNode';
            }
            const leftNode2 = this.createLINodeData(
              leftFinishedNodeMap,
              leftEltMap[curAsso.toElementId]
            );
            if (leftNode2.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              leftNode2.category = 'ElementNode';
            }
          } else if (leftEltMap[curAsso.fromElementId] && centerEltMap[curAsso.toElementId]) {
            const leftNode = this.createLINodeData(
              leftFinishedNodeMap,
              leftEltMap[curAsso.fromElementId]
            );
            if (leftNode.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              leftNode.category = 'ElementNode';
            }
            const centerNode = this.createLINodeData(
              centerFinishedNodeMap,
              centerEltMap[curAsso.toElementId]
            );
            if (centerNode.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              centerNode.category = 'ElementNode';
            }
          } else if (centerEltMap[curAsso.fromElementId] && rightEltMap[curAsso.toElementId]) {
            const centerNode = this.createLINodeData(
              centerFinishedNodeMap,
              centerEltMap[curAsso.fromElementId]
            );
            if (centerNode.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              centerNode.category = 'ElementNode';
            }
            const rightNode = this.createLINodeData(
              rightFinishedNodeMap,
              rightEltMap[curAsso.toElementId]
            );
            if (rightNode.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              rightNode.category = 'ElementNode';
            }
          } else if (rightEltMap[curAsso.fromElementId] && rightEltMap[curAsso.toElementId]) {
            const rightNode1 = this.createLINodeData(
              rightFinishedNodeMap,
              rightEltMap[curAsso.fromElementId]
            );
            if (rightNode1.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              rightNode1.category = 'ElementNode';
            }
            const rightNode2 = this.createLINodeData(
              rightFinishedNodeMap,
              rightEltMap[curAsso.toElementId]
            );
            if (rightNode2.category !== 'InnerGroupNode') {
              // 已设为分组节点的，不能改为叶子节点
              rightNode2.category = 'ElementNode';
            }
          }
        }
        // 初始化连接
        for (let i = 0; i < associations.length; i += 1) {
          const curAsso = associations[i];
          if (!curAsso.aggregate) {
            const { dataFlowStatus, dataFlowErrorMsg } = curAsso;
            let category = 'DirectLink';
            if (dataFlowStatus === 'error') {
              category = 'ErrorLink';
            } else if (dataFlowStatus === 'warning') {
              category = 'WarningLink';
            }
            if (leftEltMap[curAsso.fromElementId] && leftEltMap[curAsso.toElementId]) {
              // 构造连接
              linkDataArray.push({
                from: leftFinishedNodeMap[curAsso.fromElementId].key,
                to: leftFinishedNodeMap[curAsso.toElementId].key,
                direction: 'left',
                category,
                dataFlowErrorMsg,
              });
            } else if (leftEltMap[curAsso.fromElementId] && centerEltMap[curAsso.toElementId]) {
              // 构造连接
              linkDataArray.push({
                from: leftFinishedNodeMap[curAsso.fromElementId].key,
                to: centerFinishedNodeMap[curAsso.toElementId].key,
                direction: 'left',
                category,
                dataFlowErrorMsg,
              });
            } else if (rightEltMap[curAsso.fromElementId] && rightEltMap[curAsso.toElementId]) {
              // 构造连接
              linkDataArray.push({
                from: rightFinishedNodeMap[curAsso.fromElementId].key,
                to: rightFinishedNodeMap[curAsso.toElementId].key,
                direction: 'right',
                category,
                dataFlowErrorMsg,
              });
            } else if (centerEltMap[curAsso.fromElementId] && rightEltMap[curAsso.toElementId]) {
              // 构造连接
              linkDataArray.push({
                from: centerFinishedNodeMap[curAsso.fromElementId].key,
                to: rightFinishedNodeMap[curAsso.toElementId].key,
                direction: 'right',
                category,
                dataFlowErrorMsg,
              });
            }
          }
        }
        // 将nodeMap加入nodeDataArray
        this.addNodeData(nodeDataArray, centerFinishedNodeMap, 'center');
        this.addNodeData(nodeDataArray, leftFinishedNodeMap, 'left');
        this.addNodeData(nodeDataArray, rightFinishedNodeMap, 'right');
      }
      const sortedNodeDataArray = this.sortNodeDataArray(nodeDataArray);
      this.setState({ nodeDataArray: sortedNodeDataArray });
      this.setState({ linkDataArray, centerElementTableOrViewData });
      this.setState({ refreshTag: false });
      const { analysisDiagram } = this.state;
      // 计算根节点到叶节点的所有路径（可能不唯一）
      const leafNodes = [];
      if (analysisDiagram) {
        analysisDiagram.nodes.each(node => {
          if (node.data.category !== 'ElementNode') {
            return true;
          }
          if (this.isLeafNode(node)) {
            leafNodes.push(node);
          }
          return true;
        });

        for (let i = 0; i < centerElementNodesData.length; i += 1) {
          const curCenterNode = analysisDiagram.findNodeForKey(centerElementNodesData[i].key);
          for (let j = 0; j < leafNodes.length; j += 1) {
            const paths = this.collectAllPaths(curCenterNode, leafNodes[j]);
            paths.each(path => {
              centerLeafPaths.push(path);
            });
          }
        }

        // 节点存储所属路径
        analysisDiagram.nodes.each(node => {
          if (node.data.category !== 'ElementNode') {
            return true;
          }
          for (let i = 0; i < centerLeafPaths.length; i += 1) {
            const curPath = centerLeafPaths[i];
            for (let j = 0; j < curPath.count; j += 1)
              if (node === curPath.get(j)) node.data.belongedPaths.push(curPath);
          }
          return true;
        });
        const { initailTag } = this.state;
        if (centerElementNodesData && centerElementNodesData.length > 0) {
          if (initailTag) {
            // 初始化节点深度
            let maxLeftLevel = 0;
            let maxRightLevel = 0;
            for (let i = 0; i < centerElementNodesData.length; i += 1) {
              const centerNodeData = centerElementNodesData[i];
              const centerNode = analysisDiagram.findNodeForKey(centerNodeData.key);
              const curMaxLeftLevel = this.initNodeLevel(centerNode, 'left');
              const curMaxRightLevel = this.initNodeLevel(centerNode, 'right');
              if (curMaxLeftLevel > maxLeftLevel) maxLeftLevel = curMaxLeftLevel;
              if (curMaxRightLevel > maxRightLevel) maxRightLevel = curMaxRightLevel;
            }
            this.setState({ maxLeftLevel, maxRightLevel });
            this.setState({ leftLevel: maxLeftLevel, rightLevel: maxRightLevel });
          }
        }
      }
    }
  };

  /**
   * 排序节点
   * @param nodeDataArray
   * @returns {*[]}
   */
  sortNodeDataArray = nodeDataArray => {
    const outerGroupNodes = [];
    const innerGrouupNodes = [];
    const elementNodes = [];
    for (let i = 0; i < nodeDataArray.length; i += 1) {
      if (nodeDataArray[i].category === 'OuterGroupNode') outerGroupNodes.push(nodeDataArray[i]);
      if (nodeDataArray[i].category === 'InnerGroupNode') innerGrouupNodes.push(nodeDataArray[i]);
      if (nodeDataArray[i].category === 'ElementNode') elementNodes.push(nodeDataArray[i]);
    }

    function sequence(o1, o2) {
      const attributes1 = o1.attributes;
      const attributes2 = o2.attributes;
      if (attributes1 && attributes2) {
        const pos1 = attributes1.position;
        const pos2 = attributes2.position;
        return pos1 - pos2;
      }
      return 0;
    }

    elementNodes.sort(sequence);
    return outerGroupNodes.concat(innerGrouupNodes, elementNodes);
  };

  /**
   * 添加节点数据
   * @param nodeDataArray
   * @param finishedNodeMap
   * @param direction
   */
  addNodeData = (nodeDataArray, finishedNodeMap, direction) => {
    const groupMap = {};
    const { centerElementNodesData, elementNodesData } = this.state;
    const keys = Object.keys(finishedNodeMap);
    keys.map(key => {
      const nodeData = finishedNodeMap[key];
      nodeData.direction = direction;
      if (direction === 'center' && nodeData.category === 'ElementNode') {
        centerElementNodesData.push(nodeData);
      }
      if (nodeData.category === 'ElementNode') {
        elementNodesData.push(nodeData);
      }
      nodeDataArray.push(nodeData);
      let rootElt = nodeData.mountElement;
      if (!rootElt) {
        rootElt = nodeData.dataSourceElement;
      }
      if (rootElt) {
        let rootNodeData = groupMap[rootElt.id];
        if (!rootNodeData) {
          // 加入顶级节点
          rootNodeData = {
            key: this.guid(),
            id: rootElt.id,
            name: rootElt.name,
            type: rootElt.type,
            // eslint-disable-next-line import/no-dynamic-require,global-require
            icon: require('@/assets/mm/asset-icons/' +
              rootElt.icon.substring(rootElt.icon.lastIndexOf('/') + 1)),
            isGroup: true,
            category: 'OuterGroupNode',
            direction,
            treeLevel: Infinity,
            description: rootElt.description,
          };
          groupMap[rootElt.id] = rootNodeData;
          nodeDataArray.push(rootNodeData);
        }
        if (!nodeData.group) {
          nodeData.group = rootNodeData.key;
        }
      }
      return key;
    });
    this.setState({ centerElementNodesData, elementNodesData });
  };

  /**
   * 获取随机ID
   * @returns {string}
   */
  guid = () => {
    return (
      this.S4() +
      this.S4() +
      '-' +
      this.S4() +
      '-' +
      this.S4() +
      '-' +
      this.S4() +
      '-' +
      this.S4() +
      this.S4() +
      this.S4()
    );
  };

  /**
   * 产生随机数
   * @returns {string}
   * @constructor
   */
  S4 = () => {
    return ((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  /**
   * 将element转换为节点
   * @param nodeMap
   * @param elt
   * @returns {*}
   */
  createLINodeData = (nodeMap, elt) => {
    const nodeMapTemp = nodeMap;
    let data = nodeMap[elt.id];
    if (!data) {
      data = {};
      data.key = this.guid();
      data.id = elt.id;
      data.name = elt.name;
      data.type = elt.type;
      data.typeName = elt.typeName;
      data.dataSourceElement = elt.dataSourceElement
      // eslint-disable-next-line import/no-dynamic-require,global-require
      data.icon = require('@/assets/mm/asset-icons/' +
        elt.icon.substring(elt.icon.lastIndexOf('/') + 1));
      if (elt.mountElement) {
        data.mountElement = elt.mountElement;
      } else {
        data.mountElement = elt.dataSourceElement;
      }

      data.namePath = elt.namePath;
      data.modifiedTime = elt.modifiedTime;
      data.treeLevel = Infinity;
      data.belongedPaths = [];
      data.description = elt.description;
      if (elt.termElements && elt.termElements.length > 0 && elt.termElements[0]) {
        data.termElements = elt.termElements;
      } else {
        data.termElements = [];
      }
      if (elt.attributes) data.attributes = elt.attributes;
      nodeMapTemp[data.id] = data;
    }
    return data;
  };

  /**
   * 获取节点提示框
   * @returns {Adornment | Panel | GraphObject | InstanceType<Adornment>}
   */
  getTooltip = () => {
    return $go(
      go.Adornment,
      'Auto',
      $go(go.Shape, 'RoundedRectangle', {
        fill: 'rgba(0,0,0,0.7)',
        stroke: null,
      }),
      $go(
        go.Panel,
        'Vertical',
        {
          padding: 5,
        },
        $go(
          go.Panel,
          'Horizontal',
          {
            alignment: go.Spot.Left,
            margin: 5,
          },
          $go(
            go.Picture,
            {
              width: 20,
              height: 20,
            },
            new go.Binding('source', 'icon')
          ),
          $go(
            go.TextBlock,
            {
              margin: 5,
              stroke: '#fff',
              font: 'bold 12px AlibabaPuHuiTiM #3f4b59',
            },
            new go.Binding('text', 'name')
          )
        ),
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px AlibabaPuHuiTiM #3f4b59',
            stroke: '#fff',
          },
          new go.Binding('text', 'typeName', data => {
            return '资产类型：' + data;
          })
        ),
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px AlibabaPuHuiTiM #3f4b59',
            stroke: '#fff',
          },
          new go.Binding('text', 'namePath', data => {
            return '路径：' + data;
          })
        ),
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px AlibabaPuHuiTiM #3f4b59',
            stroke: '#fff',
          },
          new go.Binding('text', 'description', data => {
            if (!data || data === '') {
              return '描述：-';
            }
            return '描述：' + data;
          })
        ),
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px AlibabaPuHuiTiM #3f4b59',
            stroke: '#fff',
          },
          new go.Binding('text', 'modifiedTime', data => {
            return '上次更新时间：' + formatDate(new Date(data), 'yyyy-MM-dd HH:mm:ss');
          })
        )
      )
    );
  };

  /**
   * 双击节点跳转事件
   * @param e
   * @param node
   */
  analysisAssetOnDoubleClick = (e, node) => {
    const { addTab } = this.props;
    const pane = {
      title: node.data.name,
      type: 'AssetMainPage',
      key: node.data.id,
      tab: '2',
    };
    if (addTab) {
      addTab(pane);
    }
  };

  /**
   * 修改中心节点样式
   */
  onTreeLayoutComplete = () => {
    const { analysisDiagram, analysisDiagramOverview, addAndBackBtnFlag } = this.state;
    if (analysisDiagram) {
      analysisDiagram.nodes.each(node => {
        if (node.data.direction === 'center' && node.data.category === 'OuterGroupNode') {
          node.memberParts.each(child => {
            const outline = child.findObject('Outline');
            outline.fill = '#FFFFFF';
            outline.stroke = '#2c8df4';
            outline.strokeWidth = 2;
          });
        }
      });
      // 展现“添加”或“回退”图标
      if (addAndBackBtnFlag === 'showAddBtn') {
        this.toggleAddBtn(true);
      } else if (addAndBackBtnFlag === 'showBothBtn') {
        this.toggleAddBtn(true);
        this.showReturnBtn(true);
      }
      const { refreshTag, centerElementNodesData } = this.state;
      if (refreshTag) {
        if (centerElementNodesData && centerElementNodesData.length > 0) {
          // 初始化节点深度
          let maxLeftLevel = 0;
          let maxRightLevel = 0;
          for (let i = 0; i < centerElementNodesData.length; i += 1) {
            const centerNodeData = centerElementNodesData[i];
            const centerNode = analysisDiagram.findNodeForKey(centerNodeData.key);
            const curMaxLeftLevel = this.initNodeLevel(centerNode, 'left');
            const curMaxRightLevel = this.initNodeLevel(centerNode, 'right');
            if (curMaxLeftLevel > maxLeftLevel) maxLeftLevel = curMaxLeftLevel;
            if (curMaxRightLevel > maxRightLevel) maxRightLevel = curMaxRightLevel;
          }
          this.setState({ maxLeftLevel, maxRightLevel });
          this.setState({ leftLevel: maxLeftLevel, rightLevel: maxRightLevel });
        }
      }
      analysisDiagram.requestUpdate(true);
      analysisDiagramOverview.box.elt(0).stroke = '#2c8df4';
      analysisDiagramOverview.box.elt(0).strokeWidth = 0.5;
      analysisDiagramOverview.box.elt(0).fill = 'rgba(28,152,232,0.1)';
      analysisDiagram.requestUpdate(true);
      analysisDiagram.startTransaction('Align');
      analysisDiagram.contentAlignment = go.Spot.Center;
      analysisDiagram.commitTransaction('Align');
      analysisDiagram.startTransaction('Cancel Align');
      analysisDiagram.contentAlignment = go.Spot.Default;
      analysisDiagram.commitTransaction('Cancel Align');
    }
  };

  /**
   * 刷新页面
   * @param data
   * @param flag1
   * @param flag2
   */
  reloadPage = (data, flag1, flag2) => {
    this.setState({ refreshTag: true });
    this.init(data, flag1, flag2);
  };

  /**
   * 返回按钮点击事件
   */
  backOnClick = () => {
    const { allGraphData } = this.state;
    this.setState({ selectedRowKeys: [] });
    const flag1 = 'fromCurrentPage';
    const flag2 = 'showAddBtn';
    this.reloadPage(allGraphData, flag1, flag2);
  };

  /**
   * 添加按钮点击事件
   */
  addBtnOnClick = () => {
    const { centerElementTableOrViewData, selectedRowKeys, centerElementColumnData } = this.state;
    const elementId = centerElementTableOrViewData[0].id;
    this.setState({ addTableVisible: true });
    if (
      centerElementColumnData &&
      centerElementColumnData.length > 0 &&
      selectedRowKeys.length === 0
    ) {
      this.setState({ selectedRowKeys: [centerElementColumnData[0].id] });
    }
    const { dispatch } = this.props;
    const param = {
      elementId,
      type: 'Column,HBaseColumn',
    };
    dispatch({
      type: 'mmAssets/getOwnedElementsByType',
      payload: {
        param,
      },
    }).then(res => {
      this.setState({ ownedColumnElementDatas: res });
      this.setState({ addTableVisible: true });
    });
  };

  /**
   * GoJS面板初始化，定义模型
   * @param diagramId
   * @returns {Adornment | Panel | GraphObject | InstanceType<Diagram>}
   */
  initDiagram = diagramId => {
    const { elementId } = this.props;
    const analysisDiagram = $go(go.Diagram, diagramId, {
      contentAlignment: go.Spot.Center,
      allowCopy: false,
      allowDelete: false,
      'toolManager.hoverDelay': 0,
      'dragSelectingTool.isEnabled': false,
      layout: $go(go.TreeLayout),
      LayoutCompleted: this.onTreeLayoutComplete,
    });

    analysisDiagram.groupTemplateMap.add(
      'OuterGroupNode',
      $go(
        go.Group,
        go.Panel.Auto,
        {
          isShadowed: true,
          shadowColor: '#EFF0F2',
          shadowOffset: new go.Point(5, 5),
          selectionAdorned: false,
          layout: $go(go.TreeLayout),
        },
        $go(go.Shape, 'Rectangle', {
          fill: '#f9f9f9',
          stroke: '#dfe3e9',
        }),
        $go(
          go.Panel,
          go.Panel.Vertical,
          {},
          $go(
            go.Panel,
            go.Panel.Horizontal,
            {
              stretch: go.GraphObject.Horizontal,
              minSize: new go.Size(170, NaN),
              margin: 1,
            },
            $go('SubGraphExpanderButton', {
              alignment: go.Spot.Right,
              margin: new go.Margin(3, 10),
              width: 12,
              height: 12,
            }),
            $go(
              go.TextBlock,
              {
                alignment: go.Spot.Left,
                margin: new go.Margin(7, 0),
                font: '12px AlibabaPuHuiTiM #3f4b59',
                stroke: '#3f4b59',
                width: 120,
                maxLines: 1,
                wrap: go.TextBlock.None,
                overflow: go.TextBlock.OverflowEllipsis,
              },
              new go.Binding('text', 'name')
            )
          ),
          $go(go.Shape, 'LineH', {
            stretch: go.GraphObject.Horizontal,
            stroke: '#dde1e4',
            margin: new go.Margin(0, 0),
            height: 1,
          }),
          $go(go.Placeholder, {
            padding: new go.Margin(10, 10),
            alignment: go.Spot.TopLeft,
          })
        )
      )
    );

    analysisDiagram.groupTemplateMap.add(
      'InnerGroupNode',
      $go(
        go.Group,
        'Auto',
        {
          selectionAdorned: false,
          layout: $go(go.TreeLayout),
        },
        $go(
          go.Shape,
          'Rectangle',
          {
            name: 'Outline',
            fill: '#f9f9f9',
            stroke: '#f9f9f9',
          },
          new go.Binding('fill', 'type', type => {
            let typeColor = TYPE_COLOR_MAP[type];
            if (!typeColor) {
              typeColor = '#FFFFFF';
            }
            return typeColor;
          })
        ),
        $go(
          go.Panel,
          'Vertical',
          {},
          $go(
            go.Panel,
            'Horizontal',
            {
              stretch: go.GraphObject.Horizontal,
              minSize: new go.Size(170, NaN),
              margin: 1,
            },
            $go('SubGraphExpanderButton', {
              alignment: go.Spot.Right,
              margin: new go.Margin(5, 5),
              width: 12,
              height: 12,
            }),
            $go(
              go.Picture,
              {
                margin: new go.Margin(2, 5, 0, 0),
                width: 20,
                height: 20,
              },
              new go.Binding('source', 'icon')
            ),

            $go(
              go.Panel,
              'Vertical',
              {
                alignment: go.Spot.Left,
              },
              $go(
                go.TextBlock,
                {
                  name: 'Terms',
                  alignment: go.Spot.Left,
                  margin: new go.Margin(5, 0, -3, 0),
                  font: 'bold 12px AlibabaPuHuiTiM #3f4b59',
                  stroke: '#3f4b59',
                  visible: false,
                  width: 120,
                  maxLines: 1,
                  wrap: go.TextBlock.None,
                  overflow: go.TextBlock.OverflowEllipsis,
                },
                new go.Binding('text', 'termElements', elts => {
                  const terms = [];
                  if (elts && elts.length !== 0)
                    for (let i = 0; i < elts.length; i += 1) {
                      terms.push(elts[i].name);
                    }
                  return terms.join(' ');
                })
              ),
              $go(
                go.TextBlock,
                {
                  alignment: go.Spot.Left,
                  margin: new go.Margin(5, 0, 3, 0),
                  font: '12px AlibabaPuHuiTiM #3f4b59',
                  stroke: '#3f4b59',
                  width: 120,
                  maxLines: 1,
                  wrap: go.TextBlock.None,
                  overflow: go.TextBlock.OverflowEllipsis,
                },
                new go.Binding('text', 'name')
              )
            )
          ),
          $go(go.Shape, 'LineH', {
            stretch: go.GraphObject.Horizontal,
            stroke: '#dfe3e9',
            margin: new go.Margin(3, 10),
            height: 1,
          }),
          $go(go.Placeholder, {
            padding: new go.Margin(0, 10, 10, 10),
            alignment: go.Spot.TopLeft,
          })
        ),
        $go(go.Picture, {
          name: 'BackBtn',
          margin: new go.Margin(7, 25, 0, 10),
          width: 10,
          height: 10,
          source: backIcon,
          alignment: go.Spot.TopRight,
          cursor: 'pointer',
          visible: false,
          click: this.backOnClick,
        }),
        $go(go.Picture, {
          name: 'AddBtn',
          margin: new go.Margin(7, 5, 0, 5),
          width: 10,
          height: 10,
          cursor: 'pointer',
          source: addIcon,
          alignment: go.Spot.TopRight,
          visible: false,
          click: this.addBtnOnClick,
        })
      )
    );

    analysisDiagram.nodeTemplateMap.add(
      'ElementNode',
      $go(
        go.Node,
        'Auto',
        {
          click: this.onElementNodeClick,
          doubleClick: this.analysisAssetOnDoubleClick,
          toolTip: this.getTooltip(),
          cursor: 'pointer',
        },
        $go(go.Shape, 'Rectangle', {
          name: 'Outline',
          fill: '#ffffff',
          stroke: '#dfe3e9',
          strokeWidth: 1,
          stretch: go.GraphObject.Horizontal,
          minSize: new go.Size(150, NaN),
        }),
        $go(
          go.Panel,
          'Horizontal',
          {
            alignment: go.Spot.Left,
          },
          $go(
            go.Picture,
            {
              margin: new go.Margin(5, 0, 5, 10),
              width: 20,
              height: 20,
            },
            new go.Binding('source', 'icon')
          ),
          $go(
            go.Panel,
            'Vertical',
            {
              alignment: go.Spot.Left,
            },
            $go(
              go.TextBlock,
              {
                name: 'Terms',
                alignment: go.Spot.Left,
                margin: new go.Margin(3, 0, -3, 10),
                font: 'bold 12px AlibabaPuHuiTiM #3f4b59',
                stroke: '#3f4b59',
                visible: false,
                width: 120,
                maxLines: 1,
                wrap: go.TextBlock.None,
                overflow: go.TextBlock.OverflowEllipsis,
              },
              new go.Binding('text', 'termElements', elts => {
                const terms = [];
                if (elts && elts.length !== 0)
                  for (let i = 0; i < elts.length; i += 1) {
                    terms.push(elts[i].name);
                  }
                return terms.join(' ');
              })
            ),
            $go(
              go.TextBlock,
              {
                margin: new go.Margin(3, 0, 3, 10),
                font: '12px AlibabaPuHuiTiM #3f4b59',
                stroke: '#2c8df4',
                width: 120,
                maxLines: 1,
                wrap: go.TextBlock.None,
                overflow: go.TextBlock.OverflowEllipsis,
              },
              new go.Binding('text', 'name')
            )
          )
        ),
        $go(go.Picture, {
          name: 'BackBtn',
          margin: new go.Margin(2, 10, 2, 5),
          width: 10,
          height: 10,
          source: backIcon,
          alignment: go.Spot.TopRight,
          cursor: 'pointer',
          visible: false,
          click: this.backOnClick,
        }),
        $go(go.Picture, {
          name: 'AddBtn',
          margin: new go.Margin(2, 5),
          width: 10,
          height: 10,
          cursor: 'pointer',
          source: addIcon,
          alignment: go.Spot.Right,
          visible: false,
          click: this.addBtnOnClick,
        })
      )
    );

    analysisDiagram.linkTemplateMap.add(
      'DirectLink',
      $go(
        go.Link,
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          routing: go.Link.Normal,
          corner: 20,
          selectable: false,
        },
        $go(go.Shape, {
          stroke: '#2c8df4',
          strokeWidth: 1,
        }),
        $go(go.Shape, {
          toArrow: 'Standard',
          stroke: 'transparent',
          fill: '#2c8df4',
        })
      )
    );

    analysisDiagram.linkTemplateMap.add(
      'ErrorLink',
      $go(
        go.Link,
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          routing: go.Link.Normal,
          corner: 20,
          selectable: false,
          toolTip: this.getDataFlowTooltip('error'),
        },
        $go(go.Shape, {
          stroke: '#F5222D',
          strokeWidth: 1,
        }),
        $go(go.Shape, {
          toArrow: 'Standard',
          stroke: 'transparent',
          fill: '#F5222D',
        })
      )
    );

    analysisDiagram.linkTemplateMap.add(
      'WarningLink',
      $go(
        go.Link,
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          routing: go.Link.Normal,
          corner: 20,
          selectable: false,
          toolTip: this.getDataFlowTooltip('warning'),
        },
        $go(go.Shape, {
          stroke: '#FAAD14',
          strokeWidth: 1,
        }),
        $go(go.Shape, {
          toArrow: 'Standard',
          stroke: 'transparent',
          fill: '#FAAD14',
        })
      )
    );
    analysisDiagram.linkTemplateMap.add(
      'IndirectLink',
      $go(
        go.Link,
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          routing: go.Link.Normal,
          corner: 20,
        },
        {
          doubleClick: this.expandLink,
          cursor: 'pointer',
        },
        $go(go.Shape, {
          stroke: '#1c98e8',
          strokeWidth: 1,
          strokeDashArray: [1, 2],
        }),
        $go(go.Shape, {
          toArrow: 'Standard',
          stroke: 'transparent',
          fill: '#1c98e8',
        })
      )
    );

    analysisDiagram.linkTemplateMap.add(
      'WarningIndirectLink',
      $go(
        go.Link,
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          routing: go.Link.Normal,
          corner: 20,
        },
        {
          doubleClick: this.expandLink,
          cursor: 'pointer',
          toolTip: this.getDataFlowTooltip('warningIndirect'),
        },
        $go(go.Shape, {
          stroke: '#FAAD14',
          strokeWidth: 1,
          strokeDashArray: [1, 2],
        }),
        $go(go.Shape, {
          toArrow: 'Standard',
          stroke: 'transparent',
          fill: '#FAAD14',
        })
      )
    );

    analysisDiagram.linkTemplateMap.add(
      'ErrorIndirectLink',
      $go(
        go.Link,
        {
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Left,
        },
        {
          routing: go.Link.Normal,
          corner: 20,
        },
        {
          doubleClick: this.expandLink,
          cursor: 'pointer',
          toolTip: this.getDataFlowTooltip('errorIndirect'),
        },
        $go(go.Shape, {
          stroke: '#F5222D',
          strokeWidth: 1,
          strokeDashArray: [1, 2],
        }),
        $go(go.Shape, {
          toArrow: 'Standard',
          stroke: 'transparent',
          fill: '#F5222D',
        })
      )
    );

    const analysisDiagramOverview = $go(go.Overview, elementId + '_analysisOverview', {
      observed: analysisDiagram,
      contentAlignment: go.Spot.Center,
    });
    analysisDiagramOverview.box.elt(0).stroke = '#2c8df4';
    analysisDiagramOverview.box.elt(0).strokeWidth = 0.5;
    analysisDiagramOverview.box.elt(0).fill = 'rgba(28,152,232,0.1)';

    analysisDiagram.requestUpdate(true);
    analysisDiagram.startTransaction('Align');
    analysisDiagram.contentAlignment = go.Spot.Center;
    analysisDiagram.commitTransaction('Align');
    analysisDiagram.startTransaction('Cancel Align');
    analysisDiagram.contentAlignment = go.Spot.Default;
    analysisDiagram.commitTransaction('Cancel Align');
    this.setState({ analysisDiagram, analysisDiagramOverview });
    return analysisDiagram;
  };

  /**
   * 获取begin到end的所有路径
   * @param begin
   * @param end
   * @returns {List<T>}
   */
  collectAllPaths = (begin, end) => {
    const stack = new go.List(go.Node);
    const coll = new go.List(go.List);

    function find(source, endTemp) {
      let neighbors = null;
      if (endTemp.data.direction === 'left') neighbors = source.findNodesInto();
      else neighbors = source.findNodesOutOf();
      neighbors.each(n => {
        if (n === source) return; // ignore reflexive links
        if (n === endTemp) {
          // success
          const path = stack.copy();
          path.add(endTemp); // finish the path at the end node
          coll.add(path); // remember the whole path
        } else if (!stack.contains(n)) {
          // inefficient way to check having visited
          stack.add(n); // remember that we've been here for this path (but not forever)
          find(n, endTemp);
          stack.removeAt(stack.count - 1);
        } // else might be a cycle
      });
    }

    stack.add(begin); // start the path at the begin node
    find(begin, end);
    return coll;
  };

  /**
   * 判断节点是否是最边缘节点
   */
  isLeafNode = node => {
    let linkedNodes = null;
    if (node.data.direction === 'left') linkedNodes = node.findNodesInto();
    else linkedNodes = node.findNodesOutOf();
    if (linkedNodes.count === 0) return true;
    if (linkedNodes.count === 1) {
      if (linkedNodes.first().data.key === node.data.key) {
        return true;
      }
      return false;
    }
    return false;
  };

  /**
   * 初始化节点层次
   * @param centerNode
   * @param direction
   * @returns {number}
   */
  initNodeLevel = (centerNode, direction) => {
    let maxLevel = 0;
    if (centerNode) {
      const distances = this.findDistances(centerNode, direction);
      const { nodeDataArray } = this.state;
      distances.each(elt => {
        const eltTemp = elt;
        const level = elt.value;
        if (level === Infinity) return true;
        if (level < elt.key.data.treeLevel) {
          nodeDataArray.forEach((nodeDate, key) => {
            if (nodeDate.id === eltTemp.key.data.id) {
              nodeDataArray[key].treeLevel = level;
            }
          });
          eltTemp.key.data.treeLevel = level;
        }
        if (level > maxLevel) {
          maxLevel = level;
        }
        return true;
      });
      this.setState({ nodeDataArray });
    }
    return maxLevel;
  };

  /**
   * 找到源到目标的距离
   * @param source
   * @param direction
   * @returns {Map<unknown, unknown>}
   */
  findDistances = (source, direction) => {
    const { diagram } = source;
    // keep track of distances from the source node
    const distances = new go.Map(go.Node, 'number');
    // all nodes start with distance Infinity
    const nit = diagram.nodes;
    while (nit.next()) {
      const n = nit.value;
      if (n.data.category === 'ElementNode' && n.data.direction === direction) {
        distances.add(n, Infinity);
      }
    }
    // the source node starts with distance 0
    distances.add(source, 0);
    // keep track of nodes for which we have set a non-Infinity
    // distance,
    // but which we have not yet finished examining
    const seen = new go.Set(go.Node);
    seen.add(source);

    // keep track of nodes we have finished examining;
    // this avoids unnecessary traversals and helps keep the SEEN
    // collection small
    const finished = new go.Set(go.Node);
    while (seen.count > 0) {
      // look at the unfinished node with the shortest distance so far
      const least = this.leastNode(seen, distances);
      const leastdist = distances.getValue(least);
      // by the end of this loop we will have finished examining this
      // LEAST node
      seen.remove(least);
      finished.add(least);
      // look at all Links connected with this node
      let it = null;
      if (direction === 'left') {
        it = least.findLinksInto();
      } else {
        it = least.findLinksOutOf();
      }
      while (it.next()) {
        const link = it.value;
        const neighbor = link.getOtherNode(least);
        // skip nodes that we have finished
        if (!finished.contains(neighbor)) {
          const neighbordist = distances.getValue(neighbor);
          // assume "distance" along a link is unitary, but could be any
          // non-negative number.
          const dist = leastdist + 1; // Math.sqrt(least.location.distanceSquaredPoint(neighbor.location));
          if (dist < neighbordist) {
            // if haven't seen that node before, add it to the SEEN
            // collection
            if (neighbordist === Infinity) {
              seen.add(neighbor);
            }
            // record the new best distance so far to that node
            distances.add(neighbor, dist);
          }
        }
      }
    }
    return distances;
  };

  /**
   * This helper function finds a Node in the given collection that has the smallest distance.
   * @param coll
   * @param distances
   * @returns {null}
   */
  leastNode = (coll, distances) => {
    let bestdist = Infinity;
    let bestnode = null;
    const it = coll.iterator;
    while (it.next()) {
      const n = it.value;
      const dist = distances.getValue(n);
      if (dist < bestdist) {
        bestdist = dist;
        bestnode = n;
      }
    }
    return bestnode;
  };

  /**
   * 节点点击事件
   * @param event
   * @param node
   */
  onElementNodeClick = (event, node) => {
    const { analysisDiagram } = this.state;
    if (clickFlag) {
      // 取消上次延时未执行的方法
      clickFlag = clearTimeout(clickFlag);
    }
    clickFlag = setTimeout(() => {
      // 点击中心节点时选中所有的关联节点
      const coll = new go.List(go.Node);
      const paths = node.data.belongedPaths;
      for (let i = 0; i < paths.length; i += 1) coll.addAll(paths[i]);
      analysisDiagram.selectCollection(coll);
    }, 300); // 延时300毫秒执行
  };

  /**
   * 间接连接点击事件
   * @param event
   * @param link
   */
  expandLink = (event, link) => {
    const { maxRightLevel, maxLeftLevel } = this.state;
    if (link.data.direction === 'left') {
      this.leftLevelOnChange(maxLeftLevel);
    } else {
      this.rightLevelOnChange(maxRightLevel);
    }
  };

  /**
   * 获取数据流相关Tooltip
   * @param dataFlowStatus
   * @returns {*}
   */
  getDataFlowTooltip = dataFlowStatus => {
    let fillColor = 'rgba(250,173,20,0.7)';
    if (dataFlowStatus === 'error' || dataFlowStatus === 'errorIndirect') {
      fillColor = 'rgba(245,34,45,0.7)';
    }
    return $go(
      go.Adornment,
      'Auto',
      $go(go.Shape, 'RoundedRectangle', {
        fill: fillColor,
        stroke: null,
      }),
      $go(
        go.Panel,
        'Vertical',
        {
          padding: 5,
        },
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px sans-serif',
            stroke: '#fff',
          },
          new go.Binding('text', 'dataFlowErrorMsg', data => {
            if (dataFlowStatus === 'warning') {
              return '警告：前置数据流向出现异常！';
            } else if (dataFlowStatus === 'warningIndirect') {
              return '警告：数据流向可能出现异常，请展开查看详情。';
            } else if (dataFlowStatus === 'errorIndirect') {
              return '错误：数据流向出现异常，请展开查看详情！';
            } else if (dataFlowStatus === 'error') {
              if (data) {
                // 超长信息处理
                const pos = data.indexOf('\n异常信息：');
                if (pos > 0) {
                  const detailInfo = data.substring(pos + 6);
                  if (detailInfo.length > 50) {
                    return data.substring(0, pos + 56) + '...';
                  }
                }
              }
              return data;
            }
            return '';
          })
        )
      )
    );
  };

  /**
   * 血缘节点变化
   * @param leftLevel
   */
  leftLevelOnChange = leftLevel => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(leftLevel)) {
      return;
    }
    this.setState({ initailTag: false });
    this.setState({ leftLevel });
    this.refreshNodes(leftLevel, 'left');
  };

  /**
   * 影响节点变化
   * @param rightLevel
   */
  rightLevelOnChange = rightLevel => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(rightLevel)) {
      return;
    }

    this.setState({ rightLevel });
    this.setState({ initailTag: false });
    this.refreshNodes(rightLevel, 'right');
  };

  /**
   * 刷新节点
   * @param showLevel
   * @param direction
   */
  refreshNodes = (showLevel, direction) => {
    const { analysisDiagram, centerLeafPaths } = this.state;
    let { linkDataArray } = this.state;
    linkDataArray = linkDataArray.filter(linkData => {
      return !(
        (linkData.category === 'IndirectLink' ||
          linkData.category === 'WarningIndirectLink' ||
          linkData.category === 'ErrorIndirectLink') &&
        linkData.direction === direction
      );
    });
    analysisDiagram.clearSelection();
    const { nodes } = analysisDiagram;
    analysisDiagram.startTransaction('Refresh Nodes');
    const indirectLinks = analysisDiagram.findLinksByExample({
      category: 'IndirectLink',
      direction,
    });
    const warningIndirectLinks = analysisDiagram.findLinksByExample({
      category: 'WarningIndirectLink',
      direction,
    });
    const errorIndirectLinks = analysisDiagram.findLinksByExample({
      category: 'ErrorIndirectLink',
      direction,
    });
    analysisDiagram.removeParts(indirectLinks);
    analysisDiagram.removeParts(warningIndirectLinks);
    analysisDiagram.removeParts(errorIndirectLinks);
    if (showLevel === 0) {
      nodes.each(node => {
        const nodeTemp = node;
        // 只显示中心节点
        if (nodeTemp.data.category === 'ElementNode' || nodeTemp.data.direction !== direction) {
          // 叶子节点或不属于该侧的节点忽略
          return true;
        }
        nodeTemp.visible = false;
        return true;
      });
      analysisDiagram.commitTransaction('Refresh Nodes');
      return;
    }
    // 显示、隐藏叶节点
    nodes.each(node => {
      const nodeTemp = node;
      if (nodeTemp.data.category !== 'ElementNode' || nodeTemp.data.direction !== direction) {
        return true;
      }
      if (node.data.treeLevel < showLevel || this.isLeafNode(node)) {
        nodeTemp.visible = true;
        this.getLinkedLinks(node).each(link => {
          const linkTemp = link;
          const fromNode = analysisDiagram.findNodeForKey(link.data.from);
          const toNode = analysisDiagram.findNodeForKey(link.data.to);
          if (fromNode.visible && toNode.visible) {
            linkTemp.visible = true;
          }
        });
      } else {
        nodeTemp.visible = false;
        this.getLinkedLinks(node).each(link => {
          const linkTemp = link;
          linkTemp.visible = false;
        });
      }
      return true;
    });

    // 添加间接连接
    // eslint-disable-next-line no-labels,no-restricted-syntax
    outer: for (let i = 0; i < centerLeafPaths.length; i += 1) {
      const path = centerLeafPaths[i];
      let j = 0;
      let k = 1;
      if (!(path.count < 2 || path.get(k).data.direction !== direction)) {
        while (j < path.count && k < path.count) {
          let hasErrorLink = false;
          let hasWarningLink = false;
          let category = 'IndirectLink';
          // 如果visible = false,则说明是应该隐藏的非叶子节点，需要在这里面判断可能存在的异常数据流向
          while (!path.get(k).visible) {
            const links = path.get(k - 1).findLinksBetween(path.get(k));
            const it = links.iterator;
            // 配置间接关联的告警色
            while (it.next()) {
              const link = it.value;
              const { data } = link;
              if (data.category === 'ErrorLink') {
                hasErrorLink = true;
                break;
              } else if (!hasErrorLink && data.category === 'WarningLink') {
                hasWarningLink = true; // 注意，不跳出循环
              }
            }
            k += 1;
            if (k >= path.count)
              // eslint-disable-next-line no-continue,no-labels
              continue outer;
          }
          // 如果存在错误的连接，间接关联告警色需要调整
          if (hasErrorLink) {
            category = 'ErrorIndirectLink';
          } else if (hasWarningLink) {
            category = 'WarningIndirectLink';
          }
          if (path.get(j).findLinksBetween(path.get(k)).count === 0) {
            if (direction === 'left') {
              const link = {
                from: path.get(k).data.key,
                to: path.get(j).data.key,
                category,
                direction,
                dataFlowErrorMsg: '', // 必须加上，否则tooltip显示异常
              };
              linkDataArray.push(link);
            } else {
              const link = {
                from: path.get(j).data.key,
                to: path.get(k).data.key,
                category,
                direction,
                dataFlowErrorMsg: '', // 必须加上，否则tooltip显示异常
              };
              linkDataArray.push(link);
            }
          }
          j = k;
          k += 1;
        }
      }
    }
    this.setState({ linkDataArray });
    this.refreshGroups(direction);
    analysisDiagram.commitTransaction('Refresh Nodes');
  };

  /**
   * 从最下级节点开始，向上遍历（BFS），设置各级分组节点显示状态
   */
  refreshGroups = direction => {
    const { analysisDiagram } = this.state;
    const queue = [];
    analysisDiagram.nodes.each(eltNode => {
      if (eltNode.data.category === 'ElementNode' && eltNode.data.direction === direction)
        // 最下级节点入队
        queue.unshift(eltNode);
    });
    while (queue.length > 0) {
      const self = queue.pop();
      const groupId = self.data.group;
      if (groupId) {
        const parent = analysisDiagram.findNodeForKey(groupId);
        // 父节点入队
        queue.unshift(parent);
        const siblings = [];
        parent.memberParts.each(member => {
          siblings.push(member);
        });
        if (self.visible) {
          // 本节点显示，父节点必显示
          parent.visible = true;
        } else {
          // 判断同级节点中是否有显示的节点
          let visible = false;
          for (let i = 0; i < siblings.length; i += 1) {
            if (siblings[i].visible) {
              visible = true;
              break;
            }
          }
          parent.visible = visible;
        }
        // 队列中移除同级节点
        const siblingKeySet = {};
        for (let i = 0; i < siblings.length; i += 1) {
          siblingKeySet[siblings[i].data.key] = true;
        }
        for (let i = queue.length - 1; i >= 0; i -= 1) {
          if (siblingKeySet[queue[i].data.key]) queue.splice(i, 1);
        }
      }
    }
  };

  /**
   * 获取节点的连接线
   * @param node
   * @returns {go.Iterator<go.Link>}
   */
  getLinkedLinks = node => {
    if (node.data.direction === 'left') {
      return node.findLinksConnected();
    }
    return node.findLinksConnected();
  };

  /**
   * 是否显示业务术语
   * @param e
   */
  showTermOnChange = e => {
    const { analysisDiagram, elementNodesData } = this.state;
    if (!elementNodesData || elementNodesData.length === 0) return;
    for (let i = 0; i < elementNodesData.length; i += 1) {
      const curCenterNode = analysisDiagram.findNodeForKey(elementNodesData[i].key);
      if (curCenterNode) {
        const termObj = curCenterNode.findObject('Terms');
        if (
          termObj &&
          curCenterNode.data.termElements &&
          curCenterNode.data.termElements.length > 0
        ) {
          termObj.visible = e.target.checked;
        }
      }
    }
    this.setState({ showTermTag: e.target.checked });
  };

  initTermOnChange = () => {
    const { analysisDiagram, elementNodesData, showTermTag } = this.state;
    if (analysisDiagram && elementNodesData && elementNodesData.length > 0) {
      for (let i = 0; i < elementNodesData.length; i += 1) {
        const curCenterNode = analysisDiagram.findNodeForKey(elementNodesData[i].key);
        if (curCenterNode) {
          const termObj = curCenterNode.findObject('Terms');
          if (
            termObj &&
            curCenterNode.data.termElements &&
            curCenterNode.data.termElements.length > 0
          ) {
            termObj.visible = showTermTag;
          }
        }
      }
    }

    let hasDataPreviewOk = true;
    if(elementNodesData && elementNodesData.length > 0){
      elementNodesData.forEach(item => {
        if (!item.dataSourceElement) {
          hasDataPreviewOk = false;
        }
      });
    }

    if (hasDataPreviewOk) {
      return (
        <div>
          <a onClick={() => this.importPicture()} style={{ 'margin-right': '20px' }}>
            导出图片
          </a>
          <a onClick={() => this.handleDataPreviewOk()} style={{ 'margin-right': '20px' }}>
            数据预览
          </a>
          <Checkbox checked={showTermTag} onChange={this.showTermOnChange}>
            展现业务术语
          </Checkbox>
        </div>
      );
    }

    return (
      <div>
        <a onClick={() => this.importPicture()} style={{ 'margin-right': '20px' }}>
          导出图片
        </a>
        <Checkbox checked={showTermTag} onChange={this.showTermOnChange}>
          展现业务术语
        </Checkbox>
      </div>
    );
  };

  /**
   * 导出为图片
   */
  importPicture = () => {
    const { analysisDiagram } = this.state;
    const img = analysisDiagram.makeImage({ scale: 1, background: 'white' });
    const url = img.src;
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month =
      nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
    const dateStr = year + month + day;
    a.download = '血缘与影响分析' + dateStr;
    a.href = url;
    a.dispatchEvent(event);
  };

  handleDataPreviewOk = () => {
    const { nodeDataArray } = this.state;
    const tableList = [];
    nodeDataArray.forEach(node => {
      if (node.type === 'Table') {
        tableList.push({
          id: node.id,
          code: node.code,
          name: node.name,
          type: node.type,
          typeName: node.typeName,
        });
      }
    });
    this.setState({
      dataPreview: true,
      tableList,
    });
  };

  handleDataPreviewCancel = () => {
    this.setState({
      dataPreview: false,
    });
  };

  /**
   * 获取血缘影响分析页面
   * @returns {string|*}
   */
  getAnalysisDiagram = () => {
    const percentSelects = (
      <Menu>
        <Menu.Item>
          <a target="_blank" onClick={() => this.setDiagramPercent('2', '200%')}>
            200%
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" onClick={() => this.setDiagramPercent('1', '100%')}>
            100%
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" onClick={() => this.setDiagramPercent('0.5', '50%')}>
            50%
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" onClick={() => this.setDiagramPercent('0.1', '10%')}>
            10%
          </a>
        </Menu.Item>
      </Menu>
    );
    const {
      nodeDataArray,
      linkDataArray,
      currentPercent,
      currentPercentValue,
      maxLeftLevel,
      maxRightLevel,
      leftLevel,
      rightLevel,
    } = this.state;
    const { elementId } = this.props;
    const model = {
      nodeDataArray,
      linkDataArray,
    };
    const { pageLoading } = this.props;
    if (nodeDataArray && nodeDataArray.length > 0) {
      return (
        <Spin spinning={pageLoading}>
          <div>
            <div className={styles.toolbar}>
              <Row>
                <Col span={4}>
                  <Row>
                    <Col span={6}>
                      <span className={styles.toolbarSliderTitle}>血缘: </span>
                    </Col>
                    <Col span={18}>
                      <Slider
                        key="leftToolbarSlider"
                        className={styles.toolbarSlider}
                        onChange={this.leftLevelOnChange}
                        value={leftLevel}
                        max={maxLeftLevel}
                        min={0}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={1} />
                <Col span={4}>
                  <Col span={6}>
                    <span className={styles.toolbarSliderTitle}>影响: </span>
                  </Col>
                  <Col span={18}>
                    <Slider
                      key="rightToolbarSlider"
                      className={styles.toolbarSlider}
                      onChange={this.rightLevelOnChange}
                      value={rightLevel}
                      max={maxRightLevel}
                      min={0}
                    />
                  </Col>
                </Col>
                <Col span={15}>
                  <div style={{ float: 'right' }}>{this.initTermOnChange()}</div>
                </Col>
              </Row>
            </div>
            <div className={styles.diagramContainer}>
              <GojsDiagram
                diagramId={elementId + 'Analysis'}
                createDiagram={this.initDiagram}
                className="myAnalysisDiagram"
                model={model}
              />
              <div className={styles.toolContainer}>
                <Row>
                  <Col span={10} />
                  <Col span={8}>
                    <Row className={styles.percentContainer}>
                      <Col span={5}>
                        <Dropdown overlay={percentSelects} placement="topCenter">
                          <Button style={{ marginTop: '3px', border: 0, width: '100%' }}>
                            {currentPercent}
                            <Icon type="down" />
                          </Button>
                        </Dropdown>
                      </Col>
                      <Col span={19}>
                        <Slider
                          defaultValue={50}
                          value={currentPercentValue}
                          max={100}
                          min={5}
                          tipFormatter={this.formatterPercent}
                          onChange={this.percentOnChange}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6}>
                    <div className={styles.overviewContainer}>
                      <div>小地图</div>
                      <div
                        id={elementId + '_analysisOverview'}
                        className={styles.analysisDiagramOverview}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Spin>
      );
    }
    return '';
  };

  /**
   * 百分比变化事件
   * @param value
   */
  percentOnChange = value => {
    const { analysisDiagram } = this.state;
    analysisDiagram.scale = parseFloat((value * 2) / 100);
    const percent = `${value * 2}%`;
    this.setState({ currentPercent: percent });
    this.setState({ currentPercentValue: value });
  };

  /**
   * 百分比格式化
   * @param value
   * @returns {string}
   */
  formatterPercent = value => {
    const percent = `${value * 2}%`;
    return percent;
  };

  /**
   * 设置GoJS百分比
   * @param num
   * @param percent
   */
  setDiagramPercent = (num, percent) => {
    const { analysisDiagram } = this.state;
    analysisDiagram.scale = parseFloat(num);
    this.setState({ currentPercent: percent });
    const value = num * 50;
    this.setState({ currentPercentValue: value });
  };

  /**
   * 设置表格中的搜索样式+事件
   * @param dataIndex
   * @returns {{filterDropdown: (function({setSelectedKeys: *, selectedKeys?: *, confirm?: *, clearFilters?: *}): *), filterIcon: (function(*): *), onFilter: (function(*, *): boolean), onFilterDropdownVisibleChange: onFilterDropdownVisibleChange}}
   */
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="搜索名称"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, clearFilters)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, clearFilters)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  /**
   * 表格搜索事件
   * @param selectedKeys
   * @param confirm
   */
  handleSearch = (selectedKeys, confirm, clearFilters) => {
    this.setState({ clearFilters });
    confirm();
  };

  /**
   * 表格搜索重置事件
   * @param clearFilters
   */
  handleReset = clearFilters => {
    clearFilters();
  };

  /**
   * 取消添加列
   */
  addTableOnCancel = () => {
    const { clearFilters } = this.state;
    if (clearFilters) {
      clearFilters();
    }
    this.setState({ addTableVisible: false });
  };

  /**
   * 确定添加列
   */
  addTableOnOk = () => {
    const { selectedRowKeys, centerElementColumnData } = this.state;
    if (
      selectedRowKeys &&
      selectedRowKeys.length > 0 &&
      selectedRowKeys.length !== centerElementColumnData.length
    ) {
      const { dispatch } = this.props;
      dispatch({
        type: 'mmAssets/analyseElementLineage',
        payload: {
          centerElementIds: selectedRowKeys,
        },
      }).then(graphData => {
        this.reloadPage(graphData, 'fromCurrentPage', 'showBothBtn');
      });
      const { clearFilters } = this.state;
      if (clearFilters) {
        clearFilters();
      }
      this.setState({ addTableVisible: false });
      message.success('操作成功!');
    } else {
      message.warn('请至少选择一条资产记录!');
    }
  };

  /**
   * 复选框变化事件
   * @param selectedRowKeys
   */
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const {
      addTableVisible,
      selectedRowKeys,
      ownedColumnElementDatas,
      dataPreview,
      tableList,
    } = this.state;
    const { elementId } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '注释',
        dataIndex: 'description',
        render: text => {
          if (text) {
            return text;
          }
          return '-';
        },
      },
      {
        title: '业务术语',
        dataIndex: 'termElements',
        render: text => {
          if (text && text.length > 0) {
            // 非空判断
            if (text[0]) {
              let terms = text[0].name;
              for (let i = 1; i < text.length; i += 1) {
                terms = terms + ', ' + text[i].name;
              }
              return terms;
            }
          }
          return '-';
        },
      },
    ];
    return (
      <Fragment>
        <div id="assetAnalysisContent" className={styles.assetAnalysisContent}>
          {this.getAnalysisDiagram()}
        </div>
        <Modal
          maskClosable={false}
          key={elementId}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>添加列信息</div>
          }
          centered
          visible={addTableVisible}
          onCancel={this.addTableOnCancel}
          onOk={this.addTableOnOk}
          footer={[
            <Button type="primary" onClick={this.addTableOnOk}>
              确定
            </Button>,
            <Button onClick={this.addTableOnCancel}>取消</Button>,
          ]}
          bodyStyle={{ height: '470px', padding: '15px', overflowY: 'auto' }}
          width="50%"
        >
          <Table
            size="small"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={ownedColumnElementDatas}
            rowKey="id"
            pagination={false}
          />
        </Modal>
        <Modal
          title="数据预览"
          visible={dataPreview}
          onCancel={this.handleDataPreviewCancel}
          footer={null}
          width="70%"
        >
          <DataPreviewView tableList={tableList} />
        </Modal>
      </Fragment>
    );
  }
}

export default AssetAnalysis;
