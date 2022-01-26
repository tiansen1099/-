import {
  systemVariablesSearch,
  systemVariableSave,
  variableSearchByName,
  systemVariableDelete,
} from '@/services/Dcat/systemVariable';

export default {
  namespace: 'systemvariable',

  state: {
    tableResult: {
      total: 0,
      data: [],
    },
  },

  effects: {
    /**
     * 查询系统变量
     */
    *systemVariablesSearch(action, { call, put }) {
      const response = yield call(systemVariablesSearch, action.payload);
      const tableResult = { total: response.data.iTotalRecords, data: response.data.data };
      yield put({
        type: 'setState',
        payload: {
          tableResult,
        },
      });
      return tableResult;
    },

    /**
     * 按名称查询系统变量
     */
    *variableSearchByName(action, { call, put }) {
      const response = yield call(variableSearchByName, action.payload.variableName);
      const tableResult = { total: response.data.iTotalRecords, data: response.data.data };
      yield put({
        type: 'setState',
        payload: {
          tableResult,
        },
      });
      return tableResult;
    },

    /**
     * 保存系统变量
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *systemVariableSave(action, { call }) {
      const { systemVariableInfo } = action.payload;
      const saveResponse = yield call(systemVariableSave, systemVariableInfo);
      return saveResponse;
    },

    /**
     * 删除系统变量
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *systemVariableDelete(action, { call }) {
      const { variableName } = action.payload;
      return yield call(systemVariableDelete, variableName);
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
