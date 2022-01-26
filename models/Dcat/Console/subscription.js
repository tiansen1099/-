import {
  getDatasourcesByCategories,
  getSchemasByDatasource,
  saveOrUpdateSubscription,
  updateSubscription,
  getTriggerTimeList,
  getTableSearchSubscribedResource,
  disableSubscription,
  enableSubscription,
  doUnsubscribe,
  getRelationSubDetail,
  startSubscribeTask,
  existReviewingAndSubscribedDistByAccount,
  existReviewingAndSubscribedDistByOrg,
  startSubscribeTaskWithConfig,
  getSubscribeById,
  checkPassword,
} from '@/services/Dcat/subscription';
import { message } from 'antd';

export default {
  namespace: 'subscription',
  state: {
    datasourceList: [],
    triggerTimeList: {},
    schemaList: [],
    subscribedResource: {
      data: [],
      total: 0,
    },
  },
  effects: {
    *getDatasourcesByCategories(action, { put, call }) {
      const { payload } = action;
      const { categories } = payload;
      const datasourceList = yield call(getDatasourcesByCategories, categories);
      yield put({
        type: 'saveState',
        payload: {
          datasourceList,
        },
      });
      return datasourceList;
    },

    *getTriggerTimeList(action, { call }) {
      const { cronValue, count } = action.payload;
      return yield call(getTriggerTimeList, cronValue, count);
    },

    *getSchemasByDatasource(action, { put, call }) {
      const { datasource } = action.payload;
      const schemaList = yield call(getSchemasByDatasource, datasource);
      yield put({
        type: 'saveState',
        payload: {
          schemaList,
        },
      });
      return schemaList;
    },

    *saveOrUpdateSubscription(action, { call }) {
      const { subscription } = action.payload;
      const response = yield call(saveOrUpdateSubscription, subscription);
      return response;
    },

    *updateSubscription(action, { call }) {
      const { subscription } = action.payload;
      const response = yield call(updateSubscription, subscription);
      return response;
    },

    *getTableSearchSubscribedResource(action, { put, call }) {
      const { searchingParam } = action.payload;
      const result = yield call(getTableSearchSubscribedResource, searchingParam);
      const subscribedResource = { data: result.data, total: result.iTotalRecords };
      yield put({
        type: 'saveState',
        payload: {
          subscribedResource,
        },
      });
      return subscribedResource;
    },

    *disableSubscription(action, { call }) {
      const { ids } = action.payload;
      return yield call(disableSubscription, ids);
    },

    *enableSubscription(action, { call }) {
      const { ids } = action.payload;
      return yield call(enableSubscription, ids);
    },

    *doUnsubscribe(action, { call }) {
      const { ids } = action.payload;
      const response = yield call(doUnsubscribe, ids);
      return response;
    },

    *getSubscribeById(action, { call }) {
      const { id } = action.payload;
      const response = yield call(getSubscribeById, id);
      if (response && response.code === 200) {
        return response.data;
      }
      message.error('获取订阅信息失败：' + response.msg);
      return response.data;
    },

    *getRelationSubDetail(action, { call }) {
      const { subId } = action.payload;
      return yield call(getRelationSubDetail, subId);
    },
    *startSubscribeTask(action, { call }) {
      const { ids } = action.payload;
      const response = yield call(startSubscribeTask, ids);
      return response;
    },
    *startSubscribeTaskWithConfig(action, { call }) {
      const taskConfig = action.payload;
      const response = yield call(startSubscribeTaskWithConfig, taskConfig);
      return response;
    },

    *existReviewingAndSubscribedDistByAccount(action, { call }) {
      const { accounts } = action.payload;
      return yield call(existReviewingAndSubscribedDistByAccount, accounts);
    },

    *existReviewingAndSubscribedDistByOrg(action, { call }) {
      const { orgCode } = action.payload;
      return yield call(existReviewingAndSubscribedDistByOrg, orgCode);
    },

    *checkPassword({ payload }, { call }) {
      const result = yield call(checkPassword, payload);
      if (!result) {
        message.error('校验密码失败!');
      }
      return result;
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
