import {
  contractAppTabelSearch,
  getContractAppInfoByIdAndVersion,
  getContractAppForVersionById,
} from '@/services/Dcat/contractApp';
import DiResponse from '@/components/DiResponse';
import { getCatalogTree } from '@/services/Dcat/catalog';

export default {
  namespace: 'contractApp',

  state: {
    versions: [],
    tableList: {
      data: [],
      total: 0,
    },
    templateList: {
      data: [],
      total: 0,
    },
    contractData: {},
    catalogData: null,
    selectedCatalog: null,
    tableResult: {
      data: [],
      total: 0,
    },
    searchState: {
      isPublished: 'Y',
      fromType: 1,
      loading: false,
      searchValue: '',
      start: 0,
      length: 8,
      serviceType: null,
      businessCategory: null,
      businessName: null,
    },
    templatInfo: null,
  },

  effects: {
    /**
     * 获取版本列表
     */
    *getContractAppForVersionById({ payload }, { call, put }) {
      const response = yield call(getContractAppForVersionById, payload);
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
     * 获取契约应用信息
     */
    *getContractAppInfo({ payload }, { call }) {
      const response = yield call(getContractAppInfoByIdAndVersion, payload);
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
