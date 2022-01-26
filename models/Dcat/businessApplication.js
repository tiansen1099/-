import {
  bizDist,
  bizInfo,
  bizServices,
  businessSearch,
  isCategoryInUse,
  getBusinessAppAssociation,
  getBusinessAppVersions,
  getOrgList,
  getReleaseUserList,
  businessAppTabelSearch,
  deleteBusinessApp,
  getBusinessInfo,
  getBusinessReleaseUnitAndServiceContract,
  saveOpener,
} from '@/services/Dcat/businessApplication';
import DiResponse from '@/components/DiResponse';
import { getCatalogTree } from '@/services/Dcat/catalog';

export default {
  namespace: 'businessApplication',

  state: {
    releaseUserList: [],
    orgList: [],
    businessApplication: {},
    versions: [],
    catalogData: null,
    selectedCatalog: null,
    tableResult: {
      data: [],
      total: 0,
    },
    tableList: {
      data: [],
      total: 0,
    },
    searchState: {
      isPublished: 'Y',
      fromType: 1,
      loading: false,
      searchValue: '',
      start: 0,
      length: 6,
      businessCategory: null,
      businessName: null,
      tabType: 'ALL',
    },
  },

  effects: {
    /**
     * 查询首页业务列表
     * @param {*} action
     * @param {*} param1
     */
    *searchBusiness(action, { select, call, put }) {
      const login = yield select(state => state.login);
      let searchState = yield select(state => state.businessApplication.searchState);
      const { data } = yield select(state => state.businessApplication.tableResult);
      const catalogData = yield call(getCatalogTree, 'BSNS');
      const { selectedCatalog } = yield select(state => state.businessApplication);
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

      searchState = yield select(state => state.businessApplication.searchState);
      const { start, length, searchValue, businessCategory, businessName, tabType } = searchState;

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
      params.data.createdBy = account;
      // 全部、我的任务、我的发布
      if (tabType === 'ALL') {
        params.data.queryType = '1';
      } else if (tabType === 'TASK') {
        params.data.queryType = '3';
      } else if (tabType === 'PUBLISH') {
        params.data.queryType = '2';
      }

      const allResult = yield call(businessSearch, params);

      // 关键字查询
      if (searchValue !== '') {
        params.data.businessName = searchValue;
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

      // 业务分类和业务名称信息
      if (businessCategory !== undefined && businessCategory !== null) {
        params.data.businessClassificationFirst = businessCategory;
      }
      if (businessName !== undefined && businessName !== null) {
        params.data.businessClassificationSecond = businessName;
      }

      const result = yield call(businessSearch, params);
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
     * 重置查询条件
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
     * 业务发布
     */
    *bizDist({ payload }, { call }) {
      const response = yield call(bizDist, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 获取业务信息
     */
    *bizInfo({ payload }, { call }) {
      const response = yield call(bizInfo, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 获取契约/服务/数据列表
     */
    *bizServices({ payload }, { call }) {
      const response = yield call(bizServices, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 目录删除检验
     */
    *isCategoryInUse({ payload }, { call }) {
      const response = yield call(isCategoryInUse, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 获取契约服务关系列表
     */
    *getBusinessAppAssociation({ payload }, { call }) {
      const response = yield call(getBusinessAppAssociation, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 获取业务版本列表
     */
    *getBusinessAppVersions({ payload }, { call, put }) {
      const response = yield call(getBusinessAppVersions, payload);
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
      const result = yield call(businessAppTabelSearch, action.payload);
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
    *deleteBusinessApp(action, { call }) {
      // 接口是void类型，无返回
      const response = yield call(deleteBusinessApp, action.payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },
    /**
     * 获取业务信息
     */
    *getBusinessInfo({ payload }, { call }) {
      const response = yield call(getBusinessInfo, payload);
      if (response && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    *getBusinessReleaseUnitAndServiceContract({ payload }, { call, put }) {
      const response = yield call(getBusinessReleaseUnitAndServiceContract, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      const unitAndServiceContract = response.data;
      yield put({
        type: 'saveState',
        payload: {
          unitAndServiceContract,
        },
      });
      return unitAndServiceContract;
    },
    /**
     * 设置权限
     */
    *saveOpener({ payload }, { call }) {
      const data = payload;
      const response = yield call(saveOpener, data);
      if (response && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
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
