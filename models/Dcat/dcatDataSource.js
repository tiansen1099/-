import {
  dataSourcesSearch,
  dataSourcesGetAll,
  dataSourcesTestConnection,
  dataSourcesSave,
  dataSourcesConfigSave,
  dataSourcesGet,
  dataSourcesDelete,
  getAllDatasourcesByTypes,
  getAllDatasourcesByCategorys,
} from '@/services/Dcat/datasource';

export default {
  namespace: 'dcatDataSource',

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
    *dataSourcesSearch(action, { call, put }) {
      const response = yield call(dataSourcesSearch, action.payload);
      const tableResult = { total: response.iTotalRecords, data: response.data };
      yield put({
        type: 'setState',
        payload: {
          tableResult,
        },
      });
      return tableResult;
    },

    /**
     * 获取全部数据源
     */
    *dataSourcesGetAll(_, { call, put }) {
      const response = yield call(dataSourcesGetAll);
      if (response) {
        yield put({
          type: 'setState',
          payload: {
            allDataSources: response,
          },
        });
      }
      return response;
    },

    /**
     * 测试数据源连接情况
     * @param {*} action
     * @param {*} param1
     */
    *dataSourcesTestConnection(action, { call }) {
      const { datasource } = action.payload;
      const testResponse = yield call(dataSourcesTestConnection, datasource);
      return testResponse;
    },

    /**
     * 保存数据源
     * @param {*} action
     * @param {*} param1
     */
    *dataSourcesSave(action, { call }) {
      const { datasource } = action.payload;
      const saveResponse = yield call(dataSourcesSave, datasource);
      return saveResponse;
    },

    /**
     * 保存数据源配置
     * @param {*} action
     * @param {*} param1
     */
    *dataSourcesConfigSave(action, { call }) {
      const { datasourceConfig } = action.payload;
      const saveResponse = yield call(dataSourcesConfigSave, datasourceConfig);
      return saveResponse;
    },

    /**
     * 获取数据源
     * @param {*} action
     * @param {*} param1
     */
    *dataSourcesGet(action, { call, put }) {
      const { id } = action.payload;
      const result = yield call(dataSourcesGet, id);
      yield put({
        type: 'setState',
        payload: {
          dataSource: result.code === 200 ? result.data : {},
        },
      });
      return result;
    },

    /**
     * 删除数据源
     * @param {*} action
     * @param {*} param1
     */
    *dataSourcesDelete(action, { call }) {
      const { ids } = action.payload;
      return yield call(dataSourcesDelete, ids);
    },

    /**
     * 按类型获取全部数据源连接
     * @param {*} action
     * @param {*} param1
     */
    *getAllDatasourcesByTypes(action, { call, put }) {
      const { types } = action.payload;
      const response = yield call(getAllDatasourcesByTypes, types);
      if (response) {
        yield put({
          type: 'setState',
          payload: {
            allDataSources: response,
          },
        });
      }
      return response;
    },

    /**
     * 按类型获取全部数据源连接
     * @param {*} action
     * @param {*} param1
     */
    *getAllDatasourcesByCategorys(action, { call, put }) {
      const { categorys } = action.payload;
      const response = yield call(getAllDatasourcesByCategorys, categorys);
      if (response) {
        yield put({
          type: 'setState',
          payload: {
            allDataSourcesByCategorys: response,
          },
        });
      }
      return response;
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
