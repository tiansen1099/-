import { getSystemConfigByCode } from '@/services/Platform/Service/serviceApi';

export default {
  namespace: 'serviceApi',

  state: {
    systemConfigList: [],
  },

  effects: {
    /**
     * 根据code查询系统配置
     * @param {*} param0
     * @param {*} param1
     */
    *getSystemConfigByCode({ payload }, { call, put }) {
      const { code } = payload;
      const response = yield call(getSystemConfigByCode, code);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { systemConfigList: response.data },
        });
        return response.data;
      }
      return [];
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
