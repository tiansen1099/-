import {
  queryProductType,
  queryProductCode,
  queryFileLimit,
  queryProductConfigByKey,
  getSystemConfigList,
  saveOrUpdateSystemConfig,
} from '@/services/sysconfig';
import DiResponse from '@/components/DiResponse';
import { urlPreContext } from '@/defaultSettings';

export default {
  namespace: 'sysconfig',

  state: {
    fontEndPath: '',
    productTypeList: [],
    productCodeList: [],
    fileLimit: '',
    productUrl: '',
  },

  effects: {
    /**
     * 查询前端地址
     */
    *queryFontEndPath(_, { put }) {
      let fontPath = '';
      if (!window.location.origin) {
        fontPath =
          window.location.protocol +
          '//' +
          window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
      } else {
        fontPath = `${window.location.origin}${urlPreContext}`;
      }
      yield put({
        type: 'saveState',
        payload: { fontEndPath: fontPath },
      });
      return fontPath;
    },

    /**
     * 查询产品种类
     */
    *queryProductTypeList(_, { call, put }) {
      const queryResult = yield call(queryProductType);
      yield put({
        type: 'saveState',
        payload: { productTypeList: queryResult },
      });
    },

    /**
     * 查询产品Code
     */
    *queryProductCodeList(_, { call, put }) {
      const queryResult = yield call(queryProductCode);
      yield put({
        type: 'saveState',
        payload: { productCodeList: queryResult },
      });
    },

    /**
     * 查询上传文件限制
     */
    *queryFileLimit(_, { call, put }) {
      const queryResult = yield call(queryFileLimit);
      yield put({
        type: 'saveState',
        payload: { fileLimit: queryResult.data },
      });
    },

    /**
     * 根据产品关键字查询服务地址
     */
    *queryProductConfigByKey(productKey, { call, put }) {
      const queryResult = yield call(productKey, queryProductConfigByKey);
      yield put({
        type: 'saveState',
        payload: { httpResult: queryResult },
      });
    },

    /**
     * 系统配置-查询
     */
    *getSystemConfigList(_, { call }) {
      const response = yield call(getSystemConfigList);
      if (response && response !== null) {
        return response;
      }
      DiResponse.error(response.msg || '获取系统配置列表失败');
      return null;
    },

    /**
     * 系统配置-更新
     */
    *saveOrUpdateSystemConfig({ payload }, { call }) {
      const response = yield call(saveOrUpdateSystemConfig, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
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
