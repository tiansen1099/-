import {
  getSQLMetadata,
  saveOrUpdateDataSource,
  getAllSystemVariables,
  testSqlCondition,
  dxpTaskSearch,
  disableTask,
  getDataCount,
  enableTask,
  startTask,
} from '@/services/Dcat/dxpClient';

export default {
  namespace: 'dcatDxpClient',

  state: {
    sqlMetadata: [],
    allSystemVariables: [],
    tableResult: {
      data: [],
      total: 0,
    },
  },

  effects: {
    /**
     * 调用dxp接口获取sql元数据
     */
    *getSQLMetadata(action, { call, put }) {
      const { dsId, sqlExpression } = action.payload;
      const response = yield call(getSQLMetadata, dsId, sqlExpression);
      if (response && response.code === 200 && response.data) {
        yield put({
          type: 'setState',
          payload: {
            sqlMetadata: JSON.parse(response.data),
          },
        });
      }
      return response;
    },

    /**
     * 保存数据源
     * @param {*} action
     * @param {*} param1
     */
    *saveOrUpdateDataSource(action, { call }) {
      const { dataSource } = action.payload;
      const response = yield call(saveOrUpdateDataSource, dataSource);
      return response;
    },

    /**
     * 获取系统变量
     * @param {*} action
     * @param {*} param1
     */
    *getAllSystemVariables(_, { call, put }) {
      const response = yield call(getAllSystemVariables);
      if (response && response.data && response.data.data) {
        yield put({
          type: 'setState',
          payload: {
            allSystemVariables: response.data.data,
          },
        });
      }
      return response;
    },

    /**
     * 测试前置条件
     * @param {*} action
     * @param {*} param1
     */
    *testSqlCondition(action, { call }) {
      const { condtionTestDTO } = action.payload;
      return yield call(testSqlCondition, condtionTestDTO);
    },

    *disableTask(action, { call }) {
      const { ids } = action.payload;
      return yield call(disableTask, ids);
    },

    *getDataCount(action, { call }) {
      const { datasourceId, sql } = action.payload;
      return yield call(getDataCount, sql, datasourceId);
    },

    *enableTask(action, { call }) {
      const { ids } = action.payload;
      return yield call(enableTask, ids);
    },

    *startTask(action, { call }) {
      const { ids } = action.payload;
      const response = yield call(startTask, ids);
      return response;
    },

    *dxpTaskSearch(action, { call, put }) {
      const result = yield call(dxpTaskSearch, action.payload);
      const resultData = result.data === null ? [] : result.data;
      const tableResult = { total: resultData.iTotalRecords, data: resultData.data };
      yield put({
        type: 'setState',
        payload: {
          tableResult,
        },
      });
      return tableResult;
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
