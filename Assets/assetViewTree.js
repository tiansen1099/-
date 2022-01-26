import React, { Component } from 'react';
import { Dropdown, Form, Icon, Menu, message, Modal, Tooltip, Tree } from 'antd';
import { connect } from 'dva';
import AssetCreateForm from '@/pages/Mm/Assets/assetCreateForm';
import TemplateImportAsset from '@/pages/Mm/Assets/templateImportAsset';
import { generateUUID, getSessionCache } from '@/utils/Platform/platformUtil';
import template from '@/assets/mm/template/template.zip';
import { viewRoleCodes } from '@/mmSettings';
import { currentUserIsViewRole } from '@/utils/Mm/mmUtils';
import styles from '@/pages/Mm/Assets/asset.less';

const { TreeNode } = Tree;
const { SubMenu } = Menu;
// 展现视图
const VIEW = 'View';
// 展现分组
const GROUP = 'Group';
// 包含的元数据元素
const ASSET = 'Asset';

// 用户视图
const VIEW_TYPE_USER = 'User';
// 系统视图
const VIEW_TYPE_SYSTEM = 'System';

// 创建元数据菜单
let metamodels = null;

// 树菜单
const CONTEXT_MENU_CREATE_ASSET = 'createAsset';
const CONTEXT_MENU_EDIT_ASSET = 'editAsset';
const CONTEXT_MENU_DELETE_ASSET = 'deleteAsset';

// 最大支持的叶子展开数
const MAX_EXPAND_NUM = 200;

// 初始化的元数据操作数据
const defaultFormData = {
  visible: false,
};
// 封装的创建Asset对话框
const WrappedAssetCreateForm = Form.create({ name: 'asset_create_modal' })(AssetCreateForm);

@connect(({ mmAssets }) => ({
  displayViewData: mmAssets.displayViewData,
  viewContainData: mmAssets.viewContainData,
  groupContainData: mmAssets.groupContainData,
}))
class AssetViewTree extends Component {
  state = {
    showedTreeData: [],
    selectedKeys: [],
    assetFormData: defaultFormData,
    allViewData: null,
    importModelVisible: false,
    assetFormLoading: false,
  };

  componentDidMount() {
    this.showSystemViews();
  }

  initViewData = displayViewData => {
    if (!displayViewData) {
      return;
    }
    const displayViews = displayViewData.data;
    if (displayViews && displayViews.length >= 0) {
      // 缓存所有的视图信息
      const allViewData = displayViews;
      // 展现的树数据
      const showedTreeData = [];
      // 隐藏的树数据
      const hidedTreeData = [];
      displayViews.forEach(view => {
        // 首次展现只展现所有的系统视图
        if (view.type === VIEW_TYPE_SYSTEM) {
          showedTreeData.push(this.getTreeNodeData(view, VIEW, allViewData));
        } else if (view.type === VIEW_TYPE_USER) {
          hidedTreeData.push(this.getTreeNodeData(view, VIEW, allViewData));
        }
      });
      // 展现内容默认按seq属性升序排列
      const compare = property => {
        return function(a, b) {
          const value1 = a[property];
          const value2 = b[property];
          return value1 - value2;
        };
      };
      showedTreeData.sort(compare('seq'));
      this.setState({ showedTreeData, hidedTreeData, allViewData, selectedKeys: [] });
    }
  };

  getTreeNodeData = (sourceData, tType, allViewData) => {
    const treeNode = {};
    // 所有key均配置唯一标识
    treeNode.key = generateUUID();
    treeNode.id = sourceData.id;
    treeNode.value = sourceData.id;
    treeNode.title = this.getTitleWithIcon(sourceData, tType, allViewData);
    treeNode.isLeaf = false;
    treeNode.tType = tType;
    treeNode.seq = sourceData.seq;
    treeNode.data = sourceData;
    return treeNode;
  };

