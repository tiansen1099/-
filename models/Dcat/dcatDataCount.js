import hbaseDataCount from '@/services/Dcat/dataCount';

export default {
  namespace: 'dcatDataCount',

  state: {
    dataCountResult: {},
  },

  effects: {
    /**
     * 获取HBASE库表数据量
     */
    *dhbaseDataCountGet(action, { call }) {
      const { dataSetName } = action.payload;
      return yield call(hbaseDataCount, dataSetName);
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
