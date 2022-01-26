import {
  deleteDataModel,
  getDataModel,
  getDataModelPageQuery,
  getStandardSets,
  saveDataModel,
  updateDataModel,
} from '@/services/Dm/dataModels';
import { message } from 'antd';

export default {
  namespace: 'dataModels',
  state: {
    dataModelTableResult: {
      total: 0,
      data: [],
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

  effects: {
    /**
     * 分页查询数据模型
     * @param {*} action
     * @param {*} param1
     */ *getDataModelPageQuery(action, { call, put }) {
      const result = yield call(getDataModelPageQuery, action.payload);
      if (result && result.code === 200) {
        const dataModelTableResult = {
          total: result.data.totalElements,
          data: result.data.content,
        };
        yield put({
          type: 'setState',
          payload: {
            dataModelTableResult,
          },
        });
      } else {
        message.error(result.msg);
      }
    },

    /**
     * 删除模型
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteDataModel(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteDataModel, id);
      if (result && result.code === 200) {
        message.success('数据模型删除成功！');
      } else {
        message.error(result.msg);
      }
    },

    /**
     * 保存数据模型
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveDataModel(action, { call }) {
      const { dataModel } = action.payload;
      const result = yield call(saveDataModel, dataModel);
      if (result && result.code === 200) {
        const model = result.data;
        return model;
      }
      message.error(result.msg);
      return null;
    },

    /**
     * 保存数据模型
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveDataModelInfo(action, { call }) {
      const { dataModel } = action.payload;
      const result = yield call(saveDataModel, dataModel);
      if (result && result.code === 200) {
        const model = result.data;
        message.success('数据模型保存成功！');
        return model;
      }
      message.error(result.msg);
      return null;
    },

    /**
     * 更新数据模型
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *updateDataModel(action, { call }) {
      const { dataModel } = action.payload;
      const result = yield call(updateDataModel, dataModel);
      if (result && result.code === 200) {
        const model = result.data;
        message.success('数据模型更新成功！');
        return model;
      }
      message.error(result.msg);
      return null;
    },

    /**
     * 获取数据模型详情
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getDataModel(action, { call }) {
      const { modelId } = action.payload;
      const result = yield call(getDataModel, modelId);
      if (result && result.code === 200) {
        const model = result.data;
        return model;
      }
      message.error(result.msg);
      return null;
    },

    /**
     *
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getStandardSets(_, { call }) {
      const result = yield call(getStandardSets);
      if (result && result.code === 200) {
        return result.data;
      }
      message.error(result.msg);
      return null;
    },
  },
};