  getTitleWithIcon = (sourceData, tType, allViewData) => {
    let iconPath = null;
    let viewId = null;
    let typeName = null;
    if (tType === VIEW) {
      iconPath = 'st.svg';
      viewId = sourceData.id;
      typeName = '视图';
    } else if (tType === GROUP) {
      iconPath = 'fzc.svg';
      // eslint-disable-next-line prefer-destructuring
      viewId = sourceData.viewId;
      typeName = '分组';
    } else if (tType === ASSET) {
      const elmntIcon = sourceData.icon;
      iconPath = elmntIcon.substring(elmntIcon.lastIndexOf('/') + 1);
      // eslint-disable-next-line prefer-destructuring
      typeName = sourceData.typeName;
    }

    let text = sourceData.description;
    if (typeof text === 'undefined' || text === null || text === '') {
      text = sourceData.customDescription;
      if (typeof text === 'undefined' || text === null || text === '') {
        text = '-';
      }
    }

    if (text.length > 50) {
      text = text.substring(0, 50) + '...';
    }

    const tooltipTitle = (
      <div>
        名称：{sourceData.name}
        <br />
        类型：{typeName}
        <br />
        描述：{text}
      </div>
    );
    // 菜单权限控制
    // 只有系统视图、元数据才能进行右键操作
    // 浏览权限判断
    const { currentUser } = this.props;
    const tag = currentUserIsViewRole(currentUser, viewRoleCodes);
    if (
      !tag &&
      (this.validateIsSystemView(viewId, allViewData) ||
        this.validateIsManuallyCreateAsset(tType, sourceData))
    ) {
      return (
        <Dropdown overlay={this.getTreeMenu(sourceData, tType)} trigger={['contextMenu']}>
          <Tooltip placement="bottom" title={tooltipTitle}>
            <span style={{ userSelect: 'none' }}>
              <img
                alt=""
                style={{ height: '18px', width: '18px', marginBottom: '3px', paddingRight: '5px' }}
                /* eslint-disable-next-line global-require,import/no-dynamic-require */
                src={require('@/assets/mm/asset-icons/' + iconPath)}
              />
              {sourceData.name}
            </span>
          </Tooltip>
        </Dropdown>
      );
    }
    return (
      <Tooltip placement="bottom" title={tooltipTitle}>
        <span style={{ userSelect: 'none' }}>
          <img
            alt=""
            style={{ height: '18px', width: '18px', marginBottom: '3px', paddingRight: '5px' }}
            /* eslint-disable-next-line global-require,import/no-dynamic-require */
            src={require('@/assets/mm/asset-icons/' + iconPath)}
          />
          {sourceData.name}
        </span>
      </Tooltip>
    );
  };

  validateIsSystemView = (viewId, allViewData) => {
    if (!viewId) {
      return false;
    }
    let temp = allViewData;
    if (!temp) {
      // eslint-disable-next-line react/destructuring-assignment
      temp = this.state.allViewData;
    }
    if (temp && temp.length > 0) {
      const view = temp.find(item => item.id === viewId);
      if (view && view.type === VIEW_TYPE_SYSTEM) {
        return true;
      }
    }
    return false;
  };

  /**
   * 校验资产是否是手动创建的资产
   * @param tType
   * @param sourceData
   * @returns {boolean}
   */
  validateIsManuallyCreateAsset = (tType, sourceData) => {
    if (tType !== ASSET) {
      return false;
    }
    // 如果没有携带采集唯一标识，则认为是手动配置的
    const { canEdit } = sourceData;
    if (canEdit) {
      return true;
    }
    return false;
  };

  getClassTitle = (iconPath, title) => {
    return (
      <span style={{ userSelect: 'none' }}>
        <img
          alt=""
          style={{ height: '16px', width: '21px', marginBottom: '3px', paddingRight: '5px' }}
          /* eslint-disable-next-line global-require,import/no-dynamic-require */
          src={require('@/assets/mm/asset-icons/' + iconPath)}
        />
        {title}
      </span>
    );
  };

  /**
   * 点击MenuItem进行的操作
   * @param item
   * @param key
   * @param keyPath
   * @param domEvent
   */
  // eslint-disable-next-line no-unused-vars
  onContextMenuClick = ({ item, key, keyPath, domEvent }) => {
    if (key.indexOf('|') > 0) {
      const keyArr = key.split('|');
      const menuType = keyArr[0];
      if (menuType === CONTEXT_MENU_CREATE_ASSET) {
        const classId = keyArr[3];
        this.openCreateAssetModal(keyArr[1], keyArr[2], this.getClassById(classId), null);
      } else if (menuType === CONTEXT_MENU_EDIT_ASSET) {
        this.openEditAssetModal(keyArr[1]);
      } else if (menuType === CONTEXT_MENU_DELETE_ASSET) {
        this.openDeleteAssetModal(keyArr[1], keyArr[2]);
      }
    }
  };

