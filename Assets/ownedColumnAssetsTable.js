import React, { Component } from 'react';
import { Button, Col, Input, Row, Table, Form, message } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Mm/Assets/assetMainPage.less';
import AssetCreateForm from '@/pages/Mm/Assets/assetCreateForm';
import EditTableCell from '@/pages/Mm/Assets/editTableCell';

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

const { Search } = Input;
// 资产建立下级的OwnerType
const TYPE_ASSET = 'Asset';
const defaultFormData = {
  visible: false,
};
// 封装的创建Asset对话框
const WrappedAssetInCreateForm = Form.create({ name: 'asset_in_create_and_edit_modal' })(
  AssetCreateForm
);

@Form.create()
@connect(({ loading }) => ({
  searchLoading: loading.effects['mmAssets/searchElement'],
}))
class OwnedColumnAssetsTable extends Component {
  state = {
    searchParam: {
      start: 0,
      pageSize: 10,
      orderDir: 'desc',
      showHighlight: false,
      showAggregrations: false,
      search: '',
      searchConditions: [],
      currentPage: 1,
    },
    hasLoading: false,
    currentPage: 0,
    searchResult: null,
    columnAssets: [],
    assetFormData: defaultFormData,
    assetFormLoading: false,
  };

  componentDidMount() {
    const { childProps, ownedClass } = this.props;
    const { elementId } = childProps;
    const { searchParam } = this.state;
    const conditions = searchParam.searchConditions;
    // 添加排除过滤条件
    this.addSearchCondition(
      {
        colName: 'ref.ownerId',
        operator: 'eq',
        colValue: elementId,
        logicalOperator: 'must',
      },
      conditions
    );
    // 添加排除过滤条件
    this.addSearchCondition(
      {
        colName: 'type',
        operator: 'eq',
        colValue: ownedClass.code,
        logicalOperator: 'must',
      },
      conditions
    );
    this.setState({ searchParam });
    this.searchOwnedAssets();
  }

