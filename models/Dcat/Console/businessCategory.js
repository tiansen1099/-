import { message } from 'antd';
import DiResponse from '@/components/DiResponse';
import {
  getBusinessCategoriesByType,
  deleteBusinessCategoryByIds,
  saveOrUpdateBusinessCategory,
  isCategoryInUse,
} from '@/services/Dcat/businessCategory';

const listToTree = oldArr => {
  const businesscategoriesTree = [];
  let treeChild = [];
  oldArr.forEach(element => {
    treeChild = element;
    if (element.parentId === null || element.parentId === '' || element.parentId === '-1') {
      if (element.parentId === '-1') {
        treeChild.treeLevel = 1;
      }
      oldArr.forEach(ele => {
        const childEle = ele;
        if (childEle.parentId === element.id) {
          childEle.treeLevel = 2;
          if (!treeChild.children) {
            treeChild.children = [];
          }
          treeChild.children.push(childEle);
        }
      });
      businesscategoriesTree.push(treeChild);
    }
  });
  return businesscategoriesTree;
};

export default {
  namespace: 'dcatBusinessCatetory',

  state: {
    businesscategories: [],
    businesscategoriesTree: [],
  },

  effects: {
    /**
     * 获取某种类型的业务分类列表
     */
    *getBusinesscategoriesByType(action, { put, call }) {
      const { type } = action.payload;
      const businesscategories = yield call(getBusinessCategoriesByType, type);
      const [...oldAttr] = businesscategories;
      const businesscategoriesTree = listToTree(oldAttr);
      yield put({
        type: 'setState',
        payload: {
          businesscategories,
          businesscategoriesTree,
        },
      });
      return businesscategories;
    },

    /**
     * 业务分类删除检验
     */
    *isCategoryInUse({ payload }, { call }) {
      const response = yield call(isCategoryInUse, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 保存或更新业务分类
     */
    *saveOrUpdateBusinessCategory({ payload }, { call, put }) {
      const { businessCategory } = payload;
      const response = yield call(saveOrUpdateBusinessCategory, businessCategory);
      if (response && response.code === 200) {
        message.success(response.msg);
        const businessCategorySaveResult = response.data;
        if (businessCategorySaveResult.parentId) {
          if (businessCategorySaveResult.parentId === '-1') {
            businessCategorySaveResult.treeLevel = 1;
          } else {
            businessCategorySaveResult.treeLevel = 2;
          }
        }
        yield put({
          type: 'saveState',
          payload: { businessCategorySaveResult },
        });
        // 更新目录树信息
        const businesscategories = yield call(getBusinessCategoriesByType, businessCategory.type);
        const [...oldAttr] = businesscategories;
        const businesscategoriesTree = listToTree(oldAttr);
        yield put({
          type: 'setState',
          payload: {
            businesscategories,
            businesscategoriesTree,
          },
        });
      }
      return response;
    },

    /**
     * 删除业务分类节点
     */
    *deleteBusinessCategoryByIds({ payload }, { call, put }) {
      const { ids, type } = payload;
      const response = yield call(deleteBusinessCategoryByIds, ids);
      if (response && response.code === 200) {
        // 更新目录树信息
        const businesscategories = yield call(getBusinessCategoriesByType, type);
        const [...oldAttr] = businesscategories;
        const businesscategoriesTree = listToTree(oldAttr);
        yield put({
          type: 'setState',
          payload: {
            businesscategories,
            businesscategoriesTree,
          },
        });
      }
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
