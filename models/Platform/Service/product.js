import { message } from 'antd';
import {
  queryProductMenu,
  queryProductList,
  queryAllBaseProduct,
  queryPagingBaseProduct,
  queryBaseProductByCode,
  saveOrUpdateBaseProduct,
  saveOrUpdateProduct,
  deleteBaseProduct,
  deleteProduct,
  queryProductsByDomainId,
  queryProductsByDomainIdAndCode,
  saveMenuRecord,
  getUserMenuRecordByUserId,
} from '@/services/Platform/Service/product';

export default {
  namespace: 'product',

  state: {
    productMenu: [],
    userProductList: [],
    pagingBaseProduct: {},
    baseProduct: {},
    productList: [],
    saveProductResult: {},
    deleteProductResult: {},
  },

  effects: {
    *saveUserMenuRecord({ payload }, { call, put }) {
      // const { menuUrl } = payload
      const userMenuRecord = yield call(saveMenuRecord, payload);
      yield put({
        type: 'saveState',
        payload: { userMenuRecord },
      })
    },

    *getUserMenuRecordByUserId(_, { call, put }) {
      const userMenuRecordsList = yield call(getUserMenuRecordByUserId);
      yield put({
        type: 'saveState',
        payload: { userMenuRecords: userMenuRecordsList.data },
      });
    },


    // 加载所有产品信息
    *loadProductMenu(_, { call, put }) {
      const productMenu = yield call(queryProductMenu);
      yield put({
        type: 'saveState',
        payload: { productMenu },
      });
      return productMenu;
    },

    /**
     * 加载用户所能查看的产品信息
     * @param {*} param0
     * @param {*} param1
     */
    *queryUserProductList(_, { call, put }) {
      const userProductList = yield call(queryProductList);
      yield put({
        type: 'saveState',
        payload: { userProductList },
      });
      return userProductList;
    },

    /**
     * 查询全部基础产品列表
     * @param {*} param0
     * @param {*} param1
     */
    *queryAllBaseProduct(_, { call, put }) {
      const response = yield call(queryAllBaseProduct);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { baseProductList: response.data },
        });
      }
    },

    /**
     * 分页查询baseProduct
     * @param {*} param0
     * @param {*} param1
     */
    *queryPagingBaseProduct({ payload }, { call, put }) {
      const { currentPage, pageSize, orderCol, orderDir, condition } = payload;
      const pagingBaseProduct = yield call(
        queryPagingBaseProduct,
        currentPage,
        pageSize,
        orderCol,
        orderDir,
        condition
      );
      yield put({
        type: 'saveState',
        payload: { pagingBaseProduct },
      });
      return pagingBaseProduct;
    },

    /**
     * 根据code查询基础产品信息
     * @param {*} param0
     * @param {*} param1
     */
    *queryBaseProduct({ payload }, { call, put }) {
      const { productcode } = payload;
      const baseProduct = yield call(queryBaseProductByCode, productcode);
      yield put({
        type: 'saveState',
        payload: { baseProduct },
      });
      return baseProduct;
    },

    /**
     * 根据域id获取域下的产品列表
     * @param {*} param0
     * @param {*} param1
     */
    *queryProductsByDomainId({ payload }, { call, put }) {
      const { domainId } = payload;
      const response = yield call(queryProductsByDomainId, domainId);
      yield put({
        type: 'saveState',
        payload: { productList: response },
      });
    },

    /**
     * 根据域id和code获取域下的产品列表
     * @param {*} param0
     * @param {*} param1
     */
    *queryProductsByDomainIdAndCode({ payload }, { call, put }) {
      const { domainId, productcode } = payload;
      const productList = yield call(queryProductsByDomainIdAndCode, domainId, productcode);
      yield put({
        type: 'saveState',
        payload: { productList },
      });
      return productList;
    },

    /**
     * 保存或更新服务信息
     */
    *saveOrUpdateProduct({ payload }, { call, put }) {
      const { productToSave } = payload;
      const { domainId, code } = productToSave;
      const saveProductResult = yield call(saveOrUpdateProduct, productToSave);
      yield put({
        type: 'saveState',
        payload: { saveProductResult },
      });
      // 加载保存后的服务信息
      const productList = yield call(queryProductsByDomainIdAndCode, domainId, code);
      yield put({
        type: 'saveState',
        payload: { productList },
      });
      // 加载菜单信息
      const productMenu = yield call(queryProductMenu);
      if (productMenu) {
        yield put({
          type: 'saveState',
          payload: { productMenu },
        });
      }
      // 加载userProduct
      const userProductList = yield call(queryProductList);
      yield put({
        type: 'saveState',
        payload: { userProductList },
      });
      return saveProductResult;
    },

    /**
     * 保存基础产品信息
     * @param {*} param0
     * @param {*} param1
     */
    *saveOrUpdateBaseProduct({ payload }, { call, put }) {
      const { baseProductToSave } = payload;
      const response = yield call(saveOrUpdateBaseProduct, baseProductToSave);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { saveBaseProductResult: response },
        });
        // 加载菜单信息
        const productMenu = yield call(queryProductMenu);
        if (productMenu) {
          yield put({
            type: 'saveState',
            payload: { productMenu },
          });
        }
      }
      return response;
    },

    /**
     * 删除基础产品信息
     * @param {*} param0
     * @param {*} param1
     */
    *deleteBaseProduct({ payload }, { call, put }) {
      const { baseProduct } = payload;
      const { id } = baseProduct;
      const response = yield call(deleteBaseProduct, id);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { deleteBaseProductResult: response },
        });
      }
      return response;
    },

    /**
     * 删除服务
     * @param {*} param0
     * @param {*} param1
     */
    *deleteProduct({ payload }, { call, put }) {
      const { product } = payload;
      const { id, domainId, code } = product;
      const response = yield call(deleteProduct, id);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { deleteProductResult: response },
        });
      } else {
        message.warning('服务信息删除失败！');
      }
      // 重新加载服务列表
      const productList = yield call(queryProductsByDomainIdAndCode, domainId, code);
      yield put({
        type: 'saveState',
        payload: { productList },
      });
      // 加载菜单信息
      const productMenu = yield call(queryProductMenu);
      if (productMenu) {
        yield put({
          type: 'saveState',
          payload: { productMenu },
        });
      }
      // 加载userProduct
      const userProductList = yield call(queryProductList);
      yield put({
        type: 'saveState',
        payload: { userProductList },
      });
      return response;
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
