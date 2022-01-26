import React, { Component, Fragment } from 'react';
import {
  Button,
  Collapse,
  Dropdown,
  Form,
  Icon,
  Layout,
  Menu,
  message,
  Modal,
  Spin,
  Tabs,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import AssetAnalysis from '@/pages/Mm/Assets/assetAnalysis';
import AssetAssociation from '@/pages/Mm/Assets/assetAssociation';
import { formatDate } from '@/utils/Mm/mmUtils';
import { getSessionCache } from '@/utils/Platform/platformUtil';
import AssetCreateForm from '@/pages/Mm/Assets/assetCreateForm';
import AssetMaintainAssoc from '@/pages/Mm/Assets/assetMaintainAssoc';
import AssetHistory from '@/pages/Mm/Assets/assetHistory';
import AssetContrast from '@/pages/Mm/Assets/assetContrast';
import OwnedAssetsTable from '@/pages/Mm/Assets/ownedAssetsTable';
import OwnedColumnAssetsTable from '@/pages/Mm/Assets/ownedColumnAssetsTable';
import AssetBusinessAttr from '@/pages/Mm/Assets/assetBusinessAttr';
import AssetBaseAttr from '@/pages/Mm/Assets/assetBaseAttr';
import AssetValueDistribution from '@/pages/Mm/Assets/assetValueDistribution';
import AssetPattern from '@/pages/Mm/Assets/assetPattern';
import AssetInferredDataType from '@/pages/Mm/Assets/assetInferredDataType';
import AssetAssocTerm from '@/pages/Mm/Assets/assetAssocTerm';
import IssueInfo from '@/pages/Mm/Assets/issueInfo';
import PreviewData from '@/pages/Mm/Assets/previewData';
import ElementRepeatDegreeTable from '@/pages/Mm/Assets/elementRepeatDegreeTable';
import styles from './assetMainPage.less';

const { Panel } = Collapse;
const { Header, Content } = Layout;
const { TabPane } = Tabs;
// 列
const COLUMN = 'Column';
// 表
const TABLE = 'Table';
// 视图
const VIEW = 'View';
// 问题
const ISSUE = 'Issue';
// 数据标准
const DATA_STANDARD = 'DataStandard';
// 值域
const CODE_SET = 'CodeSet';
// 关联关系中的任意，无限制
const NO_LIMIT = 'nolimit';
// 初始化的元数据操作数据
const defaultFormData = {
  visible: false,
};
// 封装的创建Asset对话框
const WrappedAssetCreateForm = Form.create({ name: 'asset_create_and_edit_modal' })(
  AssetCreateForm
);

@connect(({ loading }) => ({
  pageLoading: loading.effects['mmAssets/getElement'],
  classLoading: loading.effects['mmAssets/getAllPackages'],
}))
class AssetMainPage extends Component {
  state = {
    ownedClasses: [],
    defaultActiveKeys: ['1', '2'],
    assetPaths: [],
    activeKey: '1',
    asset: {
      name: '',
      code: '',
      type: '',
      typeName: '',
      icon: '',
      description: '',
      createdBy: '',
      createdTime: '',
      modifiedBy: '',
      modifiedTime: '',
      elmntAttrs: [],
    },
    assetFormData: defaultFormData,
    metaModels: [],
    assetEditTag: false,
    ownedTableLoading: false,
    ingestion: null,
    maintainVisible: false,
    historyVisible: false,
    historyContrast: false,
    historyListData: null,
    timeSourceData: [],
    assetFormLoading: false,
    // 显示的不设置，不显示的设置为false,下级列表的key为class的code
    // analysisDisplay血缘影响分析显示标志，associationDisplay关联分析显示标志，descDisplay描述显示标志
    displayConfig: {
      descDisplay: true,
      analysisDisplay: false,
      associationDisplay: true,
      overview: {
        businessAttribute: {
          showTag: true,
          isPanel: true,
          MyComponent: AssetBusinessAttr,
          name: '业务属性',
        },
        baseAttribute: {
          showTag: true,
          isPanel: true,
          MyComponent: AssetBaseAttr,
          name: '基本属性',
        },
        ownedClasses: {
          showTag: true,
          isDefault: true,
          classes: [],
        },
      },
    },
    operateConfig: {
      assocTermFlag: true,
      maintainAssocFlag: false,
      viewHistoryFlag: true,
      operateBusinessAttrFlag: true,
      operateElementFlag: false,
    },
  };

  componentDidMount() {
    this.setOperateCobfig();
    this.getElementById();
    this.getAllPackages();
  }

  /**
   * 设置操作权限
   */
  setOperateCobfig = () => {
    const { operateConfig } = this.props;
    if (operateConfig) {
      this.setState({ operateConfig });
    }
  };

  /**
   * 设置显示开关
   * @param asset
   */
  setDisplayConfig = asset => {
    const columnConfig = {
      name: 'Column',
      isPanel: true,
      component: OwnedColumnAssetsTable,
    };
    const primaryKeyConfig = {
      name: 'PrimaryKey',
      isPanel: true,
      component: OwnedAssetsTable,
    };
    const foreignKeyConfig = {
      name: 'ForeignKey',
      isPanel: true,
      component: OwnedAssetsTable,
    };
    const issueInfoPanel = {
      showTag: true,
      isPanel: true,
      MyComponent: IssueInfo,
      name: '问题信息',
    };
    const valueDistribution = {
      showTag: true,
      isPanel: true,
      MyComponent: AssetValueDistribution,
      name: '值分布',
    };
    const pattern = {
      showTag: true,
      isPanel: true,
      MyComponent: AssetPattern,
      name: '数据模式（X表示任意字符，数字表示长度）',
    };
    const inferredDataType = {
      showTag: true,
      isPanel: true,
      MyComponent: AssetInferredDataType,
      name: '预测数据类型',
    };
    const { displayConfig } = this.state;
    if (asset.type === COLUMN) {
      displayConfig.overview.valueDistribution = valueDistribution;
      displayConfig.overview.pattern = pattern;
      displayConfig.overview.inferredDataType = inferredDataType;
      displayConfig.overview.ownedClasses.showTag = false;
      displayConfig.analysisDisplay = true;
    }
    if (asset.type === TABLE || asset.type === VIEW) {
      displayConfig.overview.ownedClasses.isDefault = false;
      displayConfig.overview.ownedClasses.classes.push(columnConfig);
      displayConfig.overview.ownedClasses.classes.push(primaryKeyConfig);
      displayConfig.overview.ownedClasses.classes.push(foreignKeyConfig);
      displayConfig.analysisDisplay = true;
    }
    if (asset.type === ISSUE) {
      displayConfig.descDisplay = false;
      displayConfig.overview.baseAttribute.showTag = false;
      displayConfig.overview.ownedClasses.showTag = false;
      displayConfig.overview.issueInfoPanel = issueInfoPanel;
    }
    this.setState({ displayConfig });
  };

  /**
   * 获取历史数据
   */
  getHistoryData = () => {
    const { elementId, dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getHistoryElements',
      payload: {
        elementId,
      },
    }).then(assetHistories => {
      if (assetHistories) {
        const timeSourceData = [];
        assetHistories.forEach(assetHistory => {
          const data = {};
          data.id = assetHistory.startTime;
          data.text = formatDate(new Date(assetHistory.startTime), 'yyyy-MM-dd HH:mm:ss');
          timeSourceData.push(data);
        });
        this.setState({ timeSourceData, historyListData: assetHistories });
      }
    });
  };

  /**
   * 获取所有的元模型包（包含元模型）
   */
  getAllPackages = () => {
    const { dispatch } = this.props;
    // 获取元模型信息，用于拼凑树右键菜单
    dispatch({
      type: 'mmAssets/getAllPackages',
      payload: null,
    }).then(res => {
      this.setState({ metaModels: res });
    });
  };

  /**
   * 获取指定元模型
   * @param classId
   * @returns {null|*}
   */
  getClassById = classId => {
    const { metaModels } = this.state;
    if (metaModels) {
      for (let i = 0; i < metaModels.length; i += 1) {
        const pck = metaModels[i];
        const { classes } = pck;
        if (classes) {
          for (let j = 0; j < classes.length; j += 1) {
            const clazz = classes[j];
            if (clazz.id === classId) {
              return clazz;
            }
          }
        }
      }
    }
    message.error('未找到匹配的元模型信息，classId=' + classId);
    return null;
  };

  formatDataType = dataType => {
    if (dataType === 'C' || dataType === '字符型') {
      return '字符型';
    }
    if (dataType === 'N' || dataType === '数值型') {
      return '数值型';
    }
    if (dataType === 'D' || dataType === '日期型') {
      return '日期型';
    }
    if (dataType === 'L' || dataType === '逻辑型') {
      return '逻辑型';
    }
    if (dataType === 'B' || dataType === '二进制型') {
      return '二进制型';
    }
    if (dataType === 'T' || dataType === '长文本型') {
      return '长文本型';
    }
    return '';
  };

  formatCodesetType = type => {
    if (type === 'rule' || type === '规则') {
      return '规则';
    }
    if (type === 'code' || type === '代码') {
      return '代码';
    }
    return '';
  };

  /**
   * 根据elementId获取element
   */
  getElementById = () => {
    const { elementId, dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElement',
      payload: {
        elementId,
      },
    }).then(asset => {
      if (asset) {
        const { clazz, attributes } = asset;
        if (clazz && clazz.attributes && clazz.attributes.length > 0) {
          if (clazz.code === DATA_STANDARD) {
            attributes.dataType = this.formatDataType(attributes.dataType);
          }
          if (clazz.code === CODE_SET) {
            attributes.type = this.formatCodesetType(attributes.type);
          }
        }
        this.setState({ asset });
        this.setDisplayConfig(asset);
        this.initPage();
      }
    });
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
   * 通过资产映射初始化页面
   */
  initPage = () => {
    const { asset } = this.state;
    const { tab } = this.props;
    if (asset) {
      if (asset.canEdit) {
        this.setState({ assetEditTag: true });
      } else {
        this.setState({ assetEditTag: false });
      }
      asset.ownedElementIds = this.getOwnedElementIds(asset);
      // 获取资产的下级元模型和下级资产
      this.initOwnedClasses(asset);
      if (asset.ingestionId) {
        this.getIngestionById(asset.ingestionId);
      }
      // 拼接资产路径
      this.getAssetPath();
      this.setState({ activeKey: tab });
    }
  };

  /**
   * 根据Id获取采集信息
   * @param ingestionId
   */
  getIngestionById = ingestionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getIngestionById',
      payload: {
        ingestionId,
      },
    }).then(res => {
      if (res) {
        this.setState({ ingestion: res });
      }
    });
  };

  /**
   * 根据element获取下级元模型
   * @param element
   */
  initOwnedClasses = element => {
    if (element && element.clazz) {
      const { associations } = element.clazz;
      const ownedClasses = [];
      const { defaultActiveKeys } = this.state;
      let index = 3;
      if (associations && associations.length > 0) {
        associations.forEach(association => {
          if (
            association.aggregate === true &&
            association.fromClass.id === element.clazz.id &&
            association.toClass.name !== NO_LIMIT
          ) {
            const ownedClass = {};
            ownedClass.code = association.toClass.code;
            ownedClass.name = association.toClass.name;
            ownedClass.id = association.toClass.id;
            ownedClasses.push(ownedClass);
            defaultActiveKeys.push(index.toString());
            index += 1;
          }
        });
        this.setState({ ownedClasses, defaultActiveKeys });
      }
    }
  };

  /**
   * 拼接资产路径
   */
  getAssetPath = () => {
    const { asset } = this.state;
    if (asset.idPath) {
      const { namePath, idPath } = asset;
      const assetPaths = [];
      const namePaths = namePath.split('/');
      const idPaths = idPath.split('/');
      if (namePaths && idPaths && namePaths.length === idPaths.length && namePaths.length > 0) {
        namePaths.forEach((name, key) => {
          const assetPath = {
            name,
            id: idPaths[key],
            key: idPaths[key],
          };
          assetPaths.push(assetPath);
        });
      }
      this.setState({ assetPaths });
    }
  };

  /**
   * 获取资产图标
   * @returns {string|*}
   */
  getAssetIcon = () => {
    const { asset } = this.state;
    if (asset && asset.icon && asset.icon !== '') {
      let { icon } = asset;
      icon = icon.substring(icon.lastIndexOf('/') + 1);
      return (
        // eslint-disable-next-line global-require,import/no-dynamic-require
        <img alt="" className={styles.assetIcon} src={require('@/assets/mm/asset-icons/' + icon)} />
      );
    }
    return '';
  };

  getAssetName = () => {
    const { asset } = this.state;
    let { name } = asset;
    if (name.length > 30) {
      name = name.substring(0, 30) + '...';
    }
    return (
      <Tooltip placement="bottomLeft" title={asset.name}>
        <span className={styles.assetName}>{name}</span>
      </Tooltip>
    );
  };

  /**
   * 获取概览框中子组件
   * @param isPanel  是否是折叠面板
   * @param isLast   是否是最后一个
   * @param index    面板的排序index
   * @param MyComponent  子组件
   * @param childProps   子组件所需变量集合
   * @returns {*}
   */
  getChildComponent = (component, index, isLast, childProps) => {
    const { MyComponent, ownedClass } = component;
    if (component.isPanel) {
      if (isLast) {
        return (
          <Panel
            header={<span className={styles.panelTitle}>{component.name}</span>}
            key={index.toString()}
            className={styles.lastInfoCollapsePanel}
          >
            <MyComponent childProps={childProps} ownedClass={ownedClass} />
          </Panel>
        );
      }
      return (
        <Panel
          header={<span className={styles.panelTitle}>{component.name}</span>}
          key={index.toString()}
          className={styles.infoCollapsePanel}
        >
          <MyComponent childProps={childProps} ownedClass={ownedClass} />
        </Panel>
      );
    }
    return <MyComponent childProps={childProps} ownedClass={ownedClass} />;
  };

  initOverviewByConfig = () => {
    const {
      displayConfig,
      ownedClasses,
      asset,
      assetEditTag,
      ingestion,
      operateConfig,
    } = this.state;
    const { addTab, refreshTree, tabTag } = this.props;
    const childProps = {
      elementId: asset.id,
      element: asset,
      asset,
      getClassById: this.getClassById,
      assetEditTag,
      assetOnClick: this.assetOnClick,
      refreshTree,
      ingestion,
      addTab,
      operateConfig,
      tabTag,
    };
    const keys = Object.keys(displayConfig.overview);
    const showComponents = [];
    if (asset && asset.id) {
      keys.map(key => {
        const component = displayConfig.overview[key];
        if (component.showTag) {
          if (key === 'ownedClasses') {
            if (component.isDefault) {
              ownedClasses.map(ownedClass => {
                const config = {
                  isPanel: true,
                  MyComponent: OwnedAssetsTable,
                  name: ownedClass.name,
                  ownedClass,
                };
                showComponents.push(config);
                return '';
              });
            } else {
              const { classes } = component;
              if (classes.length > 0 && ownedClasses.length > 0) {
                classes.map(clazz => {
                  const ownedClass = ownedClasses.find(ownedClassTemp => {
                    return ownedClassTemp.code === clazz.name;
                  });
                  if (ownedClass) {
                    const config = {
                      isPanel: clazz.isPanel,
                      MyComponent: clazz.component,
                      name: ownedClass.name,
                      ownedClass,
                    };
                    showComponents.push(config);
                  }
                  return '';
                });
              }
            }
          } else {
            showComponents.push(component);
          }
        }

        return '';
      });
      return showComponents.map((component, index) => {
        let isLast = false;
        if (index === showComponents.length - 1) {
          isLast = true;
        }
        return this.getChildComponent(component, index + 1, isLast, childProps);
      });
    }
    return '';
  };

  /**
   * 获取概览页面折叠栏
   * @returns {*}
   */
  getCollapseInfo = () => {
    const { asset, ownedClasses, ownedTableLoading } = this.state;
    if (asset && ownedClasses) {
      return (
        <Spin spinning={ownedTableLoading}>
          <Collapse
            style={{ border: '0px', background: '#FFFFFF' }}
            defaultActiveKey={[
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
              '16',
              '17',
              '18',
              '19',
              '20',
            ]}
            expandIconPosition="right"
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            {this.initOverviewByConfig()}
          </Collapse>
        </Spin>
      );
    }
    return '';
  };

  /**
   * 打开历史记录弹出框，获取Iframe地址
   */
  showHistoryOnClick = () => {
    this.getHistoryData();
    this.setState({ historyVisible: true });
  };

  historyOnCancel = () => {
    this.setState({ historyVisible: false });
  };

  showContrastOnClick = () => {
    this.setState({ historyContrast: true });
  };

  contrastOnCancel = () => {
    this.setState({ historyContrast: false });
  };

  /**
   * 打开配置关联弹出框
   */
  associationConfigOnClick = () => {
    this.setState({ maintainVisible: true });
  };

  /**
   * 关闭配置关联弹出框
   */
  associationConfigOnCancel = () => {
    this.setState({ maintainVisible: false });
  };

  /**
   * 通过type获取不同Tab页
   * @returns {*}
   */
  getAnalysisByType = () => {
    const { asset, displayConfig } = this.state;
    if (
      asset &&
      asset.type &&
      (displayConfig.analysisDisplay === null || displayConfig.analysisDisplay !== false)
    ) {
      return (
        <TabPane
          tab={<span style={{ fontWeight: 'bold', margin: '0' }}>血缘/影响分析</span>}
          key="2"
        >
          {this.getAnalysisContainer()}
        </TabPane>
      );
    }
    return '';
  };

  /**
   * 保存资产表单
   * @param formRef
   */
  saveAssetFormRef = formRef => {
    this.WrappedAssetCreateForm = formRef;
  };

  /**
   * 获取资产描述
   * @returns {string}
   */
  getAssetDescription = () => {
    const { asset, displayConfig } = this.state;
    if (displayConfig.descDisplay === null || displayConfig.descDisplay !== false) {
      if (asset && asset.description && asset.description !== '') {
        return (
          <div className={styles.assetDesc}>
            <span className={styles.descTitle}>描述信息：</span>
            <Tooltip placement="bottomLeft" title={asset.description}>
              <span className={styles.descInfo}>{asset.description}</span>
            </Tooltip>
          </div>
        );
      } else if (asset && asset.customDescription && asset.customDescription !== '') {
        return (
          <div className={styles.assetDesc}>
            <span className={styles.descTitle}>描述信息：</span>
            <Tooltip placement="bottomLeft" title={asset.customDescription}>
              <span className={styles.descInfo}>{asset.customDescription}</span>
            </Tooltip>
          </div>
        );
      }
      return (
        <div className={styles.assetDesc}>
          <span className={styles.descTitle}>描述信息：</span>
          <Tooltip placement="bottomLeft" title="-">
            <span className={styles.descInfo}>-</span>
          </Tooltip>
        </div>
      );
    }
    return '';
  };

  /**
   * tab点击事件
   * @param key
   */
  tabOnClick = key => {
    this.setState({ activeKey: key });
  };

  /**
   * 资产点击事件
   * @param asset
   */
  assetOnClick = asset => {
    const { addTab } = this.props;
    const pane = { title: asset.name, type: 'AssetMainPage', key: asset.id, tab: '1' };
    if (addTab) {
      addTab(pane);
    }
  };

  /**
   * 删除资产
   * @param elementId
   */
  removeAsset = elementId => {
    const { asset } = this.state;
    const { removeTab, refreshTree, dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '是否确认删除' + asset.name + '？',
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
            if (removeTab) {
              removeTab(elementId);
            }
            if (refreshTree) {
              refreshTree('delete', { id: elementId });
            }
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
    const assetFormData = {
      title: '编辑 ' + element.name,
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
    const { form } = this.WrappedAssetCreateForm.props;
    const { assetFormData, asset } = this.state;
    const { element } = assetFormData;
    let assetClazz = assetFormData.clazz;
    let elementId = null;
    let isEdit = false;
    // 如果存在element，则是编辑操作
    if (element) {
      elementId = element.id;
      assetClazz = element.clazz;
      isEdit = true;
    }
    const { ownerId } = assetFormData;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { dispatch, refreshTree } = this.props;
      const elementInfo = values;
      elementInfo.id = elementId;
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
          message.success('资产入库成功');
          this.getElementById();
          if (isEdit) {
            refreshTree('edit', res.data);
          } else {
            res.data.ownerId = asset.id;
            refreshTree('create', res.data);
          }
        } else {
          message.error('资产入库失败：' + res.msg);
        }
      });
    });
  };

  /**
   * 额外按钮DOM
   * @returns {null|*}
   */
  getDcatLinks = () => {
    const { buttonDom } = this.props;
    if (buttonDom) {
      return <Fragment>{buttonDom}</Fragment>;
    }
    return null;
  };

  getMaintainDialog = () => {
    const { asset, maintainVisible } = this.state;
    if (asset.id) {
      return (
        <AssetMaintainAssoc
          visible={maintainVisible}
          onCancel={this.associationConfigOnCancel}
          asset={asset}
        />
      );
    }
    return '';
  };

  getHistoryDialog = () => {
    const { asset, historyVisible, historyListData, timeSourceData } = this.state;
    if (asset.id && historyListData) {
      return (
        <AssetHistory
          visible={historyVisible}
          onCancel={this.historyOnCancel}
          historyListData={historyListData}
          timeSourceData={timeSourceData}
          asset={asset}
        />
      );
    }
    return '';
  };

  getContrastDialog = () => {
    const { asset, historyContrast } = this.state;
    if (asset.id) {
      return (
        <AssetContrast visible={historyContrast} onCancel={this.contrastOnCancel} asset={asset} />
      );
    }
    return '';
  };

  /**
   * 获取概览页面，判断是否是MM
   * @returns {*}
   */
  getOverViewContainer = () => {
    const productCode = getSessionCache('productCode');
    // 为数据目录定制
    if (productCode === 'DataCatalog') {
      return <div className={styles.overviewContainer}>{this.getCollapseInfo()}</div>;
    }
    return (
      <div className={styles.overviewContainer} style={{ height: 'calc( 100% - 56px )' }}>
        {this.getCollapseInfo()}
      </div>
    );
  };

  /**
   * 获取血缘/影响分析页面，判断是否是MM
   * @returns {*}
   */
  getAnalysisContainer = () => {
    const { asset } = this.state;
    const { addTab } = this.props;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      return (
        <div className={styles.analyseContainer}>
          <AssetAnalysis elementId={asset.id} addTab={addTab} />
        </div>
      );
    }
    return (
      <div className={styles.analyseContainer} style={{ height: '500px' }}>
        <AssetAnalysis elementId={asset.id} addTab={addTab} />
      </div>
    );
  };

  /**
   * 获取概览页面，判断是否是MM
   * @returns {*}
   */
  getAssociationContainer = () => {
    const { asset } = this.state;
    const { addTab } = this.props;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      return (
        <div id="assetAssociationContainer" className={styles.associationContainer}>
          <AssetAssociation elementId={asset.id} addTab={addTab} />
        </div>
      );
    }
    return (
      <div
        id="assetAssociationContainer"
        className={styles.associationContainer}
        style={{ height: '500px' }}
      >
        <AssetAssociation elementId={asset.id} addTab={addTab} />
      </div>
    );
  };

  /**
   * 获取数据预览页面，判断是否是MM
   * @returns {*}
   */
  getDataPreviewContainer = () => {
    const { asset } = this.state;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      return (
        <div id="dataPreviewContainer" className={styles.dataPreviewContainer}>
          <PreviewData element={asset} />
        </div>
      );
    }
    return (
      <div
        id="dataPreviewContainer"
        className={styles.dataPreviewContainer}
        style={{ height: '500px' }}
      >
        <PreviewData element={asset} />
      </div>
    );
  };

  /**
   * 获取元数据重复度分析页面
   * @returns {*}
   */
  getElementRepeatDegreeContainer = () => {
    const { addTab } = this.props;
    const { asset } = this.state;
    return (
      <div
        id="elementRepeatDegreeTable"
        className={styles.dataPreviewContainer}
        style={{ height: '500px' }}
      >
        <ElementRepeatDegreeTable element={asset} addTab={addTab} />
      </div>
    );
  };

  /**
   * 获取操作本身的按钮
   * @returns {string|*}
   */
  getOperateSelfButton = () => {
    const { operateConfig, asset, assetEditTag } = this.state;
    const { elementId } = this.props;
    if (operateConfig.operateElementFlag) {
      return (
        <Fragment>
          <Button
            type="primary"
            style={{ marginRight: '5px', height: '28px' }}
            onClick={() => this.openEditAssetModal(asset)}
            hidden={!assetEditTag}
          >
            编辑
          </Button>
          <Button
            style={{ height: '28px' }}
            hidden={!assetEditTag}
            onClick={() => this.removeAsset(elementId)}
          >
            删除
          </Button>
        </Fragment>
      );
    }
    return '';
  };

  getMaintainAssocButton = () => {
    const { operateConfig } = this.state;
    if (operateConfig.maintainAssocFlag) {
      return (
        <Menu.Item style={{ fontSize: '12px' }} onClick={() => this.associationConfigOnClick()}>
          维护关联
        </Menu.Item>
      );
    }
    return '';
  };

  getViewHistoryButton = () => {
    const { operateConfig } = this.state;
    if (operateConfig.viewHistoryFlag) {
      return (
        <Menu.Item style={{ fontSize: '12px' }} onClick={() => this.showHistoryOnClick()}>
          查看历史
        </Menu.Item>
      );
    }
    return '';
  };

  getElementContrastButton = () => {
    const { operateConfig } = this.state;
    if (operateConfig.viewHistoryFlag) {
      return (
        <Menu.Item style={{ fontSize: '12px' }} onClick={() => this.showContrastOnClick()}>
          差异分析
        </Menu.Item>
      );
    }
    return '';
  };

  /**
   * 获取预览数据Tab页
   * @returns {string|*}
   */
  getPreviewData = () => {
    const { asset } = this.state;
    if (asset) {
      const elementType = asset.type;
      if (elementType === TABLE || elementType === VIEW || elementType === COLUMN) {
        if (asset.dataSourceElement) {
          return (
            <TabPane
              tab={<span style={{ fontWeight: 'bold', margin: '0' }}>数据预览</span>}
              key="4"
              style={{ width: '100%' }}
            >
              {this.getDataPreviewContainer()}
            </TabPane>
          );
        }
      }
    }
    return '';
  };

  /**
   * 获取重复度分析Tab页
   * @returns {string|*}
   */
  getElementRepeatDegree = () => {
    const { asset } = this.state;
    if (asset) {
      return (
        <TabPane
          tab={<span style={{ fontWeight: 'bold', margin: '0' }}>重复度分析</span>}
          key="5"
          style={{ width: '100%' }}
        >
          {this.getElementRepeatDegreeContainer()}
        </TabPane>
      );
    }
    return '';
  };

  render() {
    const { pageLoading, classLoading } = this.props;
    const {
      asset,
      activeKey,
      assetPaths,
      assetFormData,
      assetFormLoading,
      operateConfig,
    } = this.state;
    const moreOperateMenu = (
      <Menu>
        {this.getMaintainAssocButton()}
        {this.getViewHistoryButton()}
        {this.getElementContrastButton()}
      </Menu>
    );
    if (asset) {
      return (
        <Fragment>
          <div className={styles.assetMainPageContent}>
            <Spin spinning={pageLoading}>
              <Spin spinning={classLoading}>
                <div className={styles.homepageContent}>
                  <Layout style={{ background: '#fff', height: '100%' }}>
                    <Header className={styles.homepageHeader}>
                      <div>
                        <div>
                          <div className={styles.assetTitle}>
                            {this.getAssetIcon()}
                            {this.getAssetName()}
                            <AssetAssocTerm
                              operatePrivilege={operateConfig.assocTermFlag}
                              asset={asset}
                              getElementById={this.getElementById}
                              getOwnedElementIds={this.getOwnedElementIds}
                            />
                            <div className={styles.buttonGroup}>
                              {this.getDcatLinks()}
                              {this.getOperateSelfButton()}
                              <Dropdown overlay={moreOperateMenu}>
                                <Button style={{ marginLeft: '10px', height: '27px' }}>
                                  更多操作
                                  <Icon type="caret-down" />
                                </Button>
                              </Dropdown>
                            </div>
                          </div>
                          <div className={styles.assetPath}>
                            <span className={styles.pathTitle}>资产路径：</span>
                            {assetPaths.map((assetPath, key) => {
                              if (key === assetPaths.length - 1) {
                                return (
                                  <span key={assetPath.id} className={styles.pathInfo}>
                                    {assetPath.name}
                                  </span>
                                );
                              }
                              return (
                                <span key={assetPath.id}>
                                  <a onClick={() => this.assetOnClick(assetPath)}>
                                    {assetPath.name}
                                  </a>
                                  &nbsp;/&nbsp;
                                </span>
                              );
                            })}
                          </div>
                          {this.getAssetDescription()}
                        </div>
                      </div>
                    </Header>
                    <Content className={styles.homepageContentContainer}>
                      <div style={{ height: '100%' }}>
                        <Tabs
                          activeKey={activeKey}
                          tabBarGutter={3}
                          tabBarStyle={{
                            fontWeight: 'bold',
                            marginBottom: '0',
                            marginLeft: '15px',
                            marginRight: '15px',
                          }}
                          onTabClick={this.tabOnClick}
                        >
                          <TabPane
                            tab={<span style={{ fontWeight: 'bold', margin: '0' }}>概览</span>}
                            key="1"
                            style={{ width: '100%' }}
                          >
                            {this.getOverViewContainer()}
                          </TabPane>
                          {this.getAnalysisByType()}
                          <TabPane
                            tab={<span style={{ fontWeight: 'bold', margin: '0' }}>关联分析</span>}
                            key="3"
                          >
                            {this.getAssociationContainer()}
                          </TabPane>
                          {this.getPreviewData()}
                          {this.getElementRepeatDegree()}
                        </Tabs>
                      </div>
                    </Content>
                  </Layout>
                </div>
              </Spin>
            </Spin>
            <WrappedAssetCreateForm
              wrappedComponentRef={this.saveAssetFormRef}
              assetFormData={assetFormData}
              onCancel={this.handleAssetModalCancel}
              onCreate={this.handleAssetModalCreate}
              assetFormLoading={assetFormLoading}
            />
            {this.getMaintainDialog()}
            {this.getHistoryDialog()}
            {this.getContrastDialog()}
          </div>
        </Fragment>
      );
    }
    return '';
  }
}

export default AssetMainPage;