  /**
   * 表格空数据样式
   * @returns {*}
   */
  initEmptyData = () => {
    return <span style={{ color: '#3f4b59' }}>暂无数据</span>;
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

  searchOwnedAssets = () => {
    const { dispatch } = this.props;
    const { searchParam } = this.state;
    dispatch({
      type: 'mmAssets/searchElements',
      payload: {
        searchParam,
      },
    }).then(result => {
      if (result) {
        this.setState({ searchResult: result });
        const { listData } = result;
        let assets;
        if (listData) {
          const temps = JSON.parse(listData);
          assets = temps;
        } else {
          assets = [];
        }
        if (assets && assets.length > 0) {
          const elementIds = [];
          assets.sort((a, b) => {
            let pos1;
            let pos2;
            if (a.attributes) {
              if (a.attributes.position) {
                pos1 = a.attributes.position;
              } else {
                pos1 = 10000;
              }
            } else {
              pos1 = 10000;
            }

            if (b.attributes) {
              if (b.attributes.position) {
                pos2 = b.attributes.position;
              } else {
                pos2 = 10000;
              }
            } else {
              pos2 = 10000;
            }
            return pos1 - pos2;
          });
          assets.forEach(asset => {
            if (asset.id) {
              elementIds.push(asset.id);
            }
          });
          dispatch({
            type: 'mmAssets/getElementDiscoveries',
            payload: {
              elementIds,
            },
          }).then(discoveries => {
            if (discoveries) {
              assets.forEach(asset => {
                const assetTemp = asset;
                discoveries.forEach(discovery => {
                  if (asset.id === discovery.elementId) {
                    assetTemp.elementDiscovery = discovery;
                  }
                });
              });
            }
            // edit by jianghua
            this.setState({ columnAssets: assets });
          });
        } else {
          // edit by jianghua
          this.setState({ columnAssets: assets });
        }
      }
    });
  };

  changePage = (page, pageSize) => {
    this.setState({ currentPage: page });
    const { searchParam } = this.state;
    searchParam.pageSize = pageSize;
    searchParam.start = (page - 1) * pageSize;
    this.setState({ searchParam });
    this.searchOwnedAssets();
  };

  /**
   * 获取表格的分页
   * @param data
   * @returns {{total: (*|number), showTotal: (function(*, *): *), showQuickJumper: boolean, showSizeChanger: boolean}}
   */
  getPaginationProps = data => {
    const { currentPage } = this.state;
    return {
      current: currentPage,
      showQuickJumper: true,
      total: data ? data.iTotalRecords : 0,
      onChange: this.changePage,
      showTotal: (total, range) => {
        return (
          <div className={styles.totalDesc}>
            共 {total} 条 当前显示 {range[1] - range[0] + 1} 条
          </div>
        );
      },
    };
  };

  handleNameSearch = searchValue => {
    const { searchParam } = this.state;
    searchParam.search = '*' + searchValue + '*';
    searchParam.start = 0;
    this.setState({ searchParam, currentPage: 0 });
    this.searchOwnedAssets();
  };

  /**
   * 点击新建资产事件
   * @param ownerType
   * @param ownerId
   * @param clazz
   * @param element
   */
  openCreateAssetModal = (ownerType, ownerId, clazz, element) => {
    const assetFormData = {
      title: '新建 ' + clazz.name,
      ownerType,
      ownerId,
      clazz,
      element,
      visible: true,
    };
    this.setState({ assetFormData });
  };

  /**
   * 取消资产保存/新建
   */
  handleAssetModalCancel = () => {
    const assetFormData = defaultFormData;
    this.setState({ assetFormData });
  };

  /**
   * 保存新建/修改资产
   */
  handleAssetModalCreate = () => {
    const { form } = this.WrappedAssetInCreateForm.props;
    const { assetFormData } = this.state;
    const { childProps } = this.props;
    const { elementId } = childProps;
    const { element } = assetFormData;
    let assetClazz = assetFormData.clazz;
    let elementIdNew = null;
    let isEdit = false;
    // 如果存在element，则是编辑操作
    if (element) {
      elementIdNew = element.id;
      assetClazz = element.clazz;
      isEdit = true;
    }
    const { ownerId } = assetFormData;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { dispatch } = this.props;
      const { refreshTree } = childProps;
      const elementInfo = values;
      elementInfo.id = elementIdNew;
      const paramObject = {
        elementInfo,
        ownerType: assetFormData.ownerType,
        ownerId,
        classId: assetClazz.id,
      };
      this.setState({ assetFormLoading: true });
      dispatch({
        type: 'mmAssets/saveOrUpdateElement',
        payload: {
          paramObject,
        },
      }).then(res => {
        form.resetFields();
        this.setState({ assetFormData: defaultFormData, assetFormLoading: false });
        // 正确保存后，需要刷新树
        if (res && res.code === 200) {
          message.success('入库成功');
          this.searchOwnedAssets();
          if (isEdit) {
            refreshTree('edit', res.data);
          } else {
            res.data.ownerId = elementId;
            refreshTree('create', res.data);
          }
        } else {
          message.error('入库失败：' + res.msg);
        }
      });
    });
  };

  /**
   * 保存资产表单
   * @param formRef
   */
  saveAssetFormRef = formRef => {
    this.WrappedAssetInCreateForm = formRef;
  };

  /**
   *获取表资产的下级列资产值分布信息
   * @param data
   * @returns {string|*}
   */
  getTableValueDistribution = data => {
    if (data !== null && data !== undefined) {
      const { valueDistribution } = data;
      if (
        valueDistribution !== undefined &&
        valueDistribution !== null &&
        valueDistribution !== 'null' &&
        valueDistribution !== ''
      ) {
        const valueDistributionObj = JSON.parse(valueDistribution);
        const { repeatRatio } = valueDistributionObj;
        const { unRepeatRatio } = valueDistributionObj;
        const { nullRatio } = valueDistributionObj;
        return (
          <div className={styles.tableValueDistributionContainer}>
            <div className={styles.tableValueDistributionChar}>
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
            <div className={styles.tableValueDistributionCharCent}>
              <span style={{ color: '#ff525e' }}>{nullRatio}</span>&nbsp;|&nbsp;
              <span style={{ color: '#2c8df4' }}>{repeatRatio}</span>&nbsp;|&nbsp;
              <span style={{ color: '#3f4b59' }}>{unRepeatRatio}</span>
            </div>
          </div>
        );
      }
    }
    return '-';
  };

  /**
   * 获取源数据类型
   * @param record
   * @returns {string|string|*}
   */
  getSourceDataType = record => {
    const dataType = this.getAttributeValue(record.attributes, 'datatype');
    if (dataType === '-') return dataType;
    const length = this.getAttributeValue(record.attributes, 'length');
    let scale = this.getAttributeValue(record.attributes, 'scale');
    const lowerType = dataType.toLowerCase();
    if (lowerType.indexOf('(') > 0 || length === 0) {
      return dataType;
    } else if (lowerType === 'decimal' || lowerType === 'number' || lowerType === 'bigdecimal') {
      if (scale === '-') {
        scale = 0;
      }
      return dataType + '(' + length + ',' + scale + ')';
    }
    return dataType + '(' + length + ')';
  };

  /**
   * 获取特定属性的值
   * @param record
   * @param code
   * @returns {string|*}
   */
  getAttributeValue = (record, code) => {
    const value = record[code];
    if (!value || value === '') {
      return '-';
    }
    return value;
  };

  /**
   * 获取列表格
   * @returns {*}
   */
  getColumnTable = () => {
    const { childProps } = this.props;
    const { assetOnClick } = childProps;
    const { searchResult, columnAssets, hasLoading } = this.state;
    const databaseColumns = [
      {
        title: <div className={styles.tableColumnTitle}>名称</div>,
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text, record) => {
          return <a onClick={() => assetOnClick(record)}>{text}</a>;
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>注释</div>,
        dataIndex: 'description',
        key: 'description',
        width: 150,
        editable: true,
        onCell: record => {
          /**
           * 判断描述是否存在，假如存在则显示描述的内容，否则显示用户自定义描述的内容
           */
          if (!this.isEmpty(record.description)) {
            return {
              record,
              dataIndex: 'description',
              title: '注释',
            };
          }
          return {
            record,
            /**
             * 控制是否显示可编辑单元格的参数,true：显示。false：不显示
             */
            editable: true,
            dataIndex: 'customDescription',
            title: '注释',
            /**
             * 需提供改变完之后的保存方法
             */
            handleSave: this.updateElementCustomDescription,
          };
        },
      },
      {
        title: (
          <div className={styles.tableColumnTitle}>
            <span style={{ color: '#ff525e' }}>空值</span>&nbsp;|&nbsp;
            <span style={{ color: '#2c8df4' }}>重复</span>&nbsp;|&nbsp;
            <span style={{ color: '#3f4b59' }}>非重复</span>
          </div>
        ),
        dataIndex: 'elementDiscovery',
        key: 'valueDistribution',
        width: 350,
        render: text => this.getTableValueDistribution(text),
      },
      {
        title: <div className={styles.tableColumnTitle}>源数据类型</div>,
        dataIndex: 'name',
        key: 'dataType',
        width: 100,
        render: (text, record) => {
          return <span>{this.getSourceDataType(record)}</span>;
        },
      },
      {
        title: <div className={styles.tableColumnTitle}>推测数据类型</div>,
        dataIndex: 'elementDiscovery',
        key: 'inferredDataType',
        width: 150,
        render: text => {
          if (text !== null && text !== undefined) {
            const { inferredDataType } = text;
            if (
              inferredDataType !== undefined &&
              inferredDataType !== null &&
              inferredDataType !== 'null' &&
              inferredDataType !== ''
            ) {
              const inferredDataTypeObject = JSON.parse(inferredDataType);
              if (inferredDataTypeObject) {
                const keys = Object.keys(inferredDataTypeObject);
                if (keys && keys.length > 0) {
                  return keys[0] + ' | ' + inferredDataTypeObject[keys[0]];
                }
              }
            }
          }
          return '-';
        },
      },
    ];

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditTableCell,
      },
    };

    return (
      <Table
        rowKey={record => record.id}
        size="small"
        components={components}
        loading={hasLoading}
        columns={databaseColumns}
        dataSource={columnAssets}
        pagination={this.getPaginationProps(searchResult)}
        locale={{ emptyText: this.initEmptyData() }}
      />
    );
  };

  /**
   * 判断字段是否为空
   * @param obj
   * @returns {boolean}
   */
  isEmpty = obj => {
    return typeof obj === 'undefined' || obj === null || obj === '';
  };

  /**
   * 修改描述
   * @param row
   */
  updateElementCustomDescription = row => {
    const { columnAssets } = this.state;

    const index = columnAssets.findIndex(item => row.id === item.id);
    const item = columnAssets[index];

    /**
     * 判断值是否改变，假如值没有改变则不需要进行请求
     */
    if (item.customDescription !== row.customDescription) {
      const { dispatch } = this.props;

      this.setState({ hasLoading: true });

      const paramObject = {
        id: row.id,
        customDescription: row.customDescription,
      };

      /**
       * 保存数据
       */
      dispatch({
        type: 'mmAssets/updateElementCustomDescription',
        payload: {
          paramObject,
        },
      }).then(res => {
        if (res && res.code === 200) {
          message.success('保存成功');

          /**
           * 请求成功之后刷新页面数据
           */
          this.searchOwnedAssets();

          this.setState({ hasLoading: false });

          /**
           * 请求成功之后刷新树数据
           */
          const { childProps } = this.props;
          const { refreshTree } = childProps;
          refreshTree('edit', res.data);
        } else {
          message.error('保存失败：' + res.msg);
        }
      });
    }
  };

  /**
   * 获取新建按钮
   * @returns {string|*}
   */
  getAddButton = () => {
    const { childProps, ownedClass } = this.props;
    const { operateConfig, elementId, getClassById, assetEditTag } = childProps;
    if (operateConfig.operateElementFlag) {
      return (
        <Button
          style={{
            height: '28px',
            width: '67px',
            padding: '0 10px',
          }}
          type="primary"
          icon="plus"
          onClick={() =>
            this.openCreateAssetModal(TYPE_ASSET, elementId, getClassById(ownedClass.id), null)
          }
          hidden={!assetEditTag}
        >
          新建
        </Button>
      );
    }
    return '';
  };

  render() {
    const { ownedClass } = this.props;
    const { searchResult, assetFormData, assetFormLoading } = this.state;
    if (searchResult) {
      return (
        <div className={styles.otherInfoContainer}>
          <div>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={4}>
                <div>{this.getAddButton()}</div>
              </Col>
              <Col span={10} />
              <Col span={10}>
                <Search
                  placeholder="根据 名称 检索"
                  onSearch={searchValue => {
                    this.handleNameSearch(searchValue);
                  }}
                  style={{ width: '95%' }}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.tableContainer}>{this.getColumnTable(ownedClass)}</div>
          <WrappedAssetInCreateForm
            wrappedComponentRef={this.saveAssetFormRef}
            assetFormData={assetFormData}
            onCancel={this.handleAssetModalCancel}
            onCreate={this.handleAssetModalCreate}
            assetFormLoading={assetFormLoading}
          />
        </div>
      );
    }
    return '';
  }
}

export default OwnedColumnAssetsTable;