  /**
   * 根据ID获取元模型
   * @param classId
   * @returns {null|*}
   */
  getClassById = classId => {
    if (metamodels) {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const i in metamodels) {
        const pck = metamodels[i];
        const { classes } = pck;
        if (classes) {
          // eslint-disable-next-line guard-for-in,no-restricted-syntax
          for (const j in classes) {
            const clazz = classes[j];
            if (clazz.id === classId) {
              return clazz;
            }
          }
        }
      }
    }
    console.error('未找到匹配的元模型信息，classId=' + classId);
    return null;
  };

  openCreateAssetModal = (ownerType, ownerId, clazz, element) => {
    const assetFormData = {
      title: '新建',
      ownerType,
      ownerId,
      clazz,
      element,
      visible: true,
    };
    this.setState({ assetFormData });
  };

  openEditAssetModal = elementId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElement',
      payload: {
        elementId,
      },
    }).then(element => {
      if (element) {
        const assetFormData = {
          title: '编辑 ' + element.name,
          element,
          visible: true,
        };
        this.setState({ assetFormData });
      }
    });
  };

  openDeleteAssetModal = (elementId, elementName) => {
    const { dispatch } = this.props;
    const { refreshSingle } = this;
    Modal.confirm({
      title: '警告',
      content: '是否确认删除 "' + elementName + '"',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'mmAssets/deleteElement',
          payload: {
            elementId,
          },
        }).then(res => {
          if (res === true) {
            refreshSingle('delete', { id: elementId });
          }
        });
      },
    });
  };

  getTreeMenu = (sourceData, tType) => {
    const { id } = sourceData;
    const { name } = sourceData;
    const { clazz } = sourceData;
    if (tType === VIEW) {
      return (
        <Menu onClick={this.onContextMenuClick}>
          {this.getInitializedAssetCreateMenu(id, tType)}
        </Menu>
      );
    } else if (tType === GROUP) {
      return (
        <Menu onClick={this.onContextMenuClick}>
          {this.getInitializedAssetCreateMenu(id, tType)}
        </Menu>
      );
    }
    return (
      <Menu onClick={this.onContextMenuClick}>
        {this.getSpecializedAssetCreateMenu(id, tType, clazz)}
        {this.getAssetEditMenu(id)}
        {this.getAssetDeleteMenu(id, name)}
      </Menu>
    );
  };

  getAssetEditMenu = id => {
    const key = CONTEXT_MENU_EDIT_ASSET + '|' + id;
    return (
      <Menu.Item key={key} title="编辑">
        编辑
      </Menu.Item>
    );
  };

  getAssetDeleteMenu = (id, name) => {
    const key = CONTEXT_MENU_DELETE_ASSET + '|' + id + '|' + name;
    return (
      <Menu.Item key={key} title="删除">
        删除
      </Menu.Item>
    );
  };

  /**
   * 获取特定创建元数据菜单
   */
  getSpecializedAssetCreateMenu = (elementId, tType, clazz) => {
    const { associations } = clazz;
    const aggClasses = [];
    if (associations && associations.length > 0) {
      let hasNoLimitClass = false;
      associations.forEach(association => {
        if (association.fromClass.id === clazz.id && association.aggregate) {
          const { toClass } = association;
          aggClasses.push(toClass);
          if (toClass.code === 'nolimit') {
            hasNoLimitClass = true;
          }
        }
      });
      if (hasNoLimitClass) {
        return this.getInitializedAssetCreateMenu(elementId, tType);
      }
      const keyPrefix = CONTEXT_MENU_CREATE_ASSET + '|' + tType + '|' + elementId + '|';
      return (
        <SubMenu key="elementCreateMenu" title="新建">
          {this.renderClassMenu(aggClasses, keyPrefix)}
        </SubMenu>
      );
    }
    return '';
  };

  /**
   * 获取初始化的创建元数据菜单，包含全部内容
   * @returns {*}
   */
  getInitializedAssetCreateMenu = (sourceId, tType) => {
    if (!metamodels) {
      metamodels = [];
    }

    const temp = [];
    metamodels.forEach(pck => {
      // 遍历获取第一层包，注意，这里隐藏了CWM包，降低用户理解成本。
      if ((pck.parentId === null || pck.parentId === '0') && pck.id !== '1201') {
        temp.push(pck);
      }
    });

    const keyPrefix = CONTEXT_MENU_CREATE_ASSET + '|' + tType + '|' + sourceId + '|';
    return (
      <SubMenu key="elementCreateMenu" title="新建">
        {this.renderPackageMenu(temp, keyPrefix)}
      </SubMenu>
    );
  };

  renderPackageMenu = (pcks, keyPrefix) => {
    return pcks.map(pck => {
      // Package 下的 Package
      const sub = [];
      metamodels.forEach(temp => {
        if (temp.parentId === pck.id) {
          sub.push(temp);
        }
      });
      // Package内的元模型
      const tempClasses = pck.classes;
      const classes = [];
      if (tempClasses) {
        tempClasses.forEach(clazz => {
          // 抽象类不允许实例化
          if (!clazz.abstractClass) {
            classes.push(clazz);
          }
        });
      }

      return (
        <SubMenu key={pck.code} title={pck.name}>
          {this.renderPackageMenu(sub, keyPrefix)}
          {this.renderClassMenu(classes, keyPrefix)}
        </SubMenu>
      );
    });
  };

  renderClassMenu = (classes, keyPrefix) => {
    return classes.map(clazz => {
      const { icon } = clazz;
      let iconPath = 'no-icon.svg';
      if (icon != null) {
        iconPath = icon.substring(icon.lastIndexOf('/') + 1);
      }
      return (
        <Menu.Item key={keyPrefix + clazz.id}>{this.getClassTitle(iconPath, clazz.name)}</Menu.Item>
      );
    });
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      const { dataRef } = treeNode.props;
      if (dataRef.children) {
        resolve();
        return;
      }
      this.analyseChildren(dataRef, resolve);
    });

  addChildren = (dataRef, resolve, children) => {
    const temp = dataRef;
    temp.children = children;
    const { showedTreeData } = this.state;
    this.setState({
      showedTreeData: [...showedTreeData],
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
        const num = ownedElementIds.length;
        // 如果下级包含过多内容，则不允许展开，否则会造成页面卡死
        if (num > MAX_EXPAND_NUM) {
          message.warn(
            '不允许展开！下级数量：' +
              num +
              '，超过最大支持展开数：' +
              MAX_EXPAND_NUM +
              '，请进入资产主页进行分页查询。'
          );
          resolve();
          return;
        }
        dispatchType = 'mmAssets/getElementsByOwner';
        dispatchPayload = {
          ownerId: id,
        };
        doDispatch = true;
      }
    }
    if (!doDispatch) {
      resolve();
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
      const assets = data[1];
      if (groups) {
        groups.forEach(item => {
          result.push(this.getTreeNodeData(item, GROUP));
        });
      }
      if (assets) {
        assets.forEach(item => {
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

  onItemSelect = (selectedKeys, e) => {
    const { dataRef } = e.node.props;
    const { key } = dataRef;
    const keys = [key];
    this.setState({ selectedKeys: keys });
    if (dataRef.tType === ASSET) {
      const { dispatch } = this.props;
      const { data } = dataRef;
      dispatch({
        type: 'mmAssets/testAssetExist',
        payload: {
          assetId: data.id,
        },
      }).then(res => {
        // 校验资产存在时
        if (res === true) {
          const { addTab } = this.props;
          const pane = {
            title: data.name,
            type: 'AssetMainPage',
            key: data.id,
            refreshTree: this.refreshSingle,
          };
          addTab(pane);
        } else {
          message.error('指定的：' + data.name + ' 已被删除');
        }
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  onRightClick = ({ event, node }) => {
    const selectKey = node.props.dataRef.key;
    const selectedKeys = [selectKey];
    this.setState({ selectedKeys });
  };

  handleCancel = () => {
    const assetFormData = defaultFormData;
    this.setState({ assetFormData });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const { assetFormData } = this.state;
    const { element } = assetFormData;
    let { clazz } = assetFormData;
    let elementId = null;
    // 如果存在element，则是编辑操作
    if (element) {
      elementId = element.id;
      // eslint-disable-next-line prefer-destructuring
      clazz = element.clazz;
    }
    const { ownerId } = assetFormData;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { dispatch } = this.props;
      const elementInfo = values;
      elementInfo.id = elementId;
      const paramObject = {
        elementInfo,
        ownerType: assetFormData.ownerType,
        ownerId,
        classId: clazz.id,
      };
      this.setState({ assetFormLoading: true });
      dispatch({
        type: 'mmAssets/saveOrUpdateElement',
        payload: {
          paramObject,
        },
      }).then(res => {
        // 正确保存后，需要刷新树
        if (res && res.code === 200) {
          message.success('入库成功');
          const resData = res.data;
          if (elementId) {
            this.refreshSingle('edit', resData);
          } else {
            resData.ownerId = ownerId;
            this.refreshSingle('create', resData);
          }
          // 初始化form表单
          form.resetFields();
          // 关闭对话框
          this.setState({ assetFormData: defaultFormData, assetFormLoading: false });
        } else {
          // 如果保存时出现异常，不关闭对话框
          message.error('入库失败：' + res.msg);
          this.setState({ assetFormLoading: false });
        }
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  /**
   *  当单个元数据发生变更时，自动刷新树的数据
   */
  refreshSingle = (optType, changeObj) => {
    const { showedTreeData } = this.state;
    if (optType === 'delete') {
      this.deleteTreeElement(showedTreeData, changeObj);
      // 关闭tab页
      const { id } = changeObj;
      const { removeTab } = this.props;
      if (removeTab && id) {
        removeTab(id);
      }
    } else if (optType === 'edit') {
      this.editTreeElement(showedTreeData, changeObj);
    } else if (optType === 'create') {
      this.addTreeElement(showedTreeData, changeObj);
    }
    this.setState({ showedTreeData });
  };

  deleteTreeElement = (treeData, changeObj) => {
    const { id } = changeObj;
    if (treeData) {
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const i in treeData) {
        const item = treeData[i];
        if (item.id === id) {
          // 直接删除
          treeData.splice(i, 1);
          break;
        }
        const { children } = item;
        this.deleteTreeElement(children, changeObj);
      }
    }
  };

  addTreeElement = (treeData, changeObj) => {
    const { ownerId } = changeObj;
    if (treeData) {
      treeData.forEach(item => {
        let { children } = item;
        if (item.id === ownerId) {
          if (!children) {
            children = [];
          }
          children.push(this.getTreeNodeData(changeObj, ASSET));
        }
        this.addTreeElement(children, changeObj);
      });
    }
  };

  /**
   * 编辑 树数据
   * @param treeData
   * @param changeObj
   */
  editTreeElement = (treeData, changeObj) => {
    const { id } = changeObj;
    const { name } = changeObj;
    if (treeData) {
      treeData.forEach(item => {
        const temp = item;
        if (temp.id === id) {
          temp.name = name;
          temp.title = this.getTitleWithIcon(changeObj, ASSET);
          temp.data = changeObj;
        } else {
          const { children } = item;
          this.editTreeElement(children, changeObj);
        }
      });
    }
  };

  viewChangeMenu = () => {
    const { allViewData } = this.state;
    let systemViewMenu = null;
    let userViewMenu = null;
    if (allViewData && allViewData.length > 0) {
      const systemViewData = [];
      const userViewData = [];
      allViewData.forEach(item => {
        if (item.type === VIEW_TYPE_SYSTEM) {
          systemViewData.push(item);
        } else if (item.type === VIEW_TYPE_USER) {
          userViewData.push(item);
        }
      });
      systemViewMenu = systemViewData.map(item => {
        return (
          <Menu.Item key={item.id} onClick={() => this.changeView(item)}>
            {item.name}
          </Menu.Item>
        );
      });
      userViewMenu = userViewData.map(item => {
        return (
          <Menu.Item key={item.id} onClick={() => this.changeView(item)}>
            {item.name}
          </Menu.Item>
        );
      });
    }
    return (
      <SubMenu style={{ fontSize: '12px' }} title="切换视图">
        <SubMenu style={{ fontSize: '12px' }} title="系统视图">
          {systemViewMenu}
        </SubMenu>
        <SubMenu style={{ fontSize: '12px' }} title="用户视图">
          {userViewMenu}
        </SubMenu>
        <Menu.Item key="changeToDefaultShow" onClick={this.changeToDefaultShow}>
          恢复默认
        </Menu.Item>
      </SubMenu>
    );
  };

  changeView = view => {
    const { showedTreeData, hidedTreeData } = this.state;
    const tempAll = hidedTreeData.concat(showedTreeData);
    const newShowed = [];
    const newHided = [];
    tempAll.forEach(item => {
      if (item.id === view.id) {
        newShowed.push(item);
      } else {
        newHided.push(item);
      }
    });
    this.setState({ showedTreeData: newShowed, hidedTreeData: newHided });
  };

  changeToDefaultShow = () => {
    const { showedTreeData, hidedTreeData } = this.state;
    const tempAll = hidedTreeData.concat(showedTreeData);
    const newShowed = [];
    const newHided = [];
    tempAll.forEach(item => {
      if (item.data.type === VIEW_TYPE_SYSTEM) {
        newShowed.push(item);
      } else {
        newHided.push(item);
      }
    });
    // 展现内容默认按seq属性升序排列
    const compare = property => {
      return function(a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value1 - value2;
      };
    };
    newShowed.sort(compare('seq'));
    this.setState({ showedTreeData: newShowed, hidedTreeData: newHided });
  };

  /**
   * 强制刷新树
   */
  refreshTree = () => {
    // 默认展现所有的系统视图
    this.showSystemViews();
  };

  /**
   * 获取导入模板的按钮菜单
   */
  getImportTemplateBtn = () => {
    const { currentUser } = this.props;
    const tag = currentUserIsViewRole(currentUser, viewRoleCodes);
    if (tag) {
      return '';
    }
    let importButtonVisible;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      importButtonVisible = true;
    } else {
      importButtonVisible = false;
    }
    return (
      <Menu.Item
        key="import_asset"
        onClick={this.openImportTemplateModal}
        hidden={!importButtonVisible}
      >
        导入模板
      </Menu.Item>
    );
  };

  changeTrack = () => {
    const { addTab } = this.props;
    const pane = {
      title: '变更轨迹查询',
      key: '变更轨迹查询',
      type: 'ChangeTrackSelect',
      search: '',
    };
    addTab(pane);
  };

  getFilterContent = () => {
    const { showedTreeData, selectedKeys } = this.state;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      return (
        <div className={styles.filterContent} style={{ height: 'calc(100% - 40px)' }}>
          <Tree
            loadData={this.onLoadData}
            showIcon={false}
            onSelect={this.onItemSelect}
            onRightClick={this.onRightClick}
            selectedKeys={selectedKeys}
          >
            {this.renderTreeNodes(showedTreeData)}
          </Tree>
        </div>
      );
    }
    return (
      <div className={styles.filterContent}>
        <Tree
          loadData={this.onLoadData}
          showIcon={false}
          onSelect={this.onItemSelect}
          onRightClick={this.onRightClick}
          selectedKeys={selectedKeys}
        >
          {this.renderTreeNodes(showedTreeData)}
        </Tree>
      </div>
    );
  };

  openImportTemplateModal = () => {
    this.setState({ importModelVisible: true });
  };

  importTemplateOnOk = () => {
    this.setState({ importModelVisible: false });
  };

  importTemplateOnCancel = () => {
    this.setState({ importModelVisible: false });
  };

  async showSystemViews() {
    const { dispatch } = this.props;
    // 获取元模型信息，用于拼凑树右键菜单
    metamodels = await dispatch({
      type: 'mmAssets/getAllPackages',
      payload: null,
    });
    const types = [VIEW_TYPE_SYSTEM, VIEW_TYPE_USER];
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
    // 打开检索页面方法
    const { assetFormData, importModelVisible, assetFormLoading } = this.state;
    let importButtonVisible;
    let assetTitle;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      importButtonVisible = true;
      assetTitle = '资产库';
    } else {
      importButtonVisible = false;
      assetTitle = '资产库';
    }
    // 展开/收起所有过滤项
    const filterExpandMenu = (
      <Menu>
        {this.viewChangeMenu()}
        {this.getImportTemplateBtn()}
        <Menu.Item key="download_asset" hidden={!importButtonVisible}>
          <a href={template}>下载模板</a>
        </Menu.Item>
        <Menu.Item key="change_track" onClick={this.changeTrack}>
          变更轨迹查询
        </Menu.Item>
        <Menu.Item key="refresh_all" onClick={this.refreshTree}>
          刷新
        </Menu.Item>
      </Menu>
    );

    // 获取服务返回的数据
    return (
      <div style={{ height: '100%' }}>
        <div className={styles.filterTitle}>
          {assetTitle}
          <Dropdown overlay={filterExpandMenu}>
            <span style={{ float: 'right', padding: '0 8px 0 0', cursor: 'pointer' }}>
              <Icon type="more" style={{ fontSize: '14px' }} />
            </span>
          </Dropdown>
        </div>
        {this.getFilterContent()}
        <WrappedAssetCreateForm
          wrappedComponentRef={this.saveFormRef}
          assetFormData={assetFormData}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          assetFormLoading={assetFormLoading}
        />
        <TemplateImportAsset
          visible={importModelVisible}
          onOk={this.importTemplateOnOk}
          onCancel={this.importTemplateOnCancel}
          refreshTree={this.refreshTree}
        />
      </div>
    );
  }
}

export default AssetViewTree;
