import {
  getDistributionDetail,
  getDBDistributionDetail,
  getDBDistributionColumn,
  getDBDistributionSubscription,
} from '@/services/Dcat/distribution';

export default {
  namespace: 'distributionDetail',
  state: {
    data: {},
    column: '',
    subscription: {},
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
    *getDistributionDetail(action, { put, call }) {
      const { code } = action.payload;
      const data = yield call(getDistributionDetail, code);
      yield put({
        type: 'setState',
        payload: {
          data,
        },
      });
      return data;
    },
    *getDBDistributionDetail(action, { put, call }) {
      const { code } = action.payload;
      const data = yield call(getDBDistributionDetail, code);
      yield put({
        type: 'setState',
        payload: {
          data,
        },
      });
      return data;
    },
    *getDBDistributionColumn(action, { put, call }) {
      const { code, searchNameValue, searchRemarksValue } = action.payload;
      const column = yield call(getDBDistributionColumn, code, searchNameValue, searchRemarksValue);
      yield put({
        type: 'setState',
        payload: {
          column,
        },
      });
      return column;
    },
    *getDBDistributionSubscription(action, { put, call }) {
      const { code } = action.payload;
      const subscription = yield call(getDBDistributionSubscription, code);
      yield put({
        type: 'setState',
        payload: {
          subscription,
        },
      });
      return subscription;
    },
  },
};
