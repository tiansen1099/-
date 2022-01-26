import {
  getDbAnalyzeStatisticInfo,
  getTotalInfo,
  getDistributionCategoryRate,
  getLastYearDistributionTotalAnalysis,
  getDbDistBusinessCategoryAnalysis,
  getApiDistBusinessCategoryAnalysis,
  getApiDistributionTotalAnalysis,
  getDbDistributionTotalAnalysis,
  getFileDistributionTotalAnalysis,
  getPublishDistributionRate,
  getDistPublishSubscribeAnalysis,
  getAssetRate,
  getAssetTypeAnalysis,
  getDistInvokeTotalAnalysis,
  getDistributionInvokeInfo,
  getAssetCollectInfo,
  getDBSubscribeInfo,
  getSubscribedCount,
  getApiAnalyzeStatisticInfo,
  getServiceMap,
  getCallStatistics
} from '@/services/Dcat/monitor';

export default {
  namespace: 'monitor',
  state: {
    totalInfo: [],
    distributionCategoryRate: [],
    dbDistBusinessCategoryAnalysis: {},
    apiDistBusinessCategoryAnalysis: {},
    lastYearDistributionTotalAnalysis: [],
    apiDistributionTotalAnalysis: [],
    dbDistributionTotalAnalysis: [],
    fileDistributionTotalAnalysis: [],
    publishDistributionRate: [],
    distPublishSubscribeAnalysis: [],
    assetRate: [],
    assetTypeAnalysis: {},
    distInvokeTotalAnalysis: [],
    distributionInvokeInfo: [],
    assetCollectInfo: [],
    dbSubscribeInfo: [],
    subscribedCount: {},
    serviceMapData: {},
  },

  effects: {
    /**
     * 获取数据监控全局统计信息
     */
     *getDbAnalyzeStatisticInfo(_, { call }) {
      const data = yield call(getDbAnalyzeStatisticInfo);
      if (data) {
        return data;
      }
      return null;
    },

    /**
     * 查询统计数据
     * @param {*} _
     * @param {*} param1
     */
    *getTotalInfo(action, { call, put }) {
      const { modules } = action.payload;
      const data = yield call(getTotalInfo, modules);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            totalInfo: data,
          },
        });
      }
    },

    /**
     * 查询资源占比
     * @param {*} _
     * @param {*} param1
     */
    *getDistributionCategoryRate(_, { call, put }) {
      const data = yield call(getDistributionCategoryRate);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            distributionCategoryRate: data,
          },
        });
      }
    },

    /**
     * 服务资源-业务分类分析
     * @param {*} _
     * @param {*} param1
     */
    *getDbDistBusinessCategoryAnalysis(_, { call, put }) {
      const data = yield call(getDbDistBusinessCategoryAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            dbDistBusinessCategoryAnalysis: data,
          },
        });
      }
    },

    /**
     * 数据资源-业务分类分析
     * @param {*} _
     * @param {*} param1
     */
    *getApiDistBusinessCategoryAnalysis(_, { call, put }) {
      const data = yield call(getApiDistBusinessCategoryAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            apiDistBusinessCategoryAnalysis: data,
          },
        });
      }
    },

    /**
     * 去年某种资源总量
     * @param {*} _
     * @param {*} param1
     */
    *getLastYearDistributionTotalAnalysis(action, { call, put }) {
      const { distType } = action.payload;
      const data = yield call(getLastYearDistributionTotalAnalysis, distType);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            lastYearDistributionTotalAnalysis: data,
          },
        });
      }
    },

    /**
     * 服务资源总量
     * @param {*} _
     * @param {*} param1
     */
    *getApiDistributionTotalAnalysis(_, { call, put }) {
      const data = yield call(getApiDistributionTotalAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            apiDistributionTotalAnalysis: data,
          },
        });
      }
    },

    /**
     * 数据资源总量
     * @param {*} _
     * @param {*} param1
     */
    *getDbDistributionTotalAnalysis(_, { call, put }) {
      const data = yield call(getDbDistributionTotalAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            dbDistributionTotalAnalysis: data,
          },
        });
      }
    },

    /**
     * 文件资源总量
     * @param {*} _
     * @param {*} param1
     */
    *getFileDistributionTotalAnalysis(_, { call, put }) {
      const data = yield call(getFileDistributionTotalAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            fileDistributionTotalAnalysis: data,
          },
        });
      }
    },

    /**
     * 数据资源总量
     * @param {*} _
     * @param {*} param1
     */
    *getPublishDistributionRate(_, { call, put }) {
      const data = yield call(getPublishDistributionRate);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            publishDistributionRate: data,
          },
        });
      }
    },

    /**
     * 数据资源总量
     * @param {*} _
     * @param {*} param1
     */
    *getDistPublishSubscribeAnalysis(_, { call, put }) {
      const data = yield call(getDistPublishSubscribeAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            distPublishSubscribeAnalysis: data,
          },
        });
      }
    },

    /**
     * 资产占比
     * @param {*} _
     * @param {*} param1
     */
    *getAssetRate(_, { call, put }) {
      const data = yield call(getAssetRate);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            assetRate: data,
          },
        });
      }
    },

    /**
     * 资产占比
     * @param {*} _
     * @param {*} param1
     */
    *getAssetTypeAnalysis(_, { call, put }) {
      const data = yield call(getAssetTypeAnalysis);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            assetTypeAnalysis: data,
          },
        });
      }
    },

    /**
     * 资源调阅总量分析
     * @param {*} _
     * @param {*} param1
     */
    *getDistInvokeTotalAnalysis(action, { call, put }) {
      const { modules } = action.payload;
      const data = yield call(getDistInvokeTotalAnalysis, modules);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            distInvokeTotalAnalysis: data,
          },
        });
      }
    },

    /**
     * 资源调阅统计信息
     * @param {*} _
     * @param {*} param1
     */
    *getDistributionInvokeInfo(action, { call, put }) {
      const { modules } = action.payload;
      const data = yield call(getDistributionInvokeInfo, modules);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            distributionInvokeInfo: data,
          },
        });
      }
    },

    /**
     * 资产采集监控信息
     * @param {*} _
     * @param {*} param1
     */
    *getAssetCollectInfo(_, { call, put }) {
      const data = yield call(getAssetCollectInfo);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            assetCollectInfo: data,
          },
        });
      }
    },

    /**
     * 数据订阅监控信息
     */
    *getDBSubscribeInfo(_, { call, put }) {
      const data = yield call(getDBSubscribeInfo);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            dbSubscribeInfo: data,
          },
        });
      }
    },

    /**
     * 控制台首页，获取登录用户拥有的数据、服务类型的资源的被订阅数（仅包含订阅成功的个数）
     */
    *getSubscribedCount(_, { call, put }) {
      const data = yield call(getSubscribedCount);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            subscribedCount: data,
          },
        });
      }
    },

    /**
     * 获取机构、用户、API资源与订阅数量信息 chaizq
     */
    *getApiAnalyzeStatisticInfo(_, { call }) {
      const data = yield call(getApiAnalyzeStatisticInfo);
      if (data) {
        return data;
      }
      return null;
    },

    /**
     * 查询统计数据
     * @param {*} _
     * @param {*} param1
     */
    *getServiceMap(_, { call, put }) {
      const data = yield call(getServiceMap);
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            serviceMapData: data,
          },
        });
      }
    },
    /**
     * 服务调用统计
     * @param {*} action
     * @param {*} call
     */
    *getCallStatistics(action, { call }) {
      const data = action.payload;
      const res = yield call(getCallStatistics, data);
      if (res) {
        return res;
      }
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
