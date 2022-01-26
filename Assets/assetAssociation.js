import React, { Component, Fragment } from 'react';
import { Button, Col, Dropdown, Icon, Menu, Row, Slider, Spin } from 'antd';
import { GojsDiagram } from 'react-gojs';
import * as go from 'gojs';
import { connect } from 'dva';
import { formatDate } from '@/utils/Mm/mmUtils';
import styles from './assetAssociation.less';

const NODE_SIZE = 150;
const $go = go.GraphObject.make;
go.licenseKey =
  '73f043e7b51c28c702d90776423d6bf919a17564cf841fa30a0311f6e8083c06329eeb2b04d3db9382aa4cfe137d94d1ddc1682092480d3ce13583db13e085aab42563b44158418ef65327d189f92ba1f46773edc5';

@connect(({ loading }) => ({
  pageLoading: loading.effects['mmAssets/analyseElementAssociation'],
}))
class AssetAssociation extends Component {
  state = {
    associationDiagram: null,
    nodeDataArray: [],
    linkDataArray: [],
    currentPercent: '100%',
    assocDiagramOverview: null,
    centerNodeData: null,
    currentPercentValue: 50,
  };

  componentDidMount() {
    this.analyseAssetAssociation();
  }

  /**
   * 获取关联分析数据
   */
  analyseAssetAssociation = () => {
    const { elementId } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/analyseElementAssociation',
      payload: {
        elementId,
      },
    }).then(graphData => {
      this.init(graphData);
    });
  };

  /**
   * 初始化数据
   * @param graphData
   */
  initDiagramData = graphData => {
    const nodeDataArray = [];
    const linkDataArray = [];
    const typeMap = {};
    if (graphData) {
      const centerNodeData = this.createRSNodeData(graphData.centerElement);
      centerNodeData.category = 'CenterNode';
      nodeDataArray.push(centerNodeData);
      this.setState({ centerNodeData });
      const refElts = graphData.refElements;
      if (refElts != null) {
        for (let i = 0; i < refElts.length; i += 1) {
          const nodeData = this.createRSNodeData(refElts[i]);
          let typeArr = typeMap[nodeData.typeName];
          if (!typeArr) {
            typeArr = [];
            typeMap[nodeData.typeName] = typeArr;
          }
          typeArr.push(nodeData);
        }
      }
      const keys = Object.keys(typeMap);
      keys.map(key => {
        const arr = typeMap[key];
        for (let i = 0; i < arr.length; i += 1) {
          this.setSmallNodeItemPosition(arr[i], i);
        }
        const groupKey = this.guid();
        const groupData = {
          key: groupKey,
          name: key,
          category: 'TypeNode',
          itemArray: arr,
          allItemArray: arr,
        };
        nodeDataArray.push(groupData);
        linkDataArray.push({
          from: centerNodeData.key,
          to: groupKey,
        });
        return key;
      });
    }
    this.setState({ nodeDataArray });
    this.setState({ linkDataArray });
  };

  /**
   * 将element转化为节点数据
   * @param elt
   */
  createRSNodeData = elt => {
    const data = {};
    data.key = this.guid();
    data.id = elt.id;
    data.name = elt.name;
    data.type = elt.type;
    data.typeName = elt.typeName;
    data.namePath = elt.namePath;
    // eslint-disable-next-line global-require,import/no-dynamic-require
    data.icon = require('@/assets/mm/asset-icons/' +
      elt.icon.substring(elt.icon.lastIndexOf('/') + 1));
    data.modifiedTime = elt.modifiedTime;
    data.description = elt.description;
    return data;
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
   * 初始化页面和数据
   * @param graphData
   */
  init = graphData => {
    const { associationDiagram, assocDiagramOverview } = this.state;
    // 先清空页面
    if (associationDiagram) {
      associationDiagram.clear();
    }
    if (assocDiagramOverview) {
      assocDiagramOverview.clear();
      this.setState({ assocDiagramOverview });
    }
    this.initDiagramData(graphData);
    if (associationDiagram) {
      associationDiagram.requestUpdate(true);
      associationDiagram.startTransaction('Align');
      associationDiagram.contentAlignment = go.Spot.Center;
      associationDiagram.commitTransaction('Align');
      associationDiagram.startTransaction('Cancel Align');
      associationDiagram.contentAlignment = go.Spot.Default;
      associationDiagram.commitTransaction('Cancel Align');
    }
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
              font: 'bold 12px sans-serif',
            },
            new go.Binding('text', 'name')
          )
        ),
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px sans-serif',
            stroke: '#fff',
          },
          new go.Binding('text', 'typeName', data => {
            return '元数据类型：' + data;
          })
        ),
        $go(
          go.TextBlock,
          {
            margin: 5,
            alignment: go.Spot.Left,
            font: '12px sans-serif',
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
            font: '12px sans-serif',
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
            font: '12px sans-serif',
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
   * 布局完成事件
   */
  onCircularLayoutComplete = () => {
    const { associationDiagram, centerNodeData } = this.state;
    if (associationDiagram && centerNodeData) {
      const centerNode = associationDiagram.findNodeForKey(centerNodeData.key);
      if (centerNode) {
        let visibleCount = 0;
        if (associationDiagram.nodes) {
          associationDiagram.nodes.each(node => {
            if (node.category !== 'TypeNode') return true;
            if (node.visible) visibleCount += 1;
            const numTip = node.findObject('NumTip');
            const numTipShape = numTip.findObject('Shape');
            // 左边节点，tip显示在左上角；右边节点，tip显示在右上角
            if (node.location.x <= associationDiagram.layout.actualCenter.x) {
              // 节点在左边
              numTip.alignment = new go.Spot(0, 0, 12, 12);
              numTipShape.angle = 225;
            } else {
              // 节点在右边
              numTip.alignment = new go.Spot(1, 0, -12, 12);
              numTipShape.angle = 315;
            }
            return true;
          });
        }
        if (visibleCount > 1) {
          centerNode.isLayoutPositioned = false;
          centerNode.location = associationDiagram.layout.actualCenter;
        } else {
          centerNode.isLayoutPositioned = true;
        }
      }
      associationDiagram.requestUpdate(true);
      associationDiagram.startTransaction('Align');
      associationDiagram.contentAlignment = go.Spot.Center;
      associationDiagram.commitTransaction('Align');
      associationDiagram.startTransaction('Cancel Align');
      associationDiagram.contentAlignment = go.Spot.Default;
      associationDiagram.commitTransaction('Cancel Align');
      this.setState({ centerNodeData });
    }
  };

  /**
   * 设置大节点位置
   * @param itemData
   * @param i
   */
  setLargeNodeItemPosition = (itemData, i) => {
    const itemDataTemp = itemData;
    itemDataTemp.row = Math.floor(i / 3);
    itemDataTemp.column = i % 3;
  };

  /**
   * 设置小节点位置
   * @param itemData
   * @param i
   */
  setSmallNodeItemPosition = (itemData, i) => {
    const itemDataTemp = itemData;
    itemDataTemp.row = Math.floor(i / 2);
    itemDataTemp.column = i % 2;
  };

  /**
   * 数字提示栏点击事件
   * @param event
   * @param elt
   */
  onNumTipClick = (event, elt) => {
    const { associationDiagram, centerNodeData } = this.state;
    associationDiagram.startTransaction('Resize');
    const node = elt.part;
    const outline = node.findObject('Outline');
    const { itemArray } = node.data;
    if (outline.width === NODE_SIZE) {
      // 放大节点
      outline.desiredSize = new go.Size(400, 400);
      node.isLayoutPositioned = false;
      const centerX = associationDiagram.layout.actualCenter.x;
      const centerY = associationDiagram.layout.actualCenter.y;
      const nodeX = node.location.x;
      const nodeY = node.location.y;
      const r0 = associationDiagram.layout.radius;
      const xD = (nodeX - centerX) * (200 / r0);
      const yD = (nodeY - centerY) * (200 / r0);
      node.location.x += xD;
      node.location.y += yD;
      // 更新内容布局
      for (let i = 0; i < itemArray.length; i += 1) {
        this.setLargeNodeItemPosition(itemArray[i], i);
      }
      node.updateTargetBindings('itemArray');
      associationDiagram.commitTransaction('Resize');
      associationDiagram.zoomToRect(node.actualBounds);
      associationDiagram.scale -= 0.2;
    } else {
      // 还原节点
      outline.desiredSize = new go.Size(NODE_SIZE, NODE_SIZE);
      node.isLayoutPositioned = true;
      // 更新内容布局
      for (let i = 0; i < itemArray.length; i += 1) {
        this.setSmallNodeItemPosition(itemArray[i], i);
      }
      node.updateTargetBindings('itemArray');
      associationDiagram.commitTransaction('Resize');
      associationDiagram.zoomToFit();
      associationDiagram.centerRect(
        associationDiagram.findNodeForKey(centerNodeData.key).actualBounds
      );
    }
    this.setState({ centerNodeData });
  };

  /**
   * 节点双击跳转事件
   * @param e
   * @param node
   */
  assocAssetOnDoubleClick = (e, node) => {
    const { addTab } = this.props;
    const pane = {
      title: node.data.name,
      type: 'AssetMainPage',
      key: node.data.id,
      tab: '3',
    };
    if (addTab) {
      addTab(pane);
    }
  };

  /**
   * 初始化GoJs页面模板
   * @param diagramId
   * @returns {Adornment | Panel | GraphObject | InstanceType<Diagram>}
   */
  initDiagram = diagramId => {
    const { nodeDataArray } = this.state;
    go.Shape.defineFigureGenerator('Display', (shape, w, h) => {
      const geo = new go.Geometry();
      const fig = new go.PathFigure(0.25 * w, 0, true);
      geo.add(fig);

      fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
      fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.75 * w, h, w, 0, w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, h));
      fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h).close());
      geo.spot1 = new go.Spot(0.25, 0);
      geo.spot2 = new go.Spot(0.75, 1);
      return geo;
    });
    const associationDiagram = $go(go.Diagram, diagramId, {
      initialContentAlignment: go.Spot.Center,
      allowCopy: false,
      allowDelete: false,
      // isReadOnly : true,
      'toolManager.hoverDelay': 0,
      'dragSelectingTool.isEnabled': false,
      maxSelectionCount: 1,
      layout: $go(go.CircularLayout, {
        radius: document.getElementById(nodeDataArray[0].id).offsetHeight / 3,
        // spacing: 0,
        nodeDiameterFormula: go.CircularLayout.Circular,
        startAngle: 225,
      }),
      LayoutCompleted: this.onCircularLayoutComplete,
    });

    associationDiagram.nodeTemplateMap.add(
      'TypeNode',
      $go(
        go.Node,
        'Spot',
        {
          // 节点定义
          locationSpot: go.Spot.Center,
          locationObjectName: 'Outline',
          selectionAdorned: false,
        },
        $go(
          go.Panel,
          'Vertical',
          {
            alignment: go.Spot.Top,
            background: null,
          },
          $go(
            go.Panel,
            'Auto',
            $go(go.Shape, 'Circle', {
              // 节点轮廓
              name: 'Outline',
              stroke: '#f6f6f6',
              strokeWidth: 15,
              desiredSize: new go.Size(NODE_SIZE, NODE_SIZE),
              portId: '',
              fill: '#dee1e4',
            }),
            $go(
              go.Panel,
              'Table',
              {
                margin: 4,
                itemTemplate: $go(
                  go.Panel,
                  'Vertical',
                  {
                    doubleClick: this.assocAssetOnDoubleClick,
                    cursor: 'pointer',
                    margin: 3,
                    toolTip: this.getTooltip(),
                  },
                  new go.Binding('row'),
                  new go.Binding('column'),
                  $go(
                    go.Picture,
                    {
                      // 节点图标
                      width: 28,
                      height: 28,
                    },
                    new go.Binding('source', 'icon')
                  ),
                  $go(
                    go.TextBlock,
                    {
                      // 节点名称
                      name: 'ItemName',
                      font: '12px sans-serif',
                      stroke: 'black',
                      isMultiline: false,
                      wrap: go.TextBlock.None,
                      overflow: go.TextBlock.OverflowEllipsis,
                    },
                    new go.Binding('text', 'name'),
                    new go.Binding('maxSize', '', (data, node) => {
                      if (node.part.data.itemArray.length === 1) {
                        return new go.Size(100, NaN);
                      } else if (node.part.findObject('Outline').width !== NODE_SIZE) {
                        return new go.Size(80, NaN);
                      }
                      return new go.Size(45, NaN);
                    }),
                    new go.Binding('margin', '', (data, node) => {
                      if (node.part.findObject('Outline').width !== NODE_SIZE) {
                        return new go.Margin(3.5, 10);
                      }
                      return 2;
                    })
                  )
                ),
              },
              new go.Binding('itemArray'),
              new go.Binding('alignment', '', data => {
                if (data.itemArray.length < 3) {
                  return go.Spot.Center;
                }
                return go.Spot.Top;
              })
            )
          ),
          $go(
            go.TextBlock,
            {
              // 节点名称
              margin: 5,
              stroke: 'black',
              font: 'bold italic 12px sans-serif',
            },
            new go.Binding('text', 'name')
          )
        ),
        $go(
          go.Panel,
          'Auto',
          {
            name: 'NumTip',
            cursor: 'pointer',
            click: this.onNumTipClick,
            mouseEnter: (e, obj) => {
              const objTemp = obj;
              objTemp.findObject('Shape').fill = '#b7e0fb';
            },
            mouseLeave: (e, obj) => {
              const objTemp = obj;
              objTemp.findObject('Shape').fill = '#dee1e4';
            },
          },
          $go(go.Shape, {
            figure: 'Display',
            name: 'Shape',
            desiredSize: new go.Size(23, 17),
            angle: 315,
            stroke: null,
            fill: '#dee1e4',
          }),
          $go(
            go.TextBlock,
            {
              stroke: 'black',
              font: 'bold 12px sans-serif',
            },
            new go.Binding('text', 'itemArray', data => {
              return data.length;
            })
          )
        ),
        $go(
          go.TextBlock,
          {
            text: '显示全部',
            stroke: '#2c8df4',
            font: 'bold 12px sans-serif',
            cursor: 'pointer',
            alignment: new go.Spot(0.5, 1, 0, -60),
          },
          new go.Binding('visible', '', (data, node) => {
            if (node.part.findObject('Outline').width !== NODE_SIZE) {
              return true;
            }
            return false;
          })
        )
      )
    );

    associationDiagram.nodeTemplateMap.add(
      'CenterNode',
      $go(
        go.Node,
        'Vertical',
        {
          // 节点定义
          locationSpot: go.Spot.Center,
          locationObjectName: 'Shape',
          isLayoutPositioned: false,
          cursor: 'pointer',
          selectable: false,
          toolTip: this.getTooltip(),
        },
        $go(
          go.Panel,
          'Auto',
          $go(
            go.Shape,
            'Circle',
            {
              // 节点轮廓
              name: 'Shape',
              stroke: '#b7e0fb',
              strokeWidth: 15,
              desiredSize: new go.Size(80, 80),
              portId: '',
              fill: '#2c8df4',
            },
            new go.Binding('fill', 'color'),
            new go.Binding('desiredSize', 'size')
          ),
          $go(
            go.Picture,
            {
              // 节点图标
              width: 28,
              height: 28,
            },
            new go.Binding('source', 'icon')
          )
        ),
        $go(
          go.TextBlock,
          {
            // 节点名称
            margin: 5,
            stroke: 'black',
            font: '12px sans-serif',
          },
          new go.Binding('text', 'name')
        )
      )
    );

    associationDiagram.linkTemplate = $go(
      go.Link,
      {
        layerName: 'Background',
        selectable: false,
      },
      $go(go.Shape, {
        stroke: '#dee1e4',
        strokeWidth: 2,
      })
    );

    const assocDiagramOverview = $go(go.Overview, nodeDataArray[0].id + '_overview', {
      observed: associationDiagram,
      contentAlignment: go.Spot.Center,
    });
    assocDiagramOverview.box.elt(0).stroke = '#2c8df4';
    assocDiagramOverview.box.elt(0).strokeWidth = 0.5;
    assocDiagramOverview.box.elt(0).fill = 'rgba(28,152,232,0.1)';
    associationDiagram.requestUpdate(true);
    associationDiagram.startTransaction('Align');
    associationDiagram.contentAlignment = go.Spot.Center;
    associationDiagram.commitTransaction('Align');
    associationDiagram.startTransaction('Cancel Align');
    associationDiagram.contentAlignment = go.Spot.Default;
    associationDiagram.commitTransaction('Cancel Align');

    this.setState({ associationDiagram });
    this.setState({ assocDiagramOverview });
    return associationDiagram;
  };

  /**
   * 导出为图片
   */
  importPicture = () => {
    const { associationDiagram } = this.state;
    const img = associationDiagram.makeImage({ scale: 1, background: 'white' });
    const url = img.src;
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month =
      nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
    const dateStr = year + month + day;
    a.download = '关联分析' + dateStr;
    a.href = url;
    a.dispatchEvent(event);
  };

  /**
   * 获取关联分析页面
   * @returns {string|*}
   */
  getAssociationDiagram = () => {
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
    const { nodeDataArray, linkDataArray, currentPercent, currentPercentValue } = this.state;
    const model = {
      nodeDataArray,
      linkDataArray,
    };
    const { pageLoading } = this.props;
    if (nodeDataArray && nodeDataArray.length > 0) {
      return (
        <Spin spinning={pageLoading}>
          <div className={styles.toolbar}>
            <Row>
              <Col span={4} />
              <Col span={1} />
              <Col span={4} />
              <Col span={15}>
                <div style={{ float: 'right' }}>
                  <a onClick={() => this.importPicture()} style={{ 'margin-right': '20px' }}>
                    导出图片
                  </a>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.diagramContainer}>
            <GojsDiagram
              diagramId={nodeDataArray[0].id}
              createDiagram={this.initDiagram}
              className="myAssociationDiagram"
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
                      id={nodeDataArray[0].id + '_overview'}
                      className={styles.assocDiagramOverview}
                    />
                  </div>
                </Col>
              </Row>
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
    const { associationDiagram } = this.state;
    associationDiagram.scale = parseFloat((value * 2) / 100);
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
    const { associationDiagram } = this.state;
    associationDiagram.scale = parseFloat(num);
    const value = num * 50;
    this.setState({ currentPercent: percent });
    this.setState({ currentPercentValue: value });
  };

  render() {
    return (
      <Fragment>
        <div id="assetAssociationContent" className={styles.assetAssociationContent}>
          {this.getAssociationDiagram()}
        </div>
      </Fragment>
    );
  }
}

export default AssetAssociation;
