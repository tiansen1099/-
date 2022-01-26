import {
  getDcatTotalInfo,
  getDcatAssociatedDistListByAssetIds,
  saveAssetStatuses,
  getAssetStatusByDistCode,
} from '@/services/Dcat/asset';
import DiResponse from '@/components/DiResponse';

export default {
  namespace: 'asset',
  state: {
    statistic: {},
    associatedDistribution: [],
  },
  reducers: {
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    /**
     * 获取统计数据
     */
    *getStatistic(_, { call, put }) {
      const response = yield call(getDcatTotalInfo);
      if (response === undefined) {
        DiResponse.error('获取统计数据失败!');
      } else if (response.code !== 200) {
        DiResponse.error('获取统计数据失败!' + response.msg);
      } else {
        yield put({
          type: 'setState',
          payload: {
            statistic: response.data,
          },
        });
      }
    },

    /**
     * 查询已发布的库表类型资产关联的资源信息集合
     */
    *getAssociatedDistListByAssetIds(action, { call, put }) {
      const { assetIds } = action.payload;
      const associatedDistribution = yield call(getDcatAssociatedDistListByAssetIds, assetIds);
      yield put({
        type: 'setState',
        payload: {
          associatedDistribution,
        },
      });
    },

    /**
     * 保存资产状态
     * @param {*} action
     * @param {*} param1
     */
    *saveAssetStatuses(action, { call }) {
      const { assetStatuses } = action.payload;
      const response = yield call(saveAssetStatuses, assetStatuses);
      return response;
    },

    /**
     * 根据资源code获取资产id
     * @param {*} action 
     * @param {*} param1 
     */
    *getAssetStatusByDistCode(action, { call }) {
      const { distCode } = action.payload;
      const response = yield call(getAssetStatusByDistCode, distCode);
      return response;
    }
  },
};
