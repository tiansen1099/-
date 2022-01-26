import { createDsResources, deleteDsResources } from '@/services/Dcat/dsClient';

export default {
  namespace: 'dcatDsClient',
  state: {},
  effects: {
    /**
     * 创建数据服务资源
     */
    *createDsResources(action, { call }) {
      const { serviceContainer } = action.payload;
      return yield call(createDsResources, serviceContainer);
    },

    /**
     * 创建删除服务资源
     */
    *deleteDsResources(action, { call }) {
      const { ids } = action.payload;
      return yield call(deleteDsResources, ids);
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
