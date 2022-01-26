import {
  getCatalogTree,
  saveOrUpdateCatalog,
  deleteCatalogsByIds,
  getCatalogDetailById,
} from '@/services/Dcat/catalog';
import DiResponse from '@/components/DiResponse';

export default {
  namespace: 'catalog',

  state: {
    catalogTree: [],
    catalog: {},
    catalogSaveResult: {},
  },

  effects: {
    /**
     * 获取目录树
     */
    *getCatalogTree({ payload }, { call, put }) {
      const { type } = payload;
      const catalogTree = yield call(getCatalogTree, type);
      yield put({
        type: 'saveState',
        payload: {
          catalogTree,
        },
      });
      return catalogTree;
    },

    /**
     * 保存或更新目录
     */
    *saveOrUpdateCatalog({ payload }, { call, put }) {
      const { catalog } = payload;
      const catalogSaveResult = yield call(saveOrUpdateCatalog, catalog);
      if (!catalogSaveResult) {
        DiResponse.error('信息保存失败');
        return catalogSaveResult;
      }
      if (catalogSaveResult.msg) {
        DiResponse.error(`信息保存失败,${catalogSaveResult.msg}`);
        return catalogSaveResult;
      }
      yield put({
        type: 'saveState',
        payload: { catalogSaveResult },
      });
      DiResponse.success('信息保存成功！');
      // 更新目录树信息
      const catalogTree = yield call(getCatalogTree, catalog.type);
      yield put({
        type: 'saveState',
        payload: {
          catalogTree,
        },
      });
      return catalogSaveResult;
    },

    /**
     * 删除目录节点
     */
    *deleteCatalogsByIds({ payload }, { call, put }) {
      const { ids, type } = payload;
      const response = yield call(deleteCatalogsByIds, ids);
      if (response && response.code === 200) {
        // 更新目录树信息
        const catalogTree = yield call(getCatalogTree, type);
        yield put({
          type: 'saveState',
          payload: {
            catalogTree,
          },
        });
      }
      return response;
    },

    /**
     * 获取单条目录信息
     */
    *getCatalogDetailById({ payload }, { call, put }) {
      const { keyValue } = payload;
      const catalog = yield call(getCatalogDetailById, keyValue);
      yield put({
        type: 'saveState',
        payload: {
          catalog,
        },
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
