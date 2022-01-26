import React, { Component, Fragment } from 'react';
import { Button, Col, Input, message, Modal, Popconfirm, Row, Select, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './assetMaintainAssoc.less';

const { Option } = Select;
const { Search } = Input;
const OWNER = 'owner';
const OWNED = 'owned';
const RIGHT = 'right';
const LEFT = 'left';

@connect(({ loading }) => ({
  tableResultLoading: loading.effects['mmAssets/getInitialElementsAndAssociations'],
}))
class AssetMaintainAssoc extends Component {
  state = {
    asset: {},
    currentPage: 0,
    allAssociations: null,
    assetAssociations: null,
    assocType: '',
    associationId: '',
    classId: null,
    assets: null,
    assetList: [],
    classAssetLoading: false,
    selectedRowKeys: [],
    selectedResRowKeys: [],
    assocAssetsResult: [],
    assocAssets: [],
    searchParam: {
      start: 0,
      pageSize: 10,
      orderDir: 'desc',
      showHighlight: false,
      showAggregrations: false,
      search: '',
      searchConditions: [],
    },
    deleteBtnDisabled: true,
    addBtnDisabled: true,
    searchValue: '',
    elementAssociations: [],
  };

  componentWillMount() {
    const { asset } = this.props;
    this.setState({ asset });
    this.initPage(asset);
  }

  initPage = asset => {
    const { clazz } = asset;
    const { associations } = clazz;
    this.setState({ assetAssociations: associations });
    if (asset.id && associations) {
      const ownerAssocs = [];
      const ownedAssocs = [];
      const leftAssocs = [];
      const rightAssocs = [];
      associations.forEach(association => {
        // 聚合关系
        if (association.aggregate) {
          // 如果源和目标一样（自聚合）
          if (
            association.fromClass.id === association.toClass.id &&
            association.fromClass.id === clazz.id
          ) {
            ownerAssocs.push(association);
            ownedAssocs.push(association);
          } else if (association.fromClass.id === clazz.id) {
            ownerAssocs.push(association);
          } else {
            ownedAssocs.push(association);
          }
        }
        // 关联关系
        else {
          // 如果源和目标一样（自关联）
          // eslint-disable-next-line no-lonely-if
          if (
            association.fromClass.id === association.toClass.id &&
            association.fromClass.id === clazz.id
          ) {
            rightAssocs.push(association);
            leftAssocs.push(association);
          } else if (association.fromClass.id === clazz.id) {
            rightAssocs.push(association);
          } else {
            leftAssocs.push(association);
          }
        }
      });
      const allAssociations = {};
      allAssociations[OWNER] = ownerAssocs;
      allAssociations[OWNED] = ownedAssocs;
      allAssociations[LEFT] = leftAssocs;
      allAssociations[RIGHT] = rightAssocs;
      this.setState({ allAssociations });
    }
    if (asset.id) {
      this.getAssetsAndAssocs(asset.id);
    }
  };

  getAssetById = elementId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElement',
      payload: {
        elementId,
      },
    }).then(element => {
      if (element) {
        const { classId } = this.state;
        this.setState({ asset: element });
        if (classId) {
          this.searchAssets();
        }
      }
    });
  };

  getAssetsAndAssocs = elementId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getInitialElementsAndAssociations',
      payload: {
        elementId,
      },
    }).then(initialElementsAndAssociations => {
      if (initialElementsAndAssociations) {
        const { elements } = initialElementsAndAssociations;
        const { elementAssociations } = initialElementsAndAssociations;
        const { searchValue } = this.state;
        let assocAssets;
        if (!searchValue || searchValue === '') {
          if (elements.length > 200) {
            assocAssets = elements.slice(0, 200);
          } else {
            assocAssets = elements;
          }
        } else {
          assocAssets = elements.filter(assocAsset => {
            return assocAsset.name.indexOf(searchValue) !== -1;
          });
          if (!assocAssets) {
            assocAssets = [];
          }
          if (assocAssets.length > 200) {
            assocAssets = assocAssets.slice(0, 200);
          }
        }
        this.completeElementWithAssoc(assocAssets, elementAssociations);
        this.setState({ assocAssets, assocAssetsResult: elements, elementAssociations });
      }else{
        this.setState({ assocAssets:[],assocAssetsResult:[],elementAssociations:[]});
      }
    });
  };

  completeElementWithAssoc = (elements, elementAssociations) => {
    elements.forEach(element => {
      const elementTemp = element;
      const elementId = element.id;
      const association = elementAssociations.find(
        elementAssociationTemp =>
          elementAssociationTemp.fromElementId === elementId ||
          elementAssociationTemp.toElementId === elementId
      );
      if (association) {
        elementTemp.associationId = association.associationId;
        if (association.fromElementId === elementId) {
          if (association.aggregate === true) {
            // 聚合关系，补充表格属性
            elementTemp.relationType = OWNED;
          } else {
            // 右关联关系，补充表格属性
            elementTemp.relationType = LEFT;
          }
        } else if (association.aggregate === true) {
          // 被聚合关系，补充表格属性
          elementTemp.relationType = OWNER;
        } else {
          // 左关联关系，补充表格属性
          elementTemp.relationType = RIGHT;
        }
      }
    });
  };

  searchAssets = () => {
    const { dispatch } = this.props;
    const { asset, assocType } = this.state;
    const { associations } = asset;
    const assetIds = [];
    if (associations && associations.length > 0) {
      associations.forEach(association => {
        if (assocType === OWNER) {
          if (association.fromElementId === asset.id && association.aggregate) {
            assetIds.push(association.toElementId);
          }
        } else if (assocType === OWNED) {
          if (association.toElementId === asset.id && association.aggregate) {
            assetIds.push(association.fromElementId);
          }
        } else if (assocType === LEFT) {
          if (association.toElementId === asset.id && !association.aggregate) {
            assetIds.push(association.fromElementId);
          }
        } else if (assocType === RIGHT) {
          if (association.fromElementId === asset.id && !association.aggregate) {
            assetIds.push(association.toElementId);
          }
        }
      });
    }
    assetIds.push(asset.id);
    this.setState({ classAssetLoading: true });
    const { searchParam } = this.state;
    const conditions = searchParam.searchConditions;
    // 添加排除过滤条件
    this.addSearchCondition(
      {
        colName: 'id',
        operator: 'in',
        colValue: assetIds,
        logicalOperator: 'must_not',
      },
      conditions
    );
    dispatch({
      type: 'mmAssets/searchElements',
      payload: {
        searchParam,
      },
    }).then(assets => {
      if (assets) {
        this.setState({ classAssetLoading: false });
        const { listData } = assets;
        if (listData) {
          const temps = JSON.parse(listData);
          const assetList = temps;
          this.setState({ assetList });
          this.setState({ assets });
        }
      }
    });
  };

  onAssocModelChange = associationId => {
    this.setState({ associationId });
    const { assetAssociations, assocType } = this.state;
    if (assetAssociations) {
      const association = assetAssociations.find(
        associationTemp => associationTemp.id === associationId
      );
      let classCode;
      let classId;
      if (assocType === OWNER || assocType === RIGHT) {
        classCode = association.toClass.code;
        classId = association.toClass.id;
      } else {
        classCode = association.fromClass.code;
        classId = association.fromClass.id;
      }
      const { searchParam } = this.state;
      const { searchConditions } = searchParam;
      // 添加类型过滤条件
      this.addSearchCondition(
        {
          colName: 'type',
          operator: 'eq',
          colValue: classCode,
          logicalOperator: 'must',
        },
        searchConditions
      );
      this.setState({ searchParam, classId });
      this.searchAssets();
    }
  };

  /**
   * 添加类型过滤条件
   * @param type
   * @param searchConditions
   */
  addSearchCondition = (condition, searchConditions) => {
    // 找到已有的检索条件做更新
    const searchCondition = searchConditions.find(
      temp =>
        temp.colName === condition.colName &&
        temp.operator === condition.operator &&
        temp.logicalOperator === condition.logicalOperator
    );
    if (searchCondition == null) {
      searchConditions.push(condition);
    } else {
      searchCondition.colValue = condition.colValue;
    }
  };

  handleAssocSearch = searchValue => {
    const { searchParam } = this.state;
    searchParam.search = searchValue;
    searchParam.start = 0;
    const { classId } = this.state;
    if (!classId) {
      message.warn('请选择匹配的元模型！');
      return;
    }
    this.setState({ searchParam, currentPage: 0 });
    this.searchAssets();
  };

  onAssocTypeChange = assocType => {
    this.setState({ assocType, associationId: undefined, assets: [], assetList: [] });
  };

  /**
   * 分页变化
   * @param page, pageSize
   */
  changePage = (page, pageSize) => {
    this.setState({ currentPage: page });
    const { searchParam } = this.state;
    searchParam.pageSize = pageSize;
    searchParam.start = (page - 1) * pageSize;
    this.setState({ searchParam });
    this.searchAssets();
  };

  getModelAssocSelect = () => {
    const { allAssociations, assocType, associationId } = this.state;
    if (allAssociations) {
      const associations = allAssociations[assocType];
      if (associations) {
        if (assocType === OWNER || assocType === RIGHT) {
          return (
            <Select
              style={{ width: '95%' }}
              placeholder="请选择匹配的元模型"
              value={associationId}
              onChange={this.onAssocModelChange}
            >
              {associations.map(association => {
                if (association.toClass.name === 'nolimit') {
                  return '';
                }
                return <Option key={association.id}>{association.toClass.name}</Option>;
              })}
            </Select>
          );
        }
        return (
          <Select
            style={{ width: '95%' }}
            placeholder="请选择匹配的元模型"
            value={associationId}
            onChange={this.onAssocModelChange}
          >
            {associations.map(association => {
              if (association.fromClass.name === 'nolimit') {
                return '';
              }
              return <Option key={association.id}>{association.fromClass.name}</Option>;
            })}
          </Select>
        );
      }
    }
    return (
      <Select
        style={{ width: '95%' }}
        placeholder="请选择匹配的元模型"
        onChange={this.onAssocModelChange}
      />
    );
  };

  assocsAddBtnOnClick = () => {
    const { selectedRowKeys, assocType, associationId, asset } = this.state;
    const { dispatch } = this.props;
    if (asset.id && selectedRowKeys && selectedRowKeys.length > 0) {
      const associations = [];
      this.setState({ addBtnDisabled: true });
      selectedRowKeys.forEach(selectedRowKey => {
        const association = {};
        association.associationId = associationId;
        if (assocType === OWNER || assocType === RIGHT) {
          association.fromElementId = asset.id;
          association.toElementId = selectedRowKey;
        } else {
          association.fromElementId = selectedRowKey;
          association.toElementId = asset.id;
        }
        associations.push(association);
      });
      const changedAssociations = {};
      changedAssociations.saved = associations;
      dispatch({
        type: 'mmAssets/changeAssociations',
        payload: {
          changedAssociations,
        },
      }).then(() => {
        this.setState({ selectedRowKeys: [] });
        this.getAssetById(asset.id);
        this.getAssetsAndAssocs(asset.id);
      });
    }
  };

  assocsDeleteBtnOnClick = () => {
    const { selectedResRowKeys, assocAssets, asset } = this.state;
    const { dispatch } = this.props;
    if (asset.id && selectedResRowKeys && selectedResRowKeys.length > 0) {
      const associations = [];
      this.setState({ deleteBtnDisabled: true });
      selectedResRowKeys.forEach(selectedRowKey => {
        const assocAsset = assocAssets.find(assocAssetTemp => assocAssetTemp.id === selectedRowKey);
        if (assocAsset) {
          const association = {};
          association.associationId = assocAsset.associationId;
          if (assocAsset.relationType === OWNER || assocAsset.relationType === RIGHT) {
            association.fromElementId = asset.id;
            association.toElementId = selectedRowKey;
          } else {
            association.fromElementId = selectedRowKey;
            association.toElementId = asset.id;
          }
          associations.push(association);
        }
      });
      if (associations && associations.length > 0) {
        const changedAssociations = {};
        changedAssociations.deleted = associations;
        dispatch({
          type: 'mmAssets/changeAssociations',
          payload: {
            changedAssociations,
          },
        }).then(() => {
          this.setState({ selectedResRowKeys: [] });
          this.getAssetById(asset.id);
          this.getAssetsAndAssocs(asset.id);
        });
      }
    }
  };

  getAssocSelectContainer = () => {
    const { allAssociations, addBtnDisabled } = this.state;
    if (allAssociations) {
      return (
        <Row>
          <Col span={6}>
            <Select
              style={{ width: '95%' }}
              placeholder="请选择关联类型"
              onChange={this.onAssocTypeChange}
            >
              <Option key={OWNER}>聚合</Option>
              <Option key={OWNED}>被聚合</Option>
              <Option key={LEFT}>左关联</Option>
              <Option key={RIGHT}>右关联</Option>
            </Select>
          </Col>
          <Col span={7}>{this.getModelAssocSelect()}</Col>
          <Col span={8}>
            <Search
              placeholder="根据 名称 检索资产"
              onSearch={searchValue => {
                this.handleAssocSearch(searchValue);
              }}
              style={{ width: '95%' }}
            />
          </Col>
          <Col span={3}>
            <Button
              style={{ float: 'right' }}
              type="primary"
              disabled={addBtnDisabled}
              onClick={() => this.assocsAddBtnOnClick()}
            >
              添加
            </Button>
          </Col>
        </Row>
      );
    }
    return '';
  };

  /**
   * 复选框变化事件
   * @param selectedRowKeys
   */
  onSelectChange = selectedRowKeys => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      this.setState({ addBtnDisabled: true });
    } else {
      this.setState({ addBtnDisabled: false });
    }
    this.setState({ selectedRowKeys });
  };

  getClassAssets = () => {
    const { assets, assetList, currentPage, classAssetLoading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: <div className={styles.tableColumnTitle}>资产名称</div>,
        dataIndex: 'name',
        key: 'name',
        onCell: () => {
          return {
            style: {
              maxWidth: 200,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: text => {
          let temp = text.replace('<span style="color:red">', '');
          temp = temp.replace('</span>', '');
          return (
            <Tooltip placement="bottomLeft" title={temp}>
              {temp}
            </Tooltip>
          );
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>资产类型</div>,
        dataIndex: 'typeName',
        key: 'typeName',
        render: text => (
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>资产路径</div>,
        dataIndex: 'namePath',
        key: 'namePath',
        onCell: () => {
          return {
            style: {
              maxWidth: 200,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: text => (
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
    ];
    const paginationProps = {
      current: currentPage,
      showQuickJumper: true,
      total: assets ? assets.iTotalRecords : 0,
      onChange: this.changePage,
      showTotal: (total, range) => {
        return (
          <div className={styles.totalDesc}>
            共 {total} 条 当前显示 {range[1] - range[0] + 1} 条
          </div>
        );
      },
    };
    return (
      <Table
        tableLayout="fixed"
        rowKey={record => record.id}
        size="small"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={assetList}
        pagination={paginationProps}
        loading={classAssetLoading}
      />
    );
  };

  getAssocTypeByAssoc = record => {
    if (record.relationType) {
      if (record.relationType === OWNER) {
        return '聚合';
      }
      if (record.relationType === OWNED) {
        return '被聚合';
      }
      if (record.relationType === LEFT) {
        return '左关联';
      }
      if (record.relationType === RIGHT) {
        return '右关联';
      }
    }
    return '';
  };

  onResSelectChange = selectedResRowKeys => {
    if (!selectedResRowKeys || selectedResRowKeys.length === 0) {
      this.setState({ deleteBtnDisabled: true });
    } else {
      this.setState({ deleteBtnDisabled: false });
    }
    this.setState({ selectedResRowKeys });
  };

  handleTableSearch = searchValue => {
    this.setState({ searchValue });
    const { assocAssetsResult, elementAssociations } = this.state;
    let assocAssets = assocAssetsResult.filter(assocAsset => {
      return assocAsset.name.indexOf(searchValue) !== -1;
    });

    if (assocAssets) {
      if (assocAssets.length > 200) {
        assocAssets = assocAssets.slice(0, 200);
      }
      this.completeElementWithAssoc(assocAssets, elementAssociations);
      this.setState({ assocAssets });
    } else {
      this.setState({ assocAssets: [] });
    }
  };

  getAssocResult = () => {
    const { assocAssets, selectedResRowKeys, deleteBtnDisabled } = this.state;
    const { tableResultLoading } = this.props;
    const rowSelection = {
      selectedResRowKeys,
      onChange: this.onResSelectChange,
    };
    const columns = [
      {
        title: <div className={styles.tableColumnTitle}>关联类型</div>,
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        render: (text, record) => this.getAssocTypeByAssoc(record),
      },
      {
        title: <div className={styles.tableColumnTitle}>资产名称</div>,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onCell: () => {
          return {
            style: {
              maxWidth: 200,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: text => (
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>资产类型</div>,
        dataIndex: 'typeName',
        key: 'typeName',
        render: text => (
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>资产路径</div>,
        dataIndex: 'namePath',
        key: 'namePath',
        sorter: true,
        onCell: () => {
          return {
            style: {
              maxWidth: 200,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            },
          };
        },
        render: text => (
          <Tooltip placement="bottomLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
    ];
    return (
      <Fragment>
        <div>
          <Row>
            <Col span={14}>
              <div style={{ marginTop: '7px' }}>
                最多展示200条已关联资产，可使用检索功能查询未展示资产
              </div>
            </Col>
            <Col span={7}>
              <Search
                placeholder="根据 名称 检索资产"
                onSearch={searchValue => {
                  this.handleTableSearch(searchValue);
                }}
                style={{ width: '95%' }}
              />
            </Col>
            <Col span={3}>
              <Popconfirm title="确认删除?" onConfirm={() => this.assocsDeleteBtnOnClick()}>
                <Button style={{ float: 'right' }} disabled={deleteBtnDisabled}>
                  删除
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </div>
        <div className={styles.tableContainer}>
          <Row className={styles.tableRow}>
            <Table
              tableLayout="fixed"
              rowKey={record => record.id}
              size="small"
              columns={columns}
              dataSource={assocAssets}
              pagination={false}
              loading={tableResultLoading}
              rowSelection={rowSelection}
            />
          </Row>
        </div>
      </Fragment>
    );
  };

  maintainDialogOnCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      assetList: [],
      assets: [],
      classId: null,
      selectedRowKeys: [],
      selectedResRowKeys: [],
      addBtnDisabled: true,
      deleteBtnDisabled: true,
      currentPage: 0,
      associationId: '',
    });
    onCancel();
  };

  render() {
    const { visible } = this.props;
    return (
      <Fragment>
        <Modal
          maskClosable={false}
          title={
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3f4b59' }}>配置关联</div>
          }
          centered
          visible={visible}
          onCancel={this.maintainDialogOnCancel}
          footer={null}
          bodyStyle={{ height: '550px', padding: '10px', overflowY: 'auto' }}
          width="75%"
          destroyOnClose
        >
          <div className={styles.assetMaintainAssocContent}>
            <Row>
              <Col span={11}>
                {this.getAssocSelectContainer()}
                <div className={styles.tableContainer}>{this.getClassAssets()}</div>
              </Col>
              <Col span={1} />
              <Col span={12}>{this.getAssocResult()}</Col>
            </Row>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default AssetMaintainAssoc;
