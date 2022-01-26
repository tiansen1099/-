import {
  getBusinessReleaseListByIdAndVersion,
  getBusinessReleaseUnitAndServiceContract,
  getBusinessReleaseForVersionById,
  bizDist,
  bizInfo,
  bizServices,
  businessSearch,
  businessQuote,
  businessTabelSearch,
  deleteBsns,
} from '@/services/Dcat/businessRelease';
import DiResponse from '@/components/DiResponse';
import { getCatalogTree } from '@/services/Dcat/catalog';

export default {
  namespace: 'businessRelease',

  state: {
    businessRelease: {},
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
    },
  },

  effects: {
    /**
     * 获取单条信息
     */
    *getBusinessReleaseListByIdAndVersion({ payload }, { call, put }) {
      const response = yield call(getBusinessReleaseListByIdAndVersion, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      const businessRelease = response.data;
      yield put({
        type: 'saveState',
        payload: {
          businessRelease,
        },
      });
      return businessRelease;
    },
    /**
     * 获取单条信息
     */
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
     * 获取单条信息
     */
    *getBusinessReleaseForVersionById({ payload }, { call, put }) {
      const response = yield call(getBusinessReleaseForVersionById, payload);
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
     * 获取契约列表
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
     * 查询首页业务列表
     * @param {*} action
     * @param {*} param1
     */
    *searchBusiness(action, { select, call, put }) {
      let searchState = yield select(state => state.businessRelease.searchState);
      const { data } = yield select(state => state.businessRelease.tableResult);
      const catalogData = yield call(getCatalogTree, 'BSNS');
      const { selectedCatalog } = yield select(state => state.businessRelease);
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

      searchState = yield select(state => state.businessRelease.searchState);
      const { start, length, searchValue, businessCategory, businessName } = searchState;

      //  设置查询条件
      const params = {};
      params.fromType = 1;
      params.from = start;
      // params.size = length;
      params.size = window.innerHeight > 1000 ? length * 2 : length;
      params.data = {};
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
     * 引用业务
     */
    *quoteBusiness(action, { call }) {
      const data = action.payload;
      return yield call(businessQuote, data);
    },

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

    *clearSearchState(action, { put }) {
      yield put({
        type: 'saveState',
        payload: {
          searchState: action.payload,
        },
      });
    },

    /**
     * 分页查询目录资源列表
     * @param {*} action
     * @param {*} param1
     */
    *getTableSearch(action, { call, put }) {
      const result = yield call(businessTabelSearch, action.payload);
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
     * 删除资源
     */
    *deleteBsns(action, { call }) {
      // 接口是void类型，无返回
      return yield call(deleteBsns, action.payload);
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
