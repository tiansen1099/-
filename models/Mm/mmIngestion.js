import {
  pagingIngestionInstances,
  getIngestionInstancesByIds,
  getIngestionConfig,
} from '@/services/Mm/mmIngestion';

export default {
  namespace: 'mmIngestion',

  state: {
    ingestionInstancesResult: '',
    ingestionInstances: [],
    ingestionConfig: {},
  },

  effects: {
    /**
     * 检索采集任务执行情况
     * @param {*} action
     * @param {*} param1
     */
    *pagingIngestionInstances(action, { call, put }) {
      const { pageQuery } = action.payload;
      const response = yield call(pagingIngestionInstances, pageQuery);
      if (response) {
        yield put({
          type: 'setState',
          payload: {
            ingestionInstancesResult: response,
          },
        });
      }
      return response;
    },

    *getIngestionInstancesByIds(action, { call, put }) {
      const { ingestionIds } = action.payload;
      const response = yield call(getIngestionInstancesByIds, ingestionIds);
      if (response) {
        yield put({
          type: 'setState',
          payload: {
            ingestionInstances: response,
          },
        });
      }
      return response;
    },

    *getIngestionConfig(action, { call, put }) {
      const { ingestionId } = action.payload;
      const response = yield call(getIngestionConfig, ingestionId);
      if (response) {
        yield put({
          type: 'saveState',
          payload: {
            ingestionConfig: response,
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
