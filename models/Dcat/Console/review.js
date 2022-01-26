import {
  tableSearch,
  tableHistorySearch,
  passReview,
  rejectReview,
  getReviewDetail,
} from '@/services/Dcat/review';
import { getDBDistributionDetail } from '@/services/Dcat/distribution';
import { getSubscribeById } from '@/services/Dcat/subscription';
import { message } from 'antd';

export default {
  namespace: 'review',

  state: {
    tableResult: {
      length: 0,
      data: [],
    },
    histroyTableResult: {
      length: 0,
      data: [],
    },
    reviewDetail: {},
    distribution: {},
    subscription: {},
  },

  effects: {
    *getTableSearch(action, { call, put }) {
      const result = yield call(tableSearch, action.payload);
      if (result && result.code === '0' && result.data && result.props) {
        const tableResult = { total: result.props.recordsTotal, data: result.data };
        yield put({
          type: 'setState',
          payload: {
            tableResult,
          },
        });
      } else {
        message.error('查询待审核列表失败。');
      }
    },

    *getTableHistorySearch(action, { call, put }) {
      const result = yield call(tableHistorySearch, action.payload);
      if (result && result.code === '0' && result.data && result.props) {
        const histroyTableResult = { total: result.props.recordsTotal, data: result.data };
        yield put({
          type: 'setState',
          payload: {
            histroyTableResult,
          },
        });
      } else {
        message.error('查询待审核历史列表失败。');
      }
    },

    *passReview(action, { call, put }) {
      const httpResult = yield call(passReview, action.payload);
      if (httpResult === undefined) {
        message.error('审核通过失败。');
      } else if (httpResult.code !== 200) {
        message.error('审核通过失败，' + httpResult.msg);
      } else {
        message.success('审核已通过');
        const { searchParam } = action.payload;
        const result = yield call(tableSearch, searchParam);
        if (result && result.code === '0' && result.data && result.props) {
          const tableResult = { total: result.props.recordsTotal, data: result.data };
          yield put({
            type: 'setState',
            payload: {
              tableResult,
            },
          });
        }
      }
    },

    *rejectReview(action, { call, put }) {
      const httpResult = yield call(rejectReview, action.payload);
      if (httpResult === undefined) {
        message.error('审核驳回失败。');
      } else if (httpResult.code !== 200) {
        message.error('审核驳回失败，' + httpResult.msg);
      } else {
        message.success('审核已驳回');
        const { searchParam } = action.payload;
        const result = yield call(tableSearch, searchParam);
        if (result && result.code === '0' && result.data && result.props) {
          const tableResult = { total: result.props.recordsTotal, data: result.data };
          yield put({
            type: 'setState',
            payload: {
              tableResult,
            },
          });
        }
      }
    },

    *getReviewDetail(action, { call, put }) {
      const { id } = action.payload;
      const result = yield call(getReviewDetail, id);
      if (result === undefined) {
        message.error('获取审核详情失败。');
      } else if (result.code !== 200) {
        message.error('获取审核详情失败，' + result.msg);
      } else {
        yield put({
          type: 'setState',
          payload: {
            reviewDetail: result.data,
          },
        });
      }
    },

    *getDistributionDetail(action, { call, put }) {
      const { code } = action.payload;
      const result = yield call(getDBDistributionDetail, code);
      yield put({
        type: 'setState',
        payload: {
          distribution: result,
        },
      });
    },

    *getSubscribeById(action, { call, put }) {
      const { id } = action.payload;
      const response = yield call(getSubscribeById, id);
      if (response && response.code === 200) {
        yield put({
          type: 'setState',
          payload: {
            subscription: response.data,
          },
        });
        return;
      }
      message.error('获取订阅信息失败：' + response.msg);
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
