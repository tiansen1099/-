import React, { Component, Fragment } from 'react';
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  Tree,
} from 'antd';
import { connect } from 'dva';
import FrameBreadcrumb from '@/components/PageBreadcrumb/FrameBreadcrumb';
import SearchTree from '@/components/SearchTree';
import Link from 'umi/link';
import router from 'umi/router';
import styles from '@/pages/Dsd/Glossary/glossaryManagement.less';
import { BookTwoTone, DownOutlined, ProfileTwoTone } from '@ant-design/icons';
import GlossaryAddDialog from '@/pages/Dsd/Glossary/glossaryAddDialog';
import TreeNode from '@/pages/Dm/components/tree/TreeNode';
import DirectoryTree from 'antd/es/tree/DirectoryTree';
import { generateUUID } from '@/utils/Platform/platformUtil';
import { currentUserIsViewRole } from '@/utils/Mm/mmUtils';
import { viewRoleCodes } from '@/mmSettings';
import SubMenu from 'antd/es/menu/SubMenu';
import AssetMainPage from '@/pages/Mm/Assets/assetMainPage';
const { Search } = Input;

// 默认搜索参数
const defaultSearchParam = {
  currentPage: 0,
  pageSize: 10,
  orderCol: '',
  orderDir: '',
  search: '',
  category: '',
};

// 展现视图
const VIEW = 'View';
// 展现分组
const GROUP = 'Group';

