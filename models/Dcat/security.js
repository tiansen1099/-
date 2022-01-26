import {
  fetchTransformResult,
  fpeAlgorithm,
  createFpeSecretKey,
  tamperProofAssistant,
  fetchKeyList,
  generateKeypairs,
  updateSecret,
  downloadKeypairs,
  downloadSDK,
  downloadFpeSDK,
  antiReplayAssistant,
  encryptionAssistant,
  encodeRequestParams,
  fetchLicenseList,
  saveLicense,
  lookPubKey,
} from '@/services/Dcat/security';
import { message } from 'antd';

export default {
  namespace: 'security',

  state: {
    sm2: {},
    rsa2: {},
    licenseList: {},
  },

  effects: {
    /**
     * 明文与密文转换
     * @param {*} payload
     * @param {*} call
     */
    *fetchTransformResult({ payload }, { call }) {
      const result = yield call(fetchTransformResult, payload);
      if (!result) {
        message.error('明文与密文转换失败，接口调用失败!');
      }
      return result;
    },

    /**
     * FPE明文与密文转换
     * @param {*} payload
     * @param {*} call
     */
     *fpeAlgorithm({ payload }, { call }) {
      const result = yield call(fpeAlgorithm, payload);
      if (!result) {
        message.error('FPE明文与密文转换失败，接口调用失败!');
      }
      return result;
    },

    /**
     * FPE密钥生成
     * @param {*} payload
     * @param {*} call
     */
     *createFpeSecretKey(_, { call }) {
      const result = yield call(createFpeSecretKey);
      if (!result) {
        message.error('生成FPE密钥失败，接口调用失败!');
      }
      return result;
    },

    /**
     * 防篡改助手
     * @param {*} payload
     * @param {*} call
     */
    *tamperProofAssistant({ payload }, { call }) {
      const result = yield call(tamperProofAssistant, payload);
      if (!result) {
        message.error('防篡改助手接口调用失败!');
      }
      return result;
    },

    /**
     * 获取密钥列表
     */
    *fetchKeyList(_, { call, put }) {
      const result = yield call(fetchKeyList);
      if (result && result.code === 200) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < result.data.length; i++) {
          const { account, createdTime, keyType, keyFormat, priKey, pubKey } = result.data[i];
          yield put({
            type: 'setState',
            payload: {
              [keyType]: {
                account,
                type: keyType,
                algorithm: i === 0 ? 'SM2(国密)' : 'RSA2',
                timestamp: pubKey ? new Date(createdTime).getTime() : '',
                status: pubKey ? 1 : 0,
                format: keyFormat,
                length: '2048位(bit)',
                public: pubKey,
                private: priKey,
              },
            },
          });
        }
      } else {
        message.error('获取密钥列表失败，接口调用失败!');
      }
    },

    /**
     * 生成或修改密钥
     */
    *generateKeypairs({ payload, callback }, { call, put, select }) {
      const { keyType: type, keyFormat: format } = payload;
      if (type || format) {
        const result = yield call(generateKeypairs, payload);
        if (result && result.code === 200) {
          const { creationTime, keyType, keyFormat, priKey, pubKey } = result.data[0];
          yield call(updateSecret, result.data[0]);
          const security = yield select(state => state.security);
          const { [type]: data } = security;
          if (creationTime) {
            yield put({
              type: 'setState',
              payload: {
                [keyType]: {
                  ...data,
                  timestamp: pubKey ? new Date(creationTime).getTime() : undefined,
                  status: pubKey ? 1 : 0,
                  format: keyFormat,
                  length: '2048位(bit)',
                  public: pubKey,
                  private: priKey,
                },
              },
            });
            if (callback && typeof callback === 'function') {
              callback();
            }
          }
        } else {
          message.error('密钥生成失败，接口调用失败!');
        }
      } else {
        message.error('获取参数失败，参数缺失!');
      }
    },

    /**
     * 下载密钥
     */
    *downloadKeypairs({ payload, callback }, { call }) {
      const response = yield call(downloadKeypairs, payload);
      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        if (response && response.code === 205) {
          message.error('密钥生成时间超过3天无法下载!');
          return;
        }
        message.error('下载失败');
      }
    },

    /**
     * 下载SDK
     */
    *downloadSDK({ payload, callback }, { call }) {
      const response = yield call(downloadSDK, payload);
      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.warning('下载失败');
      }
    },

    /**
     * 下载FPE-SDK
     */
     *downloadFpeSDK({ payload, callback }, { call }) {
      const response = yield call(downloadFpeSDK, payload);
      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.warning('下载失败');
      }
    },

    /**
     * 加密助手
     * @param {*} payload
     * @param {*} call
     */
    *encryptionAssistant({ payload }, { call }) {
      const result = yield call(encryptionAssistant, payload);
      if (!result) {
        message.error('加密助手接口调用失败!');
      }
      return result;
    },

    /**
     * 加密助手-encode
     * @param {*} payload
     * @param {*} call
     */
    *encodeRequestParams({ payload }, { call }) {
      const result = yield call(encodeRequestParams, payload);
      if (!result) {
        message.error('加密助手encode接口调用失败!');
      }
      return result;
    },

    /**
     * 防重放助手
     * @param {*} payload
     * @param {*} call
     */
    *antiReplayAssistant({ payload }, { call }) {
      const result = yield call(antiReplayAssistant, payload);
      if (!result) {
        message.error('防重放助手接口调用失败!');
      }
      return result;
    },

    /**
     * 获取密钥列表
     * @param {*} action
     * @param {*} param1
     */
    *fetchLicenseList(action, { call, put }) {
      const queryResult = yield call(fetchLicenseList, action.payload); // TODO:
      yield put({
        type: 'setState',
        payload: {
          licenseList: {
            total: queryResult.total,
            data: queryResult.data,
          },
        },
      });
    },

    *saveLicense(action, { call, put }) {
      const result = yield call(saveLicense, action.payload); // TODO:
      if (result && result.code === 200) {
        yield put({
          type: 'setState',
          payload: { saveUserResult: result.code },
        });
        message.success('许可证书保存成功！');
      } else {
        message.warning(result.msg);
      }
      return result;
    },
    /**
     * 获取公钥信息
     * @param {*} action
     * @param {*} param1
     */
    *lookPubKey(action, { call }) {
      const queryResult = yield call(lookPubKey, action.payload); //
      if (queryResult && queryResult.code === 200) {
        return queryResult.data.pubKey;
      }
      return {};
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
