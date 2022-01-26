import { message } from 'antd';
import {
  queryAllDomainInfo,
  queryDomainList,
  saveOrUpdateDomain,
  queryDomain,
  deleteDomain,
} from '@/services/Platform/Service/domain';
import { queryProductMenu } from '@/services/Platform/Service/product';

export default {
  namespace: 'domain',
  state: {
    domainInfoList: [],
    userDomainList: [],
    saveDomainResult: {},
    deleteDomainResult: {},
    domain: {},
  },

  effects: {
    /**
     * 查询Domain信息
     * @param {*} _
     * @param {*} param1
     */
    *queryDominInfoList(_, { call, put }) {
      const queryResult = yield call(queryAllDomainInfo);
      yield put({
        type: 'saveState',
        payload: { domainInfoList: queryResult },
      });
    },

    /**
     * 查询用户所能查看的域信息
     * @param {*} _
     * @param {*} param1
     */
    *queryUserDomainList(_, { call, put }) {
      const queryResult = yield call(queryDomainList);
      yield put({
        type: 'saveState',
        payload: { userDomainList: queryResult },
      });
    },

    /**
     * 保存或更新域信息
     */
    *saveOrUpdateDomain({ payload }, { call, put }) {
      const { domainToSave } = payload;
      const response = yield call(saveOrUpdateDomain, domainToSave);
      yield put({
        type: 'saveState',
        payload: { saveDomainResult: response },
      });
      // 加载保存后的域信息
      const queryResult = yield call(queryAllDomainInfo);
      yield put({
        type: 'saveState',
        payload: { domainInfoList: queryResult },
      });
    },

    /**
     * 删除域
     * @param {*} param0
     * @param {*} param1
     */
    *deleteDomain({ payload }, { call, put }) {
      const { domainId } = payload;
      const response = yield call(deleteDomain, domainId);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { deleteDomainResult: response },
        });
      } else {
        message.warning('域信息删除失败！');
      }
      // 加载保存后的域信息
      const queryResult = yield call(queryAllDomainInfo);
      yield put({
        type: 'saveState',
        payload: { domainInfoList: queryResult },
      });
      // 重新加载产品menu
      const productMenuResult = yield call(queryProductMenu);
      yield put({
        type: 'product/saveState',
        payload: { productMenu: productMenuResult },
      });
    },

    /**
     * 根据id查询domain
     */
    *queryDomain({ payload }, { call, put }) {
      const { domainId } = payload;
      const response = yield call(queryDomain, domainId);
      yield put({
        type: 'saveState',
        payload: { domain: response },
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
