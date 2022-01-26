import {
  tenancySearch,
  disable,
  getTenancy,
  createTenancy,
  changeTenancy,
  getConnection,
  resetPassword,
} from '@/services/Dcat/tenancy';
import { message } from 'antd';

export default {
  namespace: 'dcatTenancy',

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
    *tenancySearch(action, { call, put }) {
      const response = yield call(tenancySearch, action.payload);
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
     * 注销空间
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *disable(action, { call }) {
      const { disableBody } = action.payload;
      return yield call(disable, disableBody);
    },
    /**
     * 重置密码
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *resetPassword(action, { call }) {
      const { bodyParam } = action.payload;
      return yield call(resetPassword, bodyParam);
    },
    /**
     * 根据ID获取空间
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getTenancy(action, { call }) {
      const { id } = action.payload;
      const result = yield call(getTenancy, id);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取信息失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 创建空间
     */
    *saveTenancy(action, { call }) {
      const { datasource } = action.payload;
      const { created } = datasource;
      if (created) {
        return yield call(changeTenancy, datasource);
      }
      return yield call(createTenancy, datasource);
    },

    /**
     * 查看空间连接信息
     */
    *getConnection(action, { call }) {
      const { datasourceId } = action.payload;
      const result = yield call(getConnection, datasourceId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取空间连接信息失败！错误信息：' + result.msg);
      return null;
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
