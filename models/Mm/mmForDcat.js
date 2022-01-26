import {
  saveDiDatasource,
  saveDcatIngestionConfig,
  getSchemaByDbsource,
  ingestionSelectRun,
  updateSqlElement,
  deleteSqlElement,
} from '@/services/Mm/mmForDcat';
import { message } from 'antd';

export default {
  namespace: 'mmForDcat',

  state: {
    schemaList: [],
  },

  effects: {
    /**
     * 保存di数据源
     * @param {*} action
     * @param {*} param1
     */
    *saveDiDatasource(action, { call }) {
      const { datasource } = action.payload;
      const response = yield call(saveDiDatasource, datasource);
      return response;
    },

    /**
     * 获取数据库模式
     * @param {*} action
     * @param {*} param1
     */
    *getSchemaByDbsource(action, { call, put }) {
      const { datasource } = action.payload;
      const response = yield call(getSchemaByDbsource, datasource);
      if (response) {
        const { code, msg, data } = response;
        if (code === 200) {
          yield put({
            type: 'setState',
            payload: {
              schemaList: JSON.parse(data),
            },
          });
        } else {
          yield put({
            type: 'setState',
            payload: {
              schemaList: [],
            },
          });
          message.error('获取数据库模式失败:' + msg);
        }
      }
      return response;
    },

    /**
     * 保存DCAT平台创建的采集配置
     * @param {*} action
     * @param {*} param1
     */
    *saveDcatIngestionConfig(action, { call }) {
      const { ingestionConfig } = action.payload;
      const response = yield call(saveDcatIngestionConfig, ingestionConfig);
      return response;
    },

    /**
     * 运行mm资产采集任务
     * @param {*} action
     * @param {*} param1
     */
    *ingestionSelectRun(action, { call }) {
      const { ingestionId } = action.payload;
      const response = yield call(ingestionSelectRun, ingestionId);
      return response;
    },

    /**
     * 更新sql资产
     * @param {*} action
     * @param {*} param1
     */
    *updateSqlElement(action, { call }) {
      const { elements } = action.payload;
      const response = yield call(updateSqlElement, elements);
      return response;
    },

    /**
     * 删除sql资产
     * @param {*} action
     * @param {*} param1
     */
    *deleteSqlElement(action, { call }) {
      const { elementId } = action.payload;
      const response = yield call(deleteSqlElement, elementId);
      return response;
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
