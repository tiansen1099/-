import React, { Component } from 'react';
import { Button, Col, Input, Row, Table, Tooltip, Modal, Form, message } from 'antd';
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

@connect(({ loading }) => ({
  searchLoading: loading.effects['mmAssets/searchElement'],
}))
class OwnedAssetsTable extends Component {
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
   * 删除下级资产
   * @param elementId
   */
  removeOtherAsset = elementId => {
    const { dispatch, childProps, ownedClass } = this.props;
    const { refreshTree, getClassById } = childProps;
    const clazz = getClassById(ownedClass.id);
    const { searchOwnedAssets } = this;
    Modal.confirm({
      title: '警告',
      content: '是否确认删除该' + clazz.name + '？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'mmAssets/deleteElement',
          payload: {
            elementId,
          },
        }).then(res => {
          if (res) {
            refreshTree('delete', { id: elementId });
            searchOwnedAssets();
          }
        });
      },
    });
  };

  /**
   * 点击修改资产事件
   * @param element
   */
  openEditAssetModal = element => {
    const { childProps, ownedClass } = this.props;
    const { getClassById } = childProps;
    const clazz = getClassById(ownedClass.id);
    const elementTemp = element;
    elementTemp.clazz = clazz;
    const assetFormData = {
      title: '编辑 ' + element.name,
      element: elementTemp,
      visible: true,
    };
    this.setState({ assetFormData });
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

  getTableByType = () => {
    const { childProps } = this.props;
    const { assetOnClick, operateConfig } = childProps;
    const { searchResult, hasLoading } = this.state;
    const columns = [
      {
        title: <div className={styles.tableColumnTitle}>编码</div>,
        dataIndex: 'code',
        width: '150',
        key: 'code',
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>名称</div>,
        dataIndex: 'name',
        width: '150',
        key: 'name',
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: (text, record) => (
          <Tooltip placement="topLeft" title={text}>
            <a onClick={() => assetOnClick(record)}>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>描述</div>,
        dataIndex: 'description',
        width: '250',
        key: 'description',
        onCell: record => {
          /**
           * 判断描述是否存在，假如存在则显示描述的内容，否则显示用户自定义描述的内容
           */
          if (!this.isEmpty(record.description)) {
            return {
              record,
              style: {
                maxWidth: 250,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              },
              dataIndex: 'description',
              title: '注释',
            };
          }
          return {
            record,
            style: {
              maxWidth: 250,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
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
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>路径</div>,
        dataIndex: 'namePath',
        width: '250',
        key: 'namePath',
        onCell: () => {
          return {
            style: {
              maxWidth: 250,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: <div className={styles.tableColumnTitle}>操作</div>,
        dataIndex: 'id',
        width: '100',
        key: 'action',
        render: (id, record) => {
          if (operateConfig.operateElementFlag) {
            if (record.canEdit) {
              return (
                <span>
                  <a onClick={() => this.openEditAssetModal(record)}>编辑</a>
                  &nbsp;&nbsp;
                  <a onClick={() => this.removeOtherAsset(id)}>删除</a>
                </span>
              );
            }
            return (
              <span>
                <Tooltip placement="topLeft" title="自动采集的内容不允许编辑">
                  <a style={{ color: '#7C8B9A', cursor: 'not-allowed' }}>编辑</a>
                </Tooltip>
                &nbsp;&nbsp;
                <Tooltip placement="topLeft" title="自动采集的内容不允许删除">
                  <a style={{ color: '#7C8B9A', cursor: 'not-allowed' }}>删除</a>
                </Tooltip>
              </span>
            );
          }
          return (
            <span>
              <Tooltip placement="topLeft" title="请在资产库中编辑">
                <a style={{ color: '#7C8B9A', cursor: 'not-allowed' }}>编辑</a>
              </Tooltip>
              &nbsp;&nbsp;
              <Tooltip placement="topLeft" title="请在资产库中删除">
                <a style={{ color: '#7C8B9A', cursor: 'not-allowed' }}>删除</a>
              </Tooltip>
            </span>
          );
        },
      },
    ];

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditTableCell,
      },
    };

    const { listData } = searchResult;
    let assets;
    if (listData) {
      const temps = JSON.parse(listData);
      assets = temps;
    } else {
      assets = [];
    }
    return (
      <Table
        rowKey={record => record.id}
        size="small"
        components={components}
        columns={columns}
        dataSource={assets}
        loading={hasLoading}
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
    const { searchResult } = this.state;
    const { listData } = searchResult;

    let assets;
    if (listData) {
      const temps = JSON.parse(listData);
      assets = temps;
    } else {
      assets = [];
    }

    const index = assets.findIndex(item => row.id === item.id);
    const item = assets[index];

    /**
     * 判断值是否改变，假如值没有改变则不需要进行请求
     */
    if (item.customDescription !== row.customDescription) {
      const { dispatch } = this.props;

      const paramObject = {
        id: row.id,
        customDescription: row.customDescription,
      };

      this.setState({ hasLoading: true });

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

  render() {
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
          <div className={styles.tableContainer}>{this.getTableByType()}</div>
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

export default OwnedAssetsTable;
