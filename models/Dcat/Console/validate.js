import {
  getOrgValidateSystemMap,
  saveOrUpdateValidateSystem,
  testConnection,
  getPagingValidateRecords,
  getValidateRecordDetail,
} from '@/services/Dcat/validate';
import { message } from 'antd';

export default {
  namespace: 'validate',
  state: {
    orgValidateSystemMap: {},
    validateRecords: [],
    validateRecordDetail: {},
  },
  effects: {
    *getOrgValidateSystemMap(action, { put, call }) {
      const { payload } = action;
      const { orgCodes } = payload;
      const orgValidateSystemMap = yield call(getOrgValidateSystemMap, orgCodes);
      yield put({
        type: 'saveState',
        payload: {
          orgValidateSystemMap,
        },
      });
      return orgValidateSystemMap;
    },

    *saveOrUpdateValidateSystem(action, { call }) {
      const { orgCode, url } = action.payload;
      const response = yield call(saveOrUpdateValidateSystem, orgCode, url);
      return response;
    },

    *testConnection(action, { call }) {
      const { url } = action.payload;
      const response = yield call(testConnection, url);
      return response;
    },

    /**
     * 分页查询对账结果
     */
    *getPagingValidateRecords({ payload }, { call, put }) {
      const { start, length, orderCol, orderDir, conditions } = payload;
      const response = yield call(
        getPagingValidateRecords,
        start,
        length,
        orderCol,
        orderDir,
        conditions
      );
      if (response.code !== 200) {
        message.error('分页查询对账信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            validateRecords: response.data.data,
          },
        });
        return response.data;
      }
      return null;
    },

    /**
     * 查询对账结果详情
     */
    *getValidateRecordDetail({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(getValidateRecordDetail, id);
      if (response.code !== 200) {
        message.error('查询对账详情信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            validateRecordDetail: response.data,
          },
        });
        return response.data;
      }
      return null;
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
