import { getAllLicense } from '@/services/Platform/Service/license';

export default {
  namespace: 'license',

  state: {
    licenseList: [],
  },

  effects: {
    /**
     * 查询license列表
     * @param {*} _
     * @param {*} param1
     */
    *queryAllLicense(_, { call, put }) {
      const queryResult = yield call(getAllLicense);
      yield put({
        type: 'saveState',
        payload: { licenseList: queryResult },
      });
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
