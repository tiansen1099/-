import { getTranRuleList } from '@/services/Dcat/desensitization';

export default {
  namespace: 'desensitization',
  state: {},
  effects: {

    /**
     * 获取脱敏规则
     */
    *getTranRuleList({ payload }, { call }) {
        const result = yield call(getTranRuleList, payload);
        return result;
      }
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