@connect(({ loading, mmAssets }) => ({
  tableResultLoading: loading.effects['mmAssets/getViewContains'],
  viewContainData: mmAssets.viewContainData,
}))
class glossaryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operateConfig: {
        assocTermFlag: true,
        maintainAssocFlag: true,
        viewHistoryFlag: true,
        operateBusinessAttrFlag: true,
        operateElementFlag: true,
      },
      currentSearchParam: defaultSearchParam,
      searchValue: '',
      currentPage: 0,
      pageSizeLast: 10,
      isEdit: false,
      selectNodekey: 'root',
      openDialog: false,
      maxOrder: 0,
      clickOperation: '',
      selectedTreeNode: '',
      treeParentId: '1',
      savefirstShow: false,
      cardheight: null,
      editFormData: {},
      treeData: [],
      selectedKeys: [],
      ModalType: '',
      ownerId: '',
      children: [],
      pane: {
        activeKey: '72c833dbdc5643e88373f6f56bffd9c0',
        key: '72c833dbdc5643e88373f6f56bffd9c0',
        title: 'asa',
        type: 'AssetMainPage',
      },
    };
  }

  componentDidMount() {
    this.getGlossary();
    window.addEventListener('resize', this.handleResize);
    const screenheight = window.innerHeight;
    this.setState({ cardheight: screenheight - 100 });
  }

  generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = (d / 16) | 0;
      if (r < 0) {
        r = -r;
      }
      return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
  }

  /**
   * 获取数据词典tree数据
   */
  getGlossary = () => {
    const { dispatch, location } = this.props;
    const {
      query: { selectNodekey },
    } = location;
    dispatch({
      type: 'glossary/getViewContains',
      payload: {
        viewId: 'view10',
      },
    }).then(async res => {
      if (res.code == 200) {
        if (selectNodekey) {
          this.setState({ selectNodekey });
        }
        await this.initViewData(res.data[1]);
      }
    });
  };

  initViewData = async displayViewData => {
    const displayViews = displayViewData;
    if (displayViews && displayViews.length >= 0) {
      // 缓存所有的视图信息
      const allViewData = displayViews;
      // 展现的树数据
      const showedTreeData = [];
      for (const view of displayViews) {
        // 首次展现只展现所有的系统视图
        const treeData = await this.getTreeNodeData(view, allViewData);
        showedTreeData.push(treeData);
      }
      this.setState({ treeData: showedTreeData, selectedKeys: [] });
    }
  };

  getTreeNodeData = async (sourceData, allViewData) => {
    let tType = 'C';
    const treeNode = {};
    // 所有key均配置唯一标识
    treeNode.key = generateUUID();
    treeNode.id = sourceData.id;
    treeNode.value = sourceData.id;
    treeNode.title = this.getTitleWithIcon(sourceData, tType, allViewData);
    treeNode.isLeaf = false;
    treeNode.tType = tType;
    treeNode.data = sourceData;
    treeNode.children = await this.getChildren(sourceData.id);
    treeNode.icon = <BookTwoTone />;
    return treeNode;
  };

  getChildren = async id => {
    const { dispatch } = this.props;
    let tType = GROUP;
    const res = await dispatch({
      type: 'mmAssets/getElementsByOwner',
      payload: {
        ownerId: id,
      },
    });
    if (res != null) {
      const childrenList = [];
      res.forEach(view => {
        const treeNode = {};
        // 所有key均配置唯一标识
        treeNode.key = generateUUID();
        treeNode.id = view.id;
        treeNode.value = view.id;
        treeNode.title = this.getTitleWithIcon(view, tType);
        treeNode.isLeaf = false;
        treeNode.tType = tType;
        treeNode.data = view;
        treeNode.icon = <ProfileTwoTone />;
        treeNode.switcherIcon = null;
        childrenList.push(treeNode);
      });
      return childrenList;
    }
  };

  getTitleWithIcon = (sourceData, tType) => {
    return (
      <Dropdown overlay={this.getTreeMenu(sourceData, tType)} trigger={['contextMenu']}>
        <span style={{ userSelect: 'none' }}>{sourceData.name}</span>
      </Dropdown>
    );
  };

  getTreeMenu = (sourceData, tType) => {
    const { id } = sourceData;
    const { name } = sourceData;
    const { clazz } = sourceData;
    return (
      <Menu>
        {tType === GROUP ? '' : this.getSpecializedAssetCreateMenu(id, tType, clazz)}
        {this.getAssetEditMenu(id)}
        {this.getAssetDeleteMenu(id, name)}
      </Menu>
    );
  };

  /**
   * 获取特定创建元数据菜单
   */
  getSpecializedAssetCreateMenu = (elementId, tType, clazz) => {
    if (tType === 'C') {
      return (
        <SubMenu title={'新建'}>
          {/*<Menu.Item*/}
          {/*  key={elementId}*/}
          {/*  onClick={() => this.showModal(tType, elementId)}*/}
          {/*  title="新建数据词典"*/}
          {/*>*/}
          {/*  新建数据词典*/}
          {/*</Menu.Item>*/}
          <Menu.Item
            onClick={() => this.showModal('Y', elementId)}
            key={elementId}
            title="新建业务术语"
          >
            新建业务术语
          </Menu.Item>
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={elementId} title="新建业务术语">
          新建业务术语
        </Menu.Item>
      );
    }
  };

  getAssetEditMenu = id => {
    return (
      <Menu.Item onClick={() => this.editModal(id)} key={id} title="编辑">
        编辑
      </Menu.Item>
    );
  };

  getAssetDeleteMenu = (id, name) => {
    return (
      <Menu.Item onClick={() => this.deleteModal(id, name)} key={id} title="删除">
        删除
      </Menu.Item>
    );
  };

  generateLists = data => {
    let glossaryList = [];
    let element = data;
    for (let i = 0; i < element.length; i += 1) {
      const node = {
        title: element[i].name,
        key: element[i].id,
        dataRaf: [element[i]],
        children: [],
      };
      // node.children = generateChildren(data[i].id, data);
      glossaryList.push(node);
    }
    this.setState({
      treeData: glossaryList,
    });
  };
  /**
   * 保存新建
   */
  handleCreate = () => {
    const { editFormData, ModalType, ownerId, isEdit } = this.state;
    const { form } = this.formRef.props;
    const { dispatch } = this.props;
    let element;
    if (editFormData.data != null && ModalType === '') {
      element = {
        classId: '2576',
        elementInfo: {
          code: editFormData.data.code,
          customDescription: form.getFieldValue('description'),
          id: editFormData.data.id,
          name: form.getFieldValue('name'),
        },
      };
    } else if (editFormData.data == null && ModalType === '') {
      element = {
        classId: '2576',
        elementInfo: {
          code: this.generateUUID(),
          customDescription: form.getFieldValue('description'),
          id: this.generateUUID(),
          name: form.getFieldValue('name'),
        },
        ownerId: 'view10',
        ownerType: 'View',
      };
    } else if (ModalType != '') {
      element = {
        classId: ModalType === 'C' ? '2576' : '2578',
        elementInfo: {
          code: this.generateUUID(),
          customDescription: form.getFieldValue('description'),
          id: this.generateUUID(),
          name: form.getFieldValue('name'),
        },
        ownerId: ownerId,
        ownerType: 'Asset',
      };
    }

    dispatch({
      type: 'glossary/saveOrUpdateElement',
      payload: {
        element: element,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(isEdit === true ? '编辑成功' : '创建成功');
        this.getGlossary();
        this.handleCancel();
      } else {
        message.error(isEdit === true ? '编辑失败' : '创建失败' + res.msg);
      }
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.ownerElement) {
        return (
          <TreeNode title={item.name} key={item.id} icon={<BookTwoTone />} dataRef={item}>
            {this.renderTreeNodes(item.ownerElement)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} {...item} dataRef={item} />;
    });

  /**
   * 保存表单
   * @param formRef
   */
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  /**
   * 展示新建/修改自定义属性弹出框
   */
  showModal = (tType, id) => {
    if (tType != null && id != null) {
      this.setState({ openDialog: true, isEdit: false, ModalType: tType, ownerId: id });
    } else {
      this.setState({ editFormData: {} });
      this.setState({ openDialog: true, isEdit: false });
    }
  };

  editModal = id => {
    if (id != null) {
      const { dispatch } = this.props;
      dispatch({
        type: 'mmAssets/getElement',
        payload: {
          elementId: id,
        },
      }).then(res => {
        if (res) {
          const formData = {
            data: res,
            name: res.name,
            description: res.customDescription,
          };
          this.setState({
            editFormData: formData,
            isEdit: true,
            openDialog: true,
          });
        }
      });
    }
  };

  deleteModal = (id, name) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '是否确认删除 "' + name + '"',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'mmAssets/deleteElement',
          payload: {
            elementId: id,
          },
        }).then(res => {
          if (res === true) {
            this.getGlossary();
          }
        });
      },
    });
  };

  /**
   * 取消新建
   */
  handleCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({ openDialog: false });
  };

  onRightClick = ({ event, node }) => {};

  render() {
    const {
      openDialog,
      isEdit,
      treeData,
      selectedKeys,
      editFormData,
      pane,
      operateConfig,
    } = this.state;
    return (
      <Fragment>
        <FrameBreadcrumb />
        <div className={styles.indexContent}>
          <div className={styles.contentBodyBackground}>
            <div className={styles.contentBody}>
              <div>
                <Row>
                  <Col span={4}>
                    <div className={styles.leftMenu}>
                      <div className={styles.title}>
                        数据词典
                        <a className={styles.link} onClick={this.showModal}>
                          新建数据词典
                        </a>
                      </div>
                      <div className={styles.searchDiv}>
                        <Search style={{ width: 170 }} placeholder="搜索" />
                      </div>
                      <div className={styles.treeHeight}>
                        <Tree
                          className={styles.treeDiv}
                          showIcon
                          onRightClick={this.onRightClick}
                          selectedKeys={selectedKeys}
                          treeData={treeData}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={20}>
                    <div className={styles.tabContent} style={{ height: 'calc(100% - 40px)' }}>
                      <AssetMainPage
                        pane={pane}
                        elementId={pane.key}
                        tab={'1'}
                        operateConfig={operateConfig}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles.dialogContainer}>
                {openDialog && (
                  <GlossaryAddDialog
                    wrappedComponentRef={this.saveFormRef}
                    visible={openDialog}
                    isEdit={isEdit}
                    glossary={editFormData}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default glossaryManagement;
