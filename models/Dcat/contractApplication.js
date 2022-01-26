import {
  getContractForVersionById,
  getContractListByIdAndVersion,
  contractSearch,
  saveOrUpdateContract,
  reflectRelation,
  queryContractTemplateList,
  queryContractTemplateDetails,
  getServiceList,
  saveAssociation,
  clearAssociation,
  getTaskAndRelease,
  deleteTask,
  getReleaseUserList,
  getOrgList,
  getExecuteList,
  contractAppTabelSearch,
  deleteContractApp,
  userNameSearch,
  checkCategory,
} from '@/services/Dcat/contractApplication';
import DiResponse from '@/components/DiResponse';
import { getCatalogTree } from '@/services/Dcat/catalog';

export default {
  namespace: 'contractApplication',

  state: {
    versions: [],
    catalogData: null,
    selectedCatalog: null,
    tableResult: {
      data: [],
      total: 0,
    },
    taskResult: {
      data: [],
      total: 0,
    },
    publishResult: {
      data: [],
      total: 0,
    },
    tableList: {
      data: [],
      total: 0,
    },
    releaseUserList: [],
    orgList: [],
    executeUserList: [],
    searchState: {
      fromType: 1,
      loading: false,
      searchValue: '',
      start: 0,
      length: 8,
      serviceType: null,
      businessCategory: null,
      businessName: null,
      tabType: 'ALL',
    },
  },

  effects: {
    /**
     * 获取目录树
     */
    *getCatalogTree({ payload }, { put, call }) {
      const { type } = payload;
      const catalogData = yield call(getCatalogTree, type);
      yield put({
        type: 'saveState',
        payload: {
          catalogData,
        },
      });
    },
    /**
     * 获取版本列表
     */
    *getContractForVersionById({ payload }, { call, put }) {
      const response = yield call(getContractForVersionById, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      yield put({
        type: 'saveState',
        payload: {
          versions: response.data,
        },
      });
      return response.data;
    },

    /**
     * 首页-查询契约列表
     */
    *searchContract(action, { select, call, put }) {
      const login = yield select(state => state.login);
      let searchState = yield select(state => state.contractApplication.searchState);
      const { data } = yield select(state => state.contractApplication.tableResult);
      const catalogData = yield call(getCatalogTree, 'CONTRACT');
      const { selectedCatalog } = yield select(state => state.contractApplication);
      yield put({
        type: 'saveState',
        payload: {
          searchState: {
            ...searchState,
            ...action.payload,
            loading: true,
          },
        },
      });

      searchState = yield select(state => state.contractApplication.searchState);
      const {
        start,
        length,
        searchValue,
        businessCategory,
        businessName,
        serviceType,
        tabType,
      } = searchState;

      //  设置查询条件
      const params = {};
      params.fromType = 1;
      params.from = start;
      // params.size = length;
      params.size = window.innerHeight > 1000 ? length * 2 : length;
      params.order = 'modifiedTime';
      params.orderDir = 'desc';
      params.data = {};

      const {
        currentUser: { account },
      } = login;
      // 全部、我的任务、我的发布
      if (tabType === 'ALL') {
        params.data.opener = account;
      } else if (tabType === 'TASK') {
        params.data.executor = account;
      } else if (tabType === 'PUBLISH') {
        params.data.createdBy = account;
      }

      const allResult = yield call(contractSearch, params);

      // 关键字查询
      if (searchValue !== '') {
        params.data.contractName = searchValue;
      }

      // 目录信息
      if (selectedCatalog !== null) {
        if (selectedCatalog[0] !== null && selectedCatalog[1] !== null) {
          let colValue = selectedCatalog[1].id;
          if (selectedCatalog[2] !== null) {
            colValue = selectedCatalog[2].id;
            params.data.contentsThird = colValue;
          } else {
            params.data.contentsSecond = colValue;
          }
        }
      }

      // 契约分类
      if (serviceType !== undefined && serviceType !== null) {
        params.data.serviceType = serviceType;
      }

      // 业务分类和业务名称信息
      if (businessCategory !== undefined && businessCategory !== null) {
        params.data.businessClassificationFirst = businessCategory;
      }
      if (businessName !== undefined && businessName !== null) {
        params.data.businessClassificationSecond = businessName;
      }

      const result = yield call(contractSearch, params);
      const resultData =
        result.data.data === undefined || result.data.data === null ? [] : result.data.data;
      let putResult;
      const total = result.data.iTotalRecords;
      if (start === 0) {
        putResult = resultData;
      } else {
        putResult = data.concat(resultData);
      }

      // 添加目录资源数
      const catalogArray =
        allResult.data.egg_contents === undefined || allResult.data.egg_contents === null
          ? []
          : allResult.data.egg_contents;
      const fillCountNum = catalogTree => {
        catalogTree.map(item => {
          const catalog = item;
          const countCatalog = catalogArray.find(value => value.key === item.id);
          catalog.count = countCatalog ? countCatalog.doc_count : 0;
          if (catalog.children !== null && catalog.children !== undefined) {
            fillCountNum(catalog.children);
          }
          return item;
        });
      };
      fillCountNum(catalogData);
      yield put({
        type: 'saveState',
        payload: {
          searchState: {
            ...searchState,
            start: start + 1,
            loading: false,
          },
          tableResult: {
            total,
            data: putResult,
          },
          catalogData,
        },
      });
    },

    /**
     * 首页-重置查询条件
     */
    *clearSearchState(action, { put }) {
      yield put({
        type: 'saveState',
        payload: {
          searchState: action.payload,
        },
      });
    },

    /**
     * 首页-获取资源列表
     */
    *getServiceList({ payload }, { call }) {
      const response = yield call(getServiceList, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 发布-新增or编辑契约
     */
    *saveOrUpdateContract({ payload }, { call }) {
      const response = yield call(saveOrUpdateContract, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },

    /**
     * 编辑-获取契约信息
     */
    *getContractByIdAndVersion({ payload }, { call }) {
      const response = yield call(getContractListByIdAndVersion, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 发布-示例映射
     */
    *reflectRelation({ payload }, { call }) {
      const response = yield call(reflectRelation, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },

    /**
     * 模板引用-获取模板列表
     */
    *queryContractTemplateList({ payload }, { call }) {
      const response = yield call(queryContractTemplateList, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 模板引用-获取模板详细
     */
    *queryContractTemplateDetails({ payload }, { call }) {
      const response = yield call(queryContractTemplateDetails, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 服务资源关系保存
     */
    *saveAssociation({ payload }, { call }) {
      const response = yield call(saveAssociation, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 服务资源关系删除
     */
    *clearAssociation({ payload }, { call }) {
      const response = yield call(clearAssociation, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },
    /**
     * 分页查询契任务列表
     * @param {*} action
     * @param {*} param1
     */
    *getTaskList(action, { call, put }) {
      const result = yield call(getTaskAndRelease, action.payload);
      const taskResult = { total: result.data.total, data: result.data.list };
      yield put({
        type: 'saveState',
        payload: {
          taskResult,
        },
      });
      return taskResult;
    },
    /**
     * 分页查询契任务列表
     * @param {*} action
     * @param {*} param1
     */
    *getPublishList(action, { call, put }) {
      const result = yield call(getTaskAndRelease, action.payload);
      const publishResult = { total: result.data.total, data: result.data.list };
      yield put({
        type: 'saveState',
        payload: {
          publishResult,
        },
      });
      return publishResult;
    },
    /**
     * 删除任务
     */
    *deleteTask(action, { call }) {
      // 接口是void类型，无返回
      return yield call(deleteTask, action.payload);
    },
    /**
     * 查询发布方列表
     * @param {*} action
     * @param {*} param1
     */
    *getReleaseUserList(action, { call, put }) {
      const result = yield call(getReleaseUserList);
      let releaseUserList = [];
      if (result.data) {
        releaseUserList = result.data;
      }
      yield put({
        type: 'saveState',
        payload: {
          releaseUserList,
        },
      });
      return releaseUserList;
    },
    /**
     * 查询执行方列表
     * @param {*} action
     * @param {*} param1
     */
    *getExecuteList(action, { call, put }) {
      const result = yield call(getExecuteList);
      const executeUserList = result.data;
      yield put({
        type: 'saveState',
        payload: {
          executeUserList,
        },
      });
      return executeUserList;
    },
    /**
     * 查询发布方机构列表
     * @param {*} action
     * @param {*} param1
     */
    *getOrgList(action, { call, put }) {
      const result = yield call(getOrgList);
      const orgList = result.data;
      yield put({
        type: 'saveState',
        payload: {
          orgList,
        },
      });
      return orgList;
    },
    /**
     * 分页查询契约业务列表
     * @param {*} action
     * @param {*} param1
     */
    *getTableSearch(action, { call, put }) {
      const result = yield call(contractAppTabelSearch, action.payload);
      const tableList = { total: result.data.iTotalRecords, data: result.data.data };
      yield put({
        type: 'saveState',
        payload: {
          tableList,
        },
      });
      return tableList;
    },
    /**
     * 删除应用契约
     */
    *deleteContractApp(action, { call }) {
      // 接口是void类型，无返回
      const response = yield call(deleteContractApp, action.payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },
    /**
     * 分页查询契约业务列表
     * @param {*} action
     * @param {*} param1
     */
    *getUserName(action, { call }) {
      const result = yield call(userNameSearch, action.payload);
      return result.data;
    },

    /**
     * 目录删除检验
     */
    *checkCategory({ payload }, { call }) {
      const response = yield call(checkCategory, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
