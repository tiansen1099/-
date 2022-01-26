import {
  tenancySpaceSearch,
  disableTenancySpace,
  getTenancySpace,
  testConnection,
  saveTenancySpace,
  getTenancySpaceByDBType,
  applyTenancySpace,
  application,
} from '@/services/Dcat/tenancySpace';
import DiResponse from '@/components/DiResponse';
import { message } from 'antd';

export default {
  namespace: 'dcatTenancySpace',

  state: {
    tableResult: {
      total: 0,
      data: [],
    },
    allDataSources: [],
    allDataSourcesByCategorys: [],
    dataSource: {},
  },

  effects: {
    /**
     * 分页查询数据源
     */
    *tenancySpaceSearch(action, { call, put }) {
      const response = yield call(tenancySpaceSearch, action.payload);
      const tableResult = { total: response.data.iTotalRecords, data: response.data.data };
      yield put({
        type: 'setState',
        payload: {
          tableResult,
        },
      });
      return tableResult;
    },

    /**
     * 分页查询数据源
     */
    *getTenancySpaceByDBType(action, { call }) {
      const { dbType } = action.payload;
      const result = yield call(getTenancySpaceByDBType, dbType);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取空间信息失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 删除空间
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *disableTenancySpace(action, { call }) {
      const { id } = action.payload;
      return yield call(disableTenancySpace, id);
    },

    /**
     * 根据ID获取空间
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getTenancySpace(action, { call }) {
      const { id } = action.payload;
      const result = yield call(getTenancySpace, id);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取空间信息失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 测试连接
     */
    *testConnection(action, { call }) {
      const { datasource } = action.payload;
      return yield call(testConnection, datasource);
    },

    /**
     * 保存空间
     */
    *saveTenancySpace(action, { call }) {
      const { datasource } = action.payload;
      return yield call(saveTenancySpace, datasource);
    },

    *application({ payload, issue }, { call }) {
      const response = yield call(issue ? applyTenancySpace : application, payload);
      if (response && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      if (issue) DiResponse.success(response.msg);
      return response.data;
    },
  },

  reducers: {
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
